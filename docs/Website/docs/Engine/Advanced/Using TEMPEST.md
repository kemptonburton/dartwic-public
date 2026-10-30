---
summary: Connect to Engines, call operations, receive telemetry, and build custom clients.
created: 2026-08-04T16:25
updated: 2026-10-28T19:58
---

# Overview

TEMPEST lets an application ask an Engine to do something (**operations**) and receive live updates (**telemetry**). The server runs inside the Engine; the Interface and your applications connect as clients.

The application examples use the [Python client library](../../Clients/Python%20Client.md). Build your own only when needed; [Custom Client](#custom-client) covers raw transports and wire messages. [Networking and Peers](../Networking%20and%20Peers.md) covers Engine setup.

# Available Transports

A transport carries the messages. TEMPEST is transport agnostic; the built-in client transports share the same operations and session rules:

| Transport | Operations | Telemetry |
| --- | --- | --- |
| ZeroMQ/TCP | `tcp://host:7000` | `tcp://host:7001` |
| HTTP/WebSocket | `http://host:7002/tempest/operation` | `ws://host:7002/tempest/telemetry` |

Adding custom transports for Clients is currently not supported, but might be added in the future. If custom transport is needed, Plugins can add [custom peer transports](../../Plugins/Building%20a%20Custom%20Peer.md#custom-transport-objects) for Peers. 

# Network Discovery

Discovery helps the Interface find Engines without entering their addresses. Enable it in [Engine settings](../Networking%20and%20Peers.md#discovery-configuration). The Python client connects to a known host and does not currently include a discovery API. The [UDP query format](#custom-network-discovery) is covered under Custom Discovery.

## Network Scope and Fallback

Discovery covers local IPv4 networks; routers and firewalls can block it. Keep a manual address option. DARTWIC's web Interface scans from its web host.

# Client Registration

A client is an application connected to the Engine's TEMPEST server. The Python library handles registration, compatibility checks, and session credentials when you connect.

Install it using [Python Client](../../Clients/Python%20Client.md#download-and-install-locally), then set your Engine password in the environment. Run the following application examples inside this connected scope:

```python
import os
from dartwic_client import DartwicClient

# Connect; leaving this scope disconnects the client.
with DartwicClient() as client:
    client.connect("127.0.0.1", 7000, os.environ["DARTWIC_PASSWORD"])
    # Put the following examples here.
```

## Viewer Access

The Engine can permit read-only viewer sessions. These Python examples use the Engine password; viewer registration fields for custom clients are shown below.

## Session Keepalive and Reconnect

The Python library sends authenticated heartbeats automatically. Its connection state changes when it detects session loss; detection is not instantaneous. It does not reconnect automatically: disconnect, connect again, and recreate your subscriptions. The context manager handles final cleanup.

# Operations

An operation asks a question or requests an action. For example, read active events through the Python library:

```python
response = client.operation("argus/get-active-events", {"limit": 1, "offset": 0})
response.raise_for_error()
print(response.payload["events"])
```

The [operation reference](../Reference/TEMPEST/Operations/Overview.md) lists operation names, arguments, and results. The library constructs the request envelope and supplies session credentials.

## Responses and Errors

Check the response before using its payload. The error check above raises an exception when the Engine rejects the request. A timeout does not prove a command was never accepted; inspect state before retrying an action with side effects.

# Telemetry

Telemetry keeps a dashboard updated without repeatedly asking for each value. The Python library manages the Engine subscription and calls your function for the initial record and later updates.

## Channel Subscriptions

This monitor keeps receiving the Engine CPU measurement until disconnected or interrupted:

```python
import time

# Keep callbacks short; later updates arrive on the telemetry thread.
def receive(snapshot):
    if snapshot["exists"] and snapshot.get("available", True):
        print(snapshot["channel_data"]["value"])

stop = client.subscribe_channel("engine_dartwic_cpu_usage_percent", receive)
try:
    while client.is_connected():
        time.sleep(1)
except KeyboardInterrupt:
    pass
finally:
    stop()
```

The returned stop function removes the subscription. The library handles topic filtering and message framing. Snapshots arrive at 5 Hz, including unchanged records; this is display delivery, not acquisition frequency. See [Python subscriptions](../../Clients/Python%20Client.md#subscribe-and-receive-telemetry) for callback behavior and the [telemetry reference](../Reference/TEMPEST/Telemetry/Overview.md) for topic fields.

# Detached Jobs

A long operation, such as an export, returns a job ID while work continues. Use the same Python client to check progress and collect the result. Replace the ID with one returned by your start operation:

```python
import time

job_id = "JOB_ID_FROM_START_RESPONSE"
while True:
    response = client.operation("tempest/job-status", {"job_id": job_id})
    response.raise_for_error()
    job = response.payload
    print(job["progress_percent"])
    if job["state"] not in ("queued", "running"):
        break
    time.sleep(0.5)

if job["state"] != "completed":
    raise RuntimeError(job.get("error") or job["state"])
print(job["result"])
```

To request cancellation, then keep checking until the job reaches a final state:

```python
response = client.operation("tempest/job-cancel", {"job_id": job_id})
response.raise_for_error()
```

Jobs belong to their session; a new registration cannot resume its old jobs. See [job status](../Reference/TEMPEST/Operations/tempest/job-status.md) for result fields.

# Custom Client

A **custom client** connects your own application to the Engine so it can request data, send commands, and receive live updates, just like the DARTWIC Interface. You can build one when the available [client libraries](../../Clients/Overview.md) do not support your language or environment.

These walkthroughs connect a dashboard, request active events, and continuously receive a channel's live values. Choose one transport and put its snippets in order in a single JavaScript module. Each step shows one part of the connection; recovery behavior is explained at the end.

## ZeroMQ

Use this for a native Node.js application. Install the ZeroMQ dependency:

```sh
npm install zeromq
```

**1. Send operations.** This helper supplies the session credentials, operation name, arguments, and current epoch milliseconds. It checks the reply for an error and returns the response payload. Each call uses a fresh DEALER socket so a late reply cannot be mistaken for another request's response.

```javascript
// Load the operation and telemetry socket types.
import {Dealer, Subscriber} from "zeromq";

// Engine address and session credentials.
const host = "127.0.0.1", port = 7000;
let session = {};

// Send one operation and return its payload.
async function rawOperation(name, payload = {}) {
  // Use a separate socket for this request.
  const socket = new Dealer({linger: 0, sendTimeout: 3000, receiveTimeout: 3000});

  try {
    // Connect and send the authenticated request.
    socket.connect(`tcp://${host}:${port}`);
    await socket.send(JSON.stringify({...session, name, payload, timestamp: Date.now()}));

    // Read the reply and report Engine errors.
    const [body] = await socket.receive();
    const response = JSON.parse(body);
    if (response.error) throw new Error(response.payload.error);
    return response.payload;
  } finally {
    // Always release the request socket.
    socket.close();
  }
}
```

Use DEALER, not REQ: TEMPEST does not supply the empty reply delimiter REQ expects.

**2. Register and send an operation.** Replace the password, save the session credentials, then request active events:

```javascript
// Register this application.
const registered = await rawOperation("register_client", {
  serverPassword: "YOUR_ENGINE_PASSWORD", tempestCompatibilityVersion: 3,
});

// Save the credentials used by later requests.
session = {clientId: registered.clientId, sessionToken: registered.sessionToken};

// Call an operation and display its result.
console.log(await rawOperation("argus/get-active-events", {limit: 1, offset: 0}));
```

For read-only access, if the Engine permits viewers, use this registration payload instead:

```json
{
  "role": "viewer",
  "tempestCompatibilityVersion": 3
}
```

**3. Receive live updates.** The SUB socket receives a topic frame and a JSON frame. Filter for this client and use each received record to update your dashboard:

```javascript
// Listen for channel snapshots on the telemetry port.
const channel = "engine_dartwic_cpu_usage_percent";
const subscriber = new Subscriber({linger: 0});
subscriber.subscribe("rapid/channels/snapshot");
subscriber.connect(`tcp://${host}:${port + 1}`);

// Deliver only snapshots addressed to this client.
async function rawTelemetry(topic, receive) {
  for await (const [name, body] of subscriber) {
    const message = JSON.parse(body);
    if (name.toString() === topic && !message.error
        && message.payload.client_id === session.clientId) receive(message.payload);
  }
}

// Keep updating the dashboard as messages arrive.
const receiving = rawTelemetry("rapid/channels/snapshot", snapshot => {
  console.log(snapshot.channels[channel]); // Update your dashboard here.
});

// Ask the Engine to publish this channel.
await rawOperation("dartwic/add-channel-to-telemetry", {channel_name: channel});
```

**4. Keep the session alive.** This sends a heartbeat every five seconds while the receive loop keeps running:

```javascript
// Keep the registered session alive while receiving telemetry.
const heartbeat = setInterval(() => {
  rawOperation("heartbeat").catch(error => {
    console.error(error);
    close().catch(console.error);
  });
}, 5000);
```

**5. Close or reconnect.** Stop the timer, unregister, and close the subscriber. Ctrl+C closes this Node.js example; a receive error also triggers cleanup.

```javascript
// Stop once, even if several events request cleanup.
let closed = false;

async function close() {
  if (closed) return;
  closed = true;
  clearInterval(heartbeat);

  // Unregister, then release the transport even if that fails.
  try { await rawOperation("unregister_client"); }
  finally { subscriber.close(); }
}

// Clean up on Ctrl+C or a receive error.
process.once("SIGINT", () => close().catch(console.error));
receiving.catch(error => { console.error(error); close().catch(console.error); });
```

If the session or connection is lost, register again and restore the channel subscription before restarting the receive loop. Do not automatically retry application commands.

## HTTP and WebSocket

Use HTTP for requests and WebSocket for continuous dashboard updates. These snippets work in Node.js 22 or a browser module. Use HTTPS/WSS for secure pages; cross-origin requests need deployment support or a same-origin proxy.

**1. Send operations.** Supply the session credentials, operation name, arguments, and current epoch milliseconds. Read the JSON error body even when HTTP returns an error status:

```javascript
// Engine endpoint and session credentials.
const url = "http://127.0.0.1:7002/tempest/operation";
let session = {};

// Send an operation through HTTP.
async function rawOperation(name, payload = {}) {
  const response = await fetch(url, {
    method: "POST", headers: {"Content-Type": "application/json"},
    body: JSON.stringify({...session, name, payload, timestamp: Date.now()}),
    signal: AbortSignal.timeout(3000),
  });

  // HTTP error responses also contain a TEMPEST error body.
  const result = await response.json();
  if (result.error) throw new Error(result.payload.error);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return result.payload;
}
```

**2. Register and ask a question.** The session works the same way as ZeroMQ:

```javascript
// Register this application.
const registered = await rawOperation("register_client", {
  serverPassword: "YOUR_ENGINE_PASSWORD", tempestCompatibilityVersion: 3,
});

// Save the credentials used by later requests.
session = {clientId: registered.clientId, sessionToken: registered.sessionToken};

// Call an operation and display its result.
console.log(await rawOperation("argus/get-active-events", {limit: 1, offset: 0}));
```

For read-only access, if the Engine permits viewers, use this registration payload instead:

```json
{
  "role": "viewer",
  "tempestCompatibilityVersion": 3
}
```

**3. Receive live updates.** Open the WebSocket and identify it using the registered session:

```javascript
// Open the telemetry connection.
const socket = new WebSocket("ws://127.0.0.1:7002/tempest/telemetry");
await new Promise((resolve, reject) => {
  socket.onopen = resolve;
  socket.onerror = reject;
});

// Associate this socket with the registered client.
socket.send(JSON.stringify({sender: session.clientId, sessionToken: session.sessionToken,
  topic: "", error: false, payload: {}, timestamp: Date.now()}));
```

Each message event is another iteration of the browser's receive loop. Attach a callback, then request the channel:

```javascript
// Read incoming snapshots for this client.
const channel = "engine_dartwic_cpu_usage_percent";

function rawTelemetry(topic, receive) {
  socket.onmessage = ({data}) => {
    const message = JSON.parse(data);
    if (message.topic === topic && !message.error
        && message.payload.client_id === session.clientId) receive(message.payload);
  };
}

// Update the dashboard for every matching message.
rawTelemetry("rapid/channels/snapshot", snapshot => {
  console.log(snapshot.channels[channel]); // Update your dashboard here.
});

// Enable the channel stream on the Engine.
await rawOperation("dartwic/add-channel-to-telemetry", {channel_name: channel});
```

**4. Keep the session alive.** WebSocket traffic does not replace the heartbeat operation:

```javascript
// Keep the registered session alive while receiving telemetry.
const heartbeat = setInterval(() => {
  rawOperation("heartbeat").catch(error => {
    console.error(error);
    close().catch(console.error);
  });
}, 5000);
```

**5. Close or reconnect.** Call close when the dashboard view exits. Node.js also closes on Ctrl+C:

```javascript
// Stop once, even if several events request cleanup.
let closed = false;

async function close() {
  if (closed) return;
  closed = true;
  clearInterval(heartbeat);

  // Unregister, then release the transport even if that fails.
  try { await rawOperation("unregister_client"); }
  finally { socket.close(); }
}

// Clean up on disconnect or Node.js shutdown.
socket.onclose = () => close().catch(console.error);
if (typeof process !== "undefined") {
  process.once("SIGINT", () => close().catch(console.error));
}
```

Closing the last WebSocket unregisters its client. To reconnect, register a new session, identify the new socket, and restore subscriptions. Keep your application's recovery policy separate from the message examples.

# Custom Network Discovery

Custom discovery lets your application find Engine addresses through UDP before connecting as a client. It is separate from the ZeroMQ and HTTP/WebSocket operation transports.

From each relevant local IPv4 adapter, send this UTF-8 JSON to multicast group **239.255.77.77**, UDP port **47600** (or the configured port). Use an ephemeral source port and multicast TTL 1:

```json
{"type":"tempest.discover","version":1,"nonce":"random-round-id"}
```

Each reply returns to the same socket and echoes your round ID:

```json
{
  "type": "tempest.server",
  "version": 1,
  "nonce": "random-round-id",
  "instance_id": "123456789-987654321",
  "node_name": "Example",
  "workspace_name": "example-workspace",
  "port": 7000,
  "address": ""
}
```

Use the advertised address, or the packet's source IP when it is empty, with the returned connection base port. Collect replies briefly, validate their fields and nonce, and deduplicate by instance ID. Queries are limited to 256 bytes and the nonce to 64 bytes; each Engine allows 64 replies per second.

## Python Example

This standard-library script prints the Engines that reply within 1.2 seconds. It searches this computer by default; for a LAN search, replace the interface address with your computer's Ethernet/Wi-Fi IPv4 address.

```python
import json
import secrets
import socket
import time

# Choose the local adapter and identify this discovery round.
interface = "127.0.0.1"
nonce = secrets.token_hex(8)
query = json.dumps({"type": "tempest.discover", "version": 1, "nonce": nonce})

with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
    # Send the query; replies return to this socket's temporary port.
    sock.bind((interface, 0))
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_IF, socket.inet_aton(interface))
    sock.setsockopt(socket.IPPROTO_IP, socket.IP_MULTICAST_TTL, 1)
    sock.sendto(query.encode(), ("239.255.77.77", 47600))

    # Collect matching replies until the discovery window ends.
    deadline = time.monotonic() + 1.2
    while (remaining := deadline - time.monotonic()) > 0:
        sock.settimeout(remaining)
        try:
            data, sender = sock.recvfrom(2048)
            reply = json.loads(data)
        except socket.timeout:
            break
        except (ValueError, UnicodeError):
            continue

        # Use the advertised address, or the reply's source IP.
        if isinstance(reply, dict) and (
            reply.get("type"), reply.get("version"), reply.get("nonce")
        ) == ("tempest.server", 1, nonce):
            address = reply.get("address") or sender[0]
            print(reply["node_name"], address, reply["port"])
```

Save it as `discover.py` and run `python discover.py`. Change UDP port `47600` if your Engines use another discovery port. The output gives a node name, IP, and connection base port to use with the [Python client](../../Clients/Python%20Client.md#connect); discovery itself does not log in.
