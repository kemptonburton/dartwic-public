---
updated: 2026-06-23
created: 2026-06-23
---

RAPID Share connects one DARTWIC runtime to another remote node. Use it when a local interface needs to see channels, tasks, metadata, or diagnostics from another engine, driver runtime, simulator, or remote data source.

# What It Is

RAPID Share is the engine-side sharing layer for remote DARTWIC nodes. A local engine keeps its own RAPID state, then connects to remote peers and exposes enough metadata for the interface and clients to show the wider system.

Common uses:

- monitor a remote engine from the local interface
- bring remote-node channels into the operator workspace
- reconnect known field nodes after an engine restart
- inspect remote task and runtime metadata
- debug whether a value is local, remote, stale, disconnected, or missing

# Main Concepts

| Concept | Meaning |
| --- | --- |
| local engine | The engine the current interface or client is connected to. |
| remote peer | Another DARTWIC engine or driver runtime reachable over TEMPEST. |
| remote node | A remote runtime used to publish field, driver, simulator, or site-local data. |
| remembered connection | A saved remote connection that DARTWIC can list and reconnect later. |
| remote channel | A channel that originates from a connected remote node rather than the local engine. |
| remote metadata | Information such as node name, runtime kind, client state, and available tasks. |

# Operations You May See

These names matter when reading logs, writing clients, or debugging a plugin:

| Operation | Purpose |
| --- | --- |
| `dartwic/rapid-share/connect` | Connect the local engine to a remote engine or driver runtime. |
| `dartwic/rapid-share/disconnect` | Disconnect a remote node. When `forget` is true, remove the remembered connection too. |
| `dartwic/rapid-share/reconnect-remembered` | Reconnect saved remote nodes after startup or a manual reconnect action. |
| `dartwic/rapid-share/list` | List connected and remembered remote nodes for interface views such as Cluster Map. |
| `rapid-share/get-runtime-metadata` | Ask a remote runtime what it is and what it exposes. |
| `rapid-share/list-channels` | Ask a remote runtime for available channels. |
| `rapid-share/get-channel` | Read a remote channel snapshot. |
| `rapid-share/upsert-channel-path` | Write or update a remote channel path when the remote runtime accepts it. |
| `rapid-share/list-tasks` | Ask a remote runtime for its task list. |

# Remembered Connections

DARTWIC stores remembered remote-node connections in the project resources directory as `edge_node_connections.json`.

Remembered connection fields include:

| Field | Meaning |
| --- | --- |
| `kind` | Remote runtime kind, usually `engine` or `driver`. |
| `host` | Remote host or address. |
| `port` | Remote TEMPEST port. |
| `password` | Connection password when one is required. |
| `poll_interval_ms` | How often DARTWIC should poll the remote runtime. |
| `node_name` | Optional display name for the remote node. |

A remembered node can appear while disconnected. In that state, the interface should treat it as a known target that is currently offline, not as a live data source.

# Remote Channels

Remote channels should keep their remote-node identity visible. This is important because the same channel name can exist on more than one node.

When troubleshooting remote channels, check:

| Question | What To Look For |
| --- | --- |
| Is the remote node connected? | Cluster Map or `dartwic/rapid-share/list`. |
| Is the channel listed by the remote runtime? | `rapid-share/list-channels` or Channel Search if the channel is surfaced locally. |
| Is the value stale? | Channel timestamp, stale timeout, and not-found status. |
| Is the source clear? | Remote node prefix, path convention, or source metadata. |
| Is a write allowed? | The same command authority rules still matter for writable remote fields. |

# Remote Commands

Treat remote writes as deliberate commands, not as anonymous value changes.

Before writing a remote channel:

1. Confirm the node you are writing to.
2. Confirm the field is actually writable.
3. Confirm the command source and controller identity are clear.
4. Confirm downstream automation expects that value to change.
5. Confirm how the command will be released or superseded.

Remote command provenance should make it obvious which node and client initiated the write. If a value is shared across nodes, avoid labels that hide the original node.

# Events And Updates

The engine publishes `dartwic/rapid-share/updated` when remote sharing state changes. Interface views use this to refresh connected-node state without requiring a full reload.

Remote channel snapshots may also be published so clients can keep a local view of remote channel state. A quiet remote channel, a stale remote channel, a disconnected node, and a missing channel are different conditions; operators need those differences preserved.

# Read More

- [Cluster Map](../Interface/Cluster%20Map.md)
- [Communications and Clients](Communications%20and%20Clients.md)
- [Channels](Channels.md)
- [Commanding and Control](Commanding%20and%20Control.md)
- [Telemetry and History](Telemetry%20and%20History.md)
