---
summary: Register raw clients and exchange operations and telemetry over ZeroMQ or HTTP/WebSocket.
created: 2026-08-04T16:25
updated: 2026-10-26T14:16
---

TEMPEST is the communication layer between an Engine and its connected applications. An **operation** is a request with a response, such as reading events or changing a channel. **Telemetry** delivers updates to applications watching the system.

Most applications can use a [client library](../../Clients/Overview.md). This guide explains the raw connection for applications implementing the protocol themselves. The [operation reference](../Reference/TEMPEST/Operations/Overview.md) describes each request's application data.

Use [Network Discovery](Network%20Discovery.md) to find Engine addresses and base ports before connecting.

# Connection endpoints

An **endpoint** is an address and port where the Engine accepts a particular kind of connection. Its **base port** identifies the operation endpoint; adjacent ports serve telemetry and web connections. For a base port of 7000:

| Endpoint | Purpose |
| --- | --- |
| `tcp://host:7000` | ZeroMQ request/response operations. |
| `tcp://host:7001` | Outbound telemetry for ZeroMQ subscribers. |
| `http://host:7002/tempest/operation` | Web operations through HTTP POST. |
| `ws://host:7002/tempest/telemetry` | Web telemetry connection. |

Host, base port, and password come from the Engine configuration. Follow your client library's connection options when using a wrapper. Configure TLS through the deployment's web infrastructure for secure browser connections.

[TEMPEST Peer](../Networking%20and%20Peers.md) connects to the peer's existing base and telemetry ports. It does not bind a fresh pair of local server ports for each peer.

# Network discovery

[Network Discovery](Network%20Discovery.md) covers enabling discovery, UDP query/reply fields, a complete Python requester, and network limitations.

# Client registration

Registration creates a **session**: a client ID and permissions held by the Engine. Its **session token** authenticates later requests. Opening a socket establishes transport; the application must then register:

1. Send `register_client` with an empty `clientId` and `tempestCompatibilityVersion: 2`. Supply the engine password for administrator access, or `role: "viewer"` for permitted read-only access.
2. Check `error`, then save both `payload.clientId` and `payload.sessionToken`.
3. Include that ID and token in every subsequent operation, including periodic `heartbeat` calls.
4. For telemetry, connect the separate receiving socket and request any engine-specific subscriptions.
5. Send `unregister_client` before closing a session normally.

Registration is a normal operation envelope. Send this JSON as one ZeroMQ message or as the body of an HTTP POST to `/tempest/operation`:

```json
{
  "clientId": "",
  "name": "register_client",
  "payload": {
    "serverPassword": "YOUR_ENGINE_PASSWORD",
    "tempestCompatibilityVersion": 2,
    "username": "raw-socket-example"
  },
  "timestamp": 0
}
```

Registration must include `tempestCompatibilityVersion` matching the server; the current protocol value is `2`. A missing or mismatched value is rejected with `tempest_version_mismatch`. The client libraries supply this value themselves.

Use the exact key **`serverPassword`** inside `payload`. `username` is optional display metadata, not a separate account login. Other registration fields are retained as client metadata; the password is excluded. Supply only metadata intended to describe your client.

In these wire examples, `timestamp: 0` is a placeholder; send the current Unix-epoch time in **milliseconds**. A successful registration looks like:

```json
{
  "clientId": "SERVER_ASSIGNED_ID",
  "name": "register_client",
  "error": false,
  "payload": {
    "clientId": "SERVER_ASSIGNED_ID",
    "node_name": "PRIMARY_NODE",
    "instance_number": 1,
    "role": "admin",
    "sessionToken": "SERVER_ASSIGNED_TOKEN"
  },
  "timestamp": 0
}
```

Both `clientId` fields contain the assigned ID. `node_name` identifies the server's engine; `instance_number` distinguishes clients with the same username. An incorrect password returns `error: true` and an error message in `payload.error`. Do not continue with an empty ID.

For subsequent calls, put the assigned ID and token in the outer envelope:

```json
{
  "clientId": "SERVER_ASSIGNED_ID",
  "sessionToken": "SERVER_ASSIGNED_TOKEN",
  "name": "argus/get-active-events",
  "payload": { "limit": 100, "offset": 0 },
  "timestamp": 0
}
```

The password is needed at registration; subsequent operations authenticate with the session token. A ZeroMQ routing identity and the JSON `clientId` serve different purposes: ZeroMQ routes a reply to a socket, while TEMPEST uses `clientId` and `sessionToken` to authenticate the registered session. Do not invent the TEMPEST ID or substitute the socket identity.

