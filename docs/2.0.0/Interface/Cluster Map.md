---
updated: 2026-06-23
created: 2026-06-23
---

Cluster Map shows the live DARTWIC runtime cluster: the local engine, the connected interface, connected clients, remote nodes, driver runtimes, and health or traffic metrics that explain what is moving.

# What It Is For

Use Cluster Map when you need to answer:

- which engine am I connected to?
- which clients are connected right now?
- which remote nodes are connected or remembered?
- is a remote node online, disconnected, or failing to report?
- are telemetry and RAPID operations flowing?
- where is a remote channel likely coming from?

# What It Shows

| Item | Meaning |
| --- | --- |
| local engine | The engine currently serving the interface. |
| local interface client | The UI session you are using. |
| connected clients | Python clients, React clients, other interfaces, plugins, or tools connected to the engine. |
| remote nodes | Remote engines or driver runtimes connected through RAPID Share. |
| remembered nodes | Saved remote-node targets that may reconnect later. |
| runtime metadata | Node kind, node name, runtime version, and reported capabilities where available. |
| RAPID metrics | Memory operations, telemetry rate, channel activity, and related runtime indicators. |

# Remote Node States

| State | Meaning |
| --- | --- |
| connected | The local engine can currently communicate with the remote runtime. |
| remembered | The connection target is saved and can be reconnected later. |
| disconnected | The node is known, but the local engine is not currently connected to it. |
| error | A recent connection, polling, or metadata request failed. Check host, port, password, and runtime state. |

A disconnected remembered node is still useful information. It tells the operator that the project expects that node, even if it is not online now.

# Common Actions

| Action | Use It When |
| --- | --- |
| inspect a node | You need node name, kind, connection state, or recent metrics. |
| reconnect remembered nodes | A known remote node should come back after engine startup or network recovery. |
| disconnect a remote node | You need to stop sharing from a remote runtime. |
| forget a node | The project should no longer remember or reconnect that target. |
| follow channels into Channel Search | You need to inspect live values, fields, or freshness for a remote node. |

# Metrics To Watch

| Metric | Why It Matters |
| --- | --- |
| telemetry ingest rate | Confirms whether live values are arriving. |
| RAPID memory operations | Shows whether channel reads and writes are actively flowing. |
| client count | Helps identify unexpected tools, dashboards, or interface sessions. |
| last update or operation time | Helps separate a quiet node from a disconnected one. |
| remote error text | Gives the first clue for password, host, port, or runtime mismatch issues. |

# Troubleshooting

| Symptom | First Checks |
| --- | --- |
| expected remote node is missing | Confirm it is remembered or connect it through the RAPID Share workflow. |
| node is remembered but disconnected | Check whether the remote runtime is running and reachable on its configured host and port. |
| node is connected but channels look stale | Open Channel Search and check channel timestamps, stale timeout, and remote source naming. |
| command goes to the wrong place | Check the remote node identity before writing and verify command provenance in the target channel. |
| map updates lag | Check engine load, client count, and telemetry rate before assuming the remote node is broken. |

# Read More

- [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md)
- [Communications and Clients](../Engine/Communications%20and%20Clients.md)
- [Channel Search](Channel%20Search.md)
- [Telemetry Exporter](Telemetry%20Exporter.md)
