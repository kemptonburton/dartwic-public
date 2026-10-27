---
summary: Understand client sessions, permissions, remote data ownership, and recovery.
created: 2026-09-06T14:36
updated: 2026-10-26T21:52
---

TEMPEST is the communication layer used by the Engine, Interfaces, clients, and connected nodes. An **operation** asks the Engine to do something and returns a response. **Telemetry** carries updates, such as channel values, to applications watching them.

A **peer** is another node linked to the Engine. For example, a test-stand Engine can share measurements with a ground-station Engine, which displays them and routes permitted commands back.

# Clients, permissions, and discovery

| Connection | Purpose |
| --- | --- |
| Interface / headless client → Engine | Operations and subscribed observations. |
| Engine → peer | Supported remote snapshots, events, logs, and commands. |
| UDP discovery query → Engine | Find an endpoint before registering a session. |

Registration creates a **session**: the Engine's record of a connected client and its permissions. It checks protocol compatibility and access credentials. Administrators can request changes subject to resource authority; viewers receive permitted read-only access. The Interface also identifies operator connections for manual override.

A **heartbeat** is a small operation that keeps a session active. After expiry or restart, the client registers again and restores its subscriptions—the updates it asked to receive. A timeout leaves an operation's completion unknown; inspect state before retrying a command with side effects.

Discovery finds a running Engine's address and port before connecting. It uses local UDP queries and can be blocked across networks, so retain a manual address option. Registration and authentication still follow. Use [Clients](../Clients/Overview.md) for libraries, [Using TEMPEST](Advanced/Using%20TEMPEST.md) for raw transports, or [Network Discovery](Advanced/Network%20Discovery.md) for discovery packets.

# Peer connections

TEMPEST peers exchange supported channel snapshots, ARGUS events, and commands between named nodes. The built-in `tempest.engine` peer connects two DARTWIC engines. Plugins can register other peer types with `registerPeer`; the [example workspace walkthroughs](../Getting%20Started/Example%20Workspace.md) show engine-to-engine, native C++ flight, and custom transport connections.

Give connected workspaces distinct node names, such as `GROUND` and `TEST_STAND`, and separate endpoints when running on one machine. A `tempest.engine` connection targets the remote Engine's base port and configured credentials. Use [Network Map](../Interface/Network%20Map.md#connect-and-reconnect) to configure it.

A remote channel appears as `TEST_STAND:tank_pressure`, keeping it distinct from a local `tank_pressure`. Use that qualified name in searches, schematic bindings, DCode references, and client requests. Writes are routed to the owning node and still obey its channel authority.

With `TEST_STAND` connected and publishing an existing pressure channel, a DCode body on `GROUND` can read the qualified name:

```dcode
remote_pressure = |TEST_STAND:tank_pressure|
```

This reads the latest locally cached observation. Check its source timestamp and peer availability before using it for control; it does not request a fresh device measurement.

The same connection can be configured through [`tempest/peers/connect`](Reference/TEMPEST/Operations/tempest/peers/connect.md). Its `rapid.publish_all` setting controls which local channels are sent; when false, list channel keys in `rapid.channels`. Enable ARGUS separately. A remembered connection is retried on later starts; its credentials belong to the local instance settings, not the portable workspace.

# Telemetry delivery

A **snapshot** is a set of observed channel records sent together. It gives a client the latest available state for its subscriptions, including signals whose values stayed the same.

Telemetry samples channels periodically rather than delivering every accepted write. A task does not commit all of its outputs as one atomic batch. The engine offers a complete `rapid/channels/snapshot` batch at 5 Hz, with full observed records for each client's subscribed channels, including unchanged values and missing-channel status. The batch includes its sequence and destination client ID. Busy slots can retain older observations and source timestamps. [Using TEMPEST](Advanced/Using%20TEMPEST.md#telemetry) explains the envelope and recipient filtering.

Several source writes can occur between snapshots. Use recorded samples to investigate those intermediate values; use recording diagnostics when history is missing.

A slow WebSocket receiver can fill its bounded delivery queue and lose new observations. Check transport drops and retained bytes in [Diagnostics](Diagnostics%20and%20Troubleshooting.md). The [delivery limits](Advanced/Recording%20and%20Delivery%20Tuning.md#websocket-delivery) do not change recording admission or HTTP command results.

# Remote channel freshness

A remote channel is a local copy of data supplied by its owner. Full peer snapshots update those copies and remove channels the owner deleted. Follow the same signal through its connection state:

| Observation | Interpretation |
| --- | --- |
| Snapshots arrive and the source timestamp advances | New source observations are reaching this Engine. |
| Snapshots arrive with the same source timestamp | Link activity continues; the sample itself may be old. |
| The peer is unavailable but a value remains | Cached data remains for inspection; it is not a current measurement. |

Built-in engine peers send complete owned-channel and ARGUS board snapshots at 5 Hz, including unchanged records. This is link delivery, not the source's acquisition or task rate. Plugin transports define which streams they support. The runnable flight peer exchanges channels, commands, ARGUS events, and logs in both native and custom modes.

# Disconnection and recovery

When a peer goes offline, its last known channels stay in RAPID and survive an Engine restart through the channel snapshot. Channels shows them as **Not Found**, and commands fail until reconnection. The retained numbers describe earlier observations.

After reconnection, confirm new snapshots arrive and inspect resulting state before repeating a timed-out command. The configured peer retains ownership of its cached channels while offline.

If a peer is removed or renamed, open **Channel Cleanup** from Channel Search or the References page. Review the channels with no current owner or references, then apply the Project action. Review possible references and incomplete scan warnings before applying; they do not prove a channel is unused.

Peer protocol topics use the `tempest-peer/channels/` and `tempest-peer/argus/` prefixes. Public engine operations use `tempest/peers/`. The engine's channel status and data responses include `available` separately from `exists` so clients can display cached offline data without treating the channel as commandable.

Use [Network Map](../Interface/Network%20Map.md) to inspect connection state, received snapshots, timestamps, and queue/drop evidence. A connection badge alone cannot establish that snapshots are arriving. Missing-snapshot warnings depend on the peer protocol and enabled streams; a transport that does not supply a stream has no expectation for it.