For a viewer, register with `payload: {"role": "viewer", "tempestCompatibilityVersion": 2}`. No username or password is required, but the server must have `allow_viewers` enabled. Viewers receive their own session token and can call only viewer-enabled operations. An attempted mutation returns `permission_denied`; disabled viewer access returns `viewer_access_disabled`.

## Keep the session alive and reconnect

A **heartbeat** is a lightweight operation that tells the Engine the client is still active. Send it periodically while waiting for telemetry or user input:

| Operation name | Payload | Result |
| --- | --- | --- |
| `register_client` | `{ "serverPassword": "...", "username": "...", "tempestCompatibilityVersion": 2 }` | Allocates a new client ID. |
| `heartbeat` | `{}` | Returns `{ "status": "ok" }`. |
| `unregister_client` | `{}` | Removes the session and cancels its detached jobs; success has an empty payload. |

Use the saved ID for heartbeat and unregister operations. The current server expires clients after **15 seconds without an operation**, checked by maintenance roughly once per second. A heartbeat every **5 seconds** matches the web and Python clients; use enough margin for your connection and operation latency. Receiving telemetry does not refresh this timer, and sending WebSocket telemetry does not replace the operation heartbeat.

The server authenticates heartbeats as well as ordinary operations. If a call returns `authentication_required` because the session is invalid or expired, register again and restore subscriptions with the new ID and token. Re-register after a server restart as well; sessions and subscriptions are not durable across restarts. Avoid registering repeatedly while a working session is already active.

# ZeroMQ connections

**ZeroMQ** is the messaging library used on the base and telemetry ports. A **frame** is one part of its message. Use an implementation such as pyzmq: these sockets require ZeroMQ framing, not newline-delimited JSON over plain TCP. The HTTP/WebSocket path below uses standard web transports.

| Connection | Client socket | Frames visible to application code |
| --- | --- | --- |
| Base port, e.g. 7000 | `DEALER` connecting to the server's `ROUTER` | Send one UTF-8 JSON request frame; receive one JSON response frame. |
| Base port + 1, e.g. 7001 | `SUB` connecting to the server's `PUB` | Receive two frames: topic string, then JSON telemetry envelope. |

Use `DEALER`, not `REQ`: the server's reply does not include the empty delimiter required by REQ/REP framing. ZeroMQ adds its routing identity internally; do not add an identity or empty delimiter to the application message.

Keep at most one outstanding operation per DEALER socket. The server can execute requests concurrently and return replies out of order, and the operation envelope has no unique per-request correlation ID. If a request times out, close that socket before issuing another call so a late reply cannot be mistaken for the next result. Multiple independently owned sockets may use the same registered `clientId`; keep heartbeat traffic separate when a long-running operation could otherwise delay it.

## Python ZeroMQ example

Install `pyzmq` with `python -m pip install pyzmq`. Set `DARTWIC_PASSWORD`, then run this against an engine on base port 7000. It registers, requests a live diagnostic channel, receives updates for ten seconds, sends heartbeats, and unregisters. It only reads engine data.

```python
import json
import os
import time
import zmq

host, base_port = "127.0.0.1", 7000
password = os.environ["DARTWIC_PASSWORD"]
channel = "engine_dartwic_cpu_usage_percent"
context = zmq.Context()
client_id = ""
session_token = ""
subscriber = context.socket(zmq.SUB)
subscriber.setsockopt(zmq.LINGER, 0)
subscriber.setsockopt_string(zmq.SUBSCRIBE, "rapid/channels/snapshot")
subscriber.connect(f"tcp://{host}:{base_port + 1}")


def operation(name, payload):
    # A fresh socket per call also isolates replies arriving after a timeout.
    socket = context.socket(zmq.DEALER)
    socket.setsockopt(zmq.LINGER, 0)
    socket.setsockopt(zmq.SNDTIMEO, 3000)
    try:
        socket.connect(f"tcp://{host}:{base_port}")
        socket.send_json({
            "clientId": client_id,
            "sessionToken": session_token,
            "name": name,
            "payload": payload,
            "timestamp": time.time_ns() // 1_000_000,
        })
        if not socket.poll(3000, zmq.POLLIN):
            raise TimeoutError(f"No response to {name}")
        response = socket.recv_json()
        if response["error"]:
            raise RuntimeError(response["payload"]["error"])
        return response["payload"]
    finally:
        socket.close()


try:
    registration = operation("register_client", {
        "serverPassword": password,
        "tempestCompatibilityVersion": 2,
        "username": "raw-socket-example",
    })
    client_id = registration["clientId"]
    session_token = registration["sessionToken"]
    if not client_id:
        raise RuntimeError("Registration returned no client ID")
    initial = operation("dartwic/add-channel-to-telemetry", {
        "channel_name": channel,
    })
    print("Initial snapshot:", initial["snapshot"])

    deadline = time.monotonic() + 10
    next_heartbeat = time.monotonic() + 5
    while time.monotonic() < deadline:
        if time.monotonic() >= next_heartbeat:
            operation("heartbeat", {})
            next_heartbeat = time.monotonic() + 5
        if subscriber.poll(100, zmq.POLLIN):
            topic, body = subscriber.recv_multipart()
            message = json.loads(body)
            if topic.decode() == "rapid/channels/snapshot" and not message["error"]:
                payload = message["payload"]
                if payload.get("client_id") == client_id:
                    record = payload["channels"].get(channel)
                    if record is not None:
                        print(record)
finally:
    try:
        if client_id:
            operation("unregister_client", {})
    finally:
        subscriber.close()
        context.term()
```

