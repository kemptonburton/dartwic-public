---
summary: Find Engine endpoints with local UDP discovery and implement a discovery requester.
created: 2026-10-26
updated: 2026-10-26
---

**Discovery** finds running Engines without requiring their addresses in advance. A short IPv4 UDP query collects address/base-port replies before normal connection. The standalone Python example uses only the standard library.

TEMPEST client and peer libraries do not currently provide discovery APIs or announce themselves through this service. An application can implement its own UDP requester using the protocol below; the example is application code, not a built-in client or peer feature.

# Enable the server

In DARTWIC, enable **Engine settings > Enable network discovery** and set **Network discovery port** (default `47600`). Restart the engine to apply changes. Its normal TEMPEST connection port can be different. Multiple servers can share the same discovery port.

The Engine starts its responder after the built-in transports; shutdown closes the socket and joins its worker. A discovery bind or multicast-join failure logs a warning while ordinary connections remain available. Configure the Engine's TEMPEST bind IP as a concrete adapter address to restrict the listener, or `127.0.0.1` for local-only access.

# Query and collect replies

A **nonce** is a random ID for one discovery round. The server echoes it so the requester can match replies to its query.

1. Open an IPv4 UDP socket on a local adapter address and an ephemeral source port. Set its multicast interface to that address and multicast TTL to `1`.
2. Send the query below to multicast group **`239.255.77.77`**, using the server's discovery port. Query each relevant local adapter, including loopback. You need the configured discovery ports; discovery does not search all ports or IP ranges.
3. Receive unicast replies on those same sockets for a bounded collection window, such as 1.2 seconds. Keep listening after the first reply to find multiple servers.
4. Validate the reply version, nonce and field types. Merge duplicate replies by `instance_id`, retaining alternative addresses when a server answers through several adapters.
5. Connect to the advertised address and **connection base port**, then perform normal registration, compatibility checks and authentication. See [Client registration](Using%20TEMPEST.md#client-registration).

The query is JSON without a TEMPEST operation envelope:

```json
{"type":"tempest.discover","version":1,"nonce":"your-random-round-id"}
```

A server echoes the nonce in its reply:

```json
{
  "type": "tempest.server",
  "version": 1,
  "nonce": "your-random-round-id",
  "instance_id": "123456789-987654321",
  "node_name": "Example",
  "workspace_name": "example-workspace",
  "port": 7000,
  "address": ""
}
```

Use a nonempty `address` as the endpoint IP; otherwise use the UDP packet's source IP. The discovery port identifies the UDP query service, while `port` identifies the connection endpoint. `workspace_name` is the workspace folder's display name, without its path. It is optional for older responders; treat a missing value as unknown. Instance IDs identify a responder lifetime and change when it restarts; node names alone cannot distinguish multiple servers.

Queries are limited to 256 bytes, with a nonce of at most 64 bytes. Each server admits at most 64 replies per second. Collect periodically or on user request rather than continuously flooding queries. A reply is an unauthenticated location hint, not proof of compatibility, permissions or device health. No credentials are included.

# Python discovery example

Save this as `discover_tempest.py`. The arguments are **your application's local adapter IPs**, not server addresses. Include `127.0.0.1` for servers on the same computer and your Ethernet/Wi-Fi adapter's IPv4 address for nearby servers. An application can obtain these addresses from its host's adapter-enumeration API and pass them to the same function.

```python
import ipaddress
import json
import secrets
import select
import socket
import sys
import time
from contextlib import ExitStack


def discover_tempest(interface_ips, discovery_ports=(47600,), timeout=1.2):
    """Collect endpoint hints synchronously; returning does not connect."""
    interfaces = list(dict.fromkeys(str(ipaddress.IPv4Address(ip)) for ip in interface_ips))
    ports = list(dict.fromkeys(discovery_ports))
    if not 1 <= len(interfaces) <= 64 or not 1 <= len(ports) <= 16:
        raise ValueError("Choose 1-64 adapters and 1-16 discovery ports")
    if any(type(port) is not int or not 1 <= port <= 65535 for port in ports):
        raise ValueError("Discovery ports must be integers between 1 and 65535")
    if not 0 < timeout <= 10:
        raise ValueError("Choose a collection window up to 10 seconds")
    nonce = secrets.token_hex(16)
    query = json.dumps({"type": "tempest.discover", "version": 1, "nonce": nonce}).encode()
    found = {}
    with ExitStack() as stack:
        sockets = []
        for interface in interfaces:
            sock = stack.enter_context(socket.socket(socket.AF_INET, socket.SOCK_DGRAM))
            try:
                sock.bind((interface, 0))
                sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton(interface))
                sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)
                sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_LOOP, 1)
                sock.setblocking(False)
                for port in ports:
                    sock.sendto(query, ("239.255.77.77", port))
                sockets.append(sock)
            except OSError as error:
                print(f"Discovery unavailable on {interface}: {error}", file=sys.stderr)
        deadline = time.monotonic() + timeout
        while sockets and (remaining := deadline - time.monotonic()) > 0:
            ready, _, _ = select.select(sockets, [], [], remaining)
            for sock in ready:
                try:
                    data, remote = sock.recvfrom(1537)
                    if len(data) > 1536:
                        continue
                    reply = json.loads(data)
                    if not isinstance(reply, dict):
                        continue
                    if reply.get("type") != "tempest.server" or type(reply.get("version")) is not int or reply["version"] != 1 or reply.get("nonce") != nonce:
                        continue
                    identity, name, port = reply.get("instance_id"), reply.get("node_name"), reply.get("port")
                    workspace_name = reply.get("workspace_name", "")
                    if not isinstance(workspace_name, str) or len(workspace_name) > 256:
                        continue
                    if not isinstance(identity, str) or not 1 <= len(identity) <= 128 or not isinstance(name, str) or len(name) > 256:
                        continue
                    if type(port) is not int or not 1 <= port <= 65532:
                        continue
                    address = reply.get("address", "")
                    if not isinstance(address, str):
                        continue
                    ip = ipaddress.IPv4Address(address or remote[0])
                    if ip.is_unspecified or ip == ipaddress.IPv4Address("255.255.255.255"):
                        continue
                    if identity not in found and len(found) >= 128:
                        continue
                    entry = found.setdefault(identity, {"node_name": name, "workspace_name": workspace_name, "endpoints": set()})
                    if len(entry["endpoints"]) < 16:
                        entry["endpoints"].add((str(ip), port))
                except (OSError, ValueError):
                    continue
    return found


if __name__ == "__main__":
    for identity, server in discover_tempest(sys.argv[1:] or ["127.0.0.1"]).items():
        print(identity, server["workspace_name"], server["node_name"], sorted(server["endpoints"]))
```

Run `python discover_tempest.py 127.0.0.1 192.168.1.20`, replacing the LAN address with one assigned to your computer. Omit it for a local-only search. For custom discovery ports, call `discover_tempest(["127.0.0.1", "192.168.1.20"], discovery_ports=(47600, 48700))` from your application.

This function blocks the caller during collection and closes every socket before returning. Run it on a background worker for a graphical application and outside control callbacks. It retains at most 128 server instances and 16 endpoints per instance. An empty result means no valid replies arrived during that round; it does not establish that no servers exist.

# Network scope and fallback

Discovery covers IPv4 on the local network. Loopback-bound servers reject non-loopback queries. Disabled or older responders, IPv6-only servers, routed networks, firewalls and multicast filtering can prevent replies. Keep a manual host/base-port connection option. Ordinary browser JavaScript cannot open these UDP sockets; a browser UI needs a native or backend discovery service. DARTWIC's web Interface discovers from its web host, not from the browser's computer.

Local Windows responder/host tests cover multiple servers and custom ports. The Python example is checked against a local UDP fixture; cross-machine and other operating-system behavior require deployment testing.
