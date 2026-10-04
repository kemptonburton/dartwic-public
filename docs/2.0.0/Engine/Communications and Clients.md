---
updated: 2026-06-23T04:39
created: 2026-06-23
---

TEMPEST is the engine communications layer. The interface, Python client, React client, remote-node sharing, and other connected clients use it to call operations and receive telemetry.

# Operations

An operation is a request sent to the engine by name with a JSON payload. The engine routes it to a registered handler and returns a structured response.

Common operation families include:

| Family | Examples |
| --- | --- |
| runtime metadata | `dartwic/get-runtime-metadata`, `dartwic/get-connected-clients` |
| channels | `rapid/upsert-channel-path`, channel search, range query, CSV export |
| tasks | registered task queries and task control writes |
| projects and files | project list/select, file tree, file read/write, resource operations |
| modules | build, reload, save-and-reload, delete, list module instances |
| plugins | installed plugin lists, install/uninstall, plugin status |
| ARGUS | event queries, status updates, operator responses |
| RAPID Share | connect, disconnect, reconnect remembered nodes, list remote nodes, remote channel and task queries |

# Telemetry

Telemetry is server-pushed data from the engine to connected clients. It is used for live channel updates, event updates, client updates, project changes, remote resource sync, remote-node status, and long-running job progress.

The key distinction:

- operations are client-requested actions
- telemetry is engine-published state or notifications

# Connected Clients

Clients register with metadata such as client type, version, interface type, node name, and presentation information. The engine can list connected clients and publish client updates.

Client information matters for:

- command source labels such as `operator:<client-id>`
- collaborative interface presence
- cluster or node map views
- compatibility checks
- debugging who sent a command or operation

# RAPID Share And Remote Nodes

RAPID Share uses the same operation-and-telemetry model to connect this engine to remote engines and driver runtimes. The local engine can remember remote-node targets, reconnect them later, list their state for the interface, and expose remote metadata or channel snapshots.

Use RAPID Share when the operator workspace needs more than one runtime in view. Use normal clients when an external script, dashboard, or interface only needs to talk to one engine.

# Public Clients

DARTWIC currently documents:

- [Python Client](../Clients/Python%20Client.md): scripting, analysis, dataframe search, channel-key search, and range queries.
- [React Client](../Clients/React%20Client.md): interface and plugin-style React access to engine operations and channels.

# Read More

- [Python Query Example](../Clients/Python%20Query%20Example.md)
- [Python Client Reference](../Clients/Reference/Python/Overview.md)
- [React Client Reference](../Clients/Reference/React/Overview.md)
- [Telemetry and History](Telemetry%20and%20History.md)
- [RAPID Share and Remote Nodes](RAPID%20Share%20and%20Remote%20Nodes.md)