There are **two subscriptions** involved: `SUBSCRIBE` filters topic prefixes in your local ZeroMQ socket; `dartwic/add-channel-to-telemetry` asks the engine to include a channel in your session's snapshots. One does not replace the other. The operation returns `snapshot` so you can initialize your display immediately. At 5 Hz, `rapid/channels/snapshot` carries complete current records for the subscribed set, including unchanged values. ZeroMQ subscription setup is asynchronous; PUB/SUB has no replay of missed updates.

Use [add-channels-to-telemetry](../Reference/TEMPEST/Operations/dartwic/add-channels-to-telemetry.md) with `channel_names` for a batch. Subscriptions are reference-counted: pair each add with [remove-channel-from-telemetry](../Reference/TEMPEST/Operations/dartwic/remove-channel-from-telemetry.md), or unregister when finished. ZeroMQ topic filters match prefixes, so compare the received topic when you need an exact match. The broadcast PUB socket can carry snapshots for other clients; check `payload.client_id` before processing the channel set. This recipient label is not encryption or a transport access boundary.

# HTTP and WebSocket connections

HTTP carries individual operation requests and responses. WebSocket keeps a connection open for telemetry updates. Register over HTTP before attaching its telemetry socket.

HTTP uses the **same registration and operation JSON**. POST to `http://host:7002/tempest/operation` with `Content-Type: application/json`. `serverPassword` goes in the administrator registration payload; later operation requests carry `clientId` and `sessionToken` in their JSON body. A successful operation returns HTTP 200; an operation error returns HTTP 400 with the JSON error envelope. Read the error body instead of discarding it.

## Python HTTP example

This uses only Python's standard library to register, read ARGUS events, and unregister:

```python
import json
import os
import time
from urllib.error import HTTPError
from urllib.request import Request, urlopen

url = "http://127.0.0.1:7002/tempest/operation"
client_id = ""
session_token = ""


def operation(name, payload):
    request = Request(url, method="POST", headers={
        "Content-Type": "application/json",
    }, data=json.dumps({
        "clientId": client_id, "sessionToken": session_token,
        "name": name, "payload": payload,
        "timestamp": time.time_ns() // 1_000_000,
    }).encode())
    try:
        stream = urlopen(request, timeout=3)
    except HTTPError as error:
        stream = error  # TEMPEST supplies its error envelope in the HTTP body.
    with stream:
        response = json.load(stream)
    if response["error"]:
        raise RuntimeError(response["payload"]["error"])
    return response["payload"]


try:
    registration = operation("register_client", {
        "serverPassword": os.environ["DARTWIC_PASSWORD"],
        "tempestCompatibilityVersion": 2,
        "username": "raw-http-example",
    })
    client_id = registration["clientId"]
    session_token = registration["sessionToken"]
    print(operation("argus/get-active-events", {"limit": 1, "offset": 0}))
finally:
    if client_id:
        operation("unregister_client", {})
```

For a longer-lived HTTP application, send the same heartbeat operation periodically. Browser applications can use `fetch` with this envelope; use `https` and `wss` when your deployment provides TLS.

## Attach a WebSocket telemetry connection

Register through HTTP first, then open `ws://host:7002/tempest/telemetry`. This socket carries telemetry JSON, not operation requests. Each incoming text message is one complete telemetry envelope; there is no separate topic frame.

The web transport authenticates the socket from the `sender` and `sessionToken` in its first telemetry message. This association is needed for telemetry routed to selected clients, including live channels. Use an empty topic for this initial identification, as the web client does:

```json
{
  "sender": "SERVER_ASSIGNED_ID",
  "sessionToken": "SERVER_ASSIGNED_TOKEN",
  "topic": "",
  "error": false,
  "payload": {},
  "timestamp": 0
}
```

Send this message after the WebSocket opens, then request `dartwic/add-channel-to-telemetry` over HTTP with the same ID and token. Process `rapid/channels/snapshot` messages through `payload.channels`, keyed by channel name. Keep HTTP heartbeats running; the identification message does not keep the session alive. Later client-to-server telemetry messages also require the session token and the appropriate role permission.

Closing the last identified WebSocket for a client unregisters that client in the current server, even if your HTTP code still has its ID. On a new session, register again, identify the new socket, and restore channel subscriptions. During graceful shutdown, stop heartbeat work, unregister, then close your sockets.

# Operations

With a connected Python client:

```python
response = client.operation("argus/get-active-events", {
    "limit": 100,
    "offset": 0,
})
response.raise_for_error()
for event in response.payload["events"]:
    print(event)
```

The client supplies connection and transport fields. Application code supplies the operation name and its payload. [Operation reference pages](../Reference/TEMPEST/Operations/Overview.md) describe the object inside `payload`, not an extra envelope you should nest around it.

# Responses and errors

A successful wire response has this shape:

```json
{
  "clientId": "client-identifier",
  "name": "argus/get-active-events",
  "error": false,
  "payload": { "events": [], "count": 0, "total_count": 0 },
  "timestamp": 0
}
```

Check `error` before reading the success payload. On failure it is `true`, and `payload.error` contains the server message; authentication and role rejections also include a `code`. There is no universal `success` field. Raw requests contain `clientId`, `sessionToken`, `name`, `payload`, and `timestamp`; your implementation supplies these fields when you bypass a client library.

A timeout can occur without any response. It does not prove that the engine never accepted the operation. Inspect resulting state before retrying a command whose effects must not repeat.

# Telemetry

A **topic** names a stream of telemetry, such as channel snapshots. The message **envelope** holds routing and status fields around its application `payload`. Server envelopes contain `sender`, `topic`, `error`, `payload`, and `timestamp`; client-to-server web telemetry also includes `sessionToken`. Topic names and operation names belong to separate namespaces.

Channel snapshots use `rapid/channels/snapshot` with a `sequence`, destination `client_id`, and full `channels` map. Each record separates `exists` from `available`: a cached offline peer can exist without being available for commands. The 5 Hz cadence is display delivery, not acquisition or recording frequency.

For live channels, request the engine's channel subscription and register the client-side topic handler; the [React guide](../../Clients/React%20Client.md) shows the wrapper's subscription helper. Merely reading a local store does not subscribe it to new values.

The raw ZeroMQ telemetry endpoint is outbound-only. To send data to the engine, use an operation or the bidirectional web telemetry transport. TEMPEST peer's frame operation and topic implement peer exchange; their transport name contains `v2`, independently of the TEMPEST peer protocol's current codec version.

Telemetry envelope timestamps use Unix-epoch milliseconds; recorded RAPID sample timestamps use **nanoseconds**. Use sample timestamps for exact history joins. The channel-range query accepts integer epoch milliseconds, microseconds, or nanoseconds and normalizes by magnitude; other operations have their own documented units.

# Detached jobs

A **detached job** is work that continues after its start operation returns, such as a large history query or export. The returned job ID lets the client track progress, fetch results, or request cancellation. Acceptance does not mean the result is ready.

| Operation | Action |
| --- | --- |
| [tempest/job-status](../Reference/TEMPEST/Operations/tempest/job-status.md) | Supply `job_id`; inspect `state`, progress, and the final `result`. |
| [tempest/job-cancel](../Reference/TEMPEST/Operations/tempest/job-cancel.md) | Request cancellation of a job owned by this client. |

States are `queued`, `running`, `completed`, `failed`, and `canceled`. Poll status at an interval appropriate to the job, stop at a terminal state, and handle `error` on failure. Cancellation is a request; inspect the final state before assuming work stopped. Jobs are scoped to the connected client that owns them.

When downloading a web job result, supply the `client_id` query parameter and authenticate with `Authorization: Bearer <sessionToken>` or `X-TEMPEST-Session`. Ordinary operation POSTs still use the JSON session token.

See [Recording and Retention](../Recording%20and%20Retention.md) for recording and query choices, [Execution and Timing](../Execution%20and%20Timing.md) for scheduling boundaries, and the [telemetry reference](../Reference/TEMPEST/Telemetry/Overview.md) for topic payloads.
