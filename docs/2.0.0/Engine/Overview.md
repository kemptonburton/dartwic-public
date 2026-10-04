---
updated: 2026-06-23T04:39
created: 2026-06-23
---

The DARTWIC engine is the runtime host. It is where live data is stored, automation runs, commands are accepted or rejected, events are recorded, plugins are loaded, and clients connect.

# Engine Components

| Component | Role |
| --- | --- |
| RAPID | Live channel storage, channel metadata, command authority, and historical persistence. |
| CAESAR | Runtime task and loop orchestration. It runs periodic tasks, worker tasks, and state machines. |
| ARGUS | Event and operator-action recording for errors, warnings, messages, prompts, holds, aborts, process output, and operation observations. |
| TEMPEST | Operation and telemetry transport used by the interface, Python client, React client, and other connected clients. |
| RAPID Share | Remote runtime sharing for connected engines, driver runtimes, and remembered remote nodes. |
| DCode | DARTWIC scripting for easy automation logic using existing channels. |
| Modules | Custom C++ runtime lifecycle for plugins, usually device drivers or integrations with external data sources. |
| Plugins | Installable packages that can add engine modules, task types, DCode functions, interface resources, and UI components. |

# Main Engine Topics

- [Channels](Channels.md): the RAPID data model, channel fields, recording, mapping, and scaling.
- [Commanding and Control](Commanding%20and%20Control.md): how writes are accepted, blocked, claimed by tasks, or manually overridden.
- [Telemetry and History](Telemetry%20and%20History.md): latest values, historical samples, range queries, bucketing, and export behavior.
- [Tasks](Tasks.md): CAESAR task structures, task control channels, and DCode task blocks.
- [Modules](Modules.md): custom C++ runtime objects for drivers, external systems, and plugin-owned engine behavior.
- [DCode and Scripting](DCode%20and%20Scripting.md): where DCode fits in the engine and when to use it.
- [Events and ARGUS](Events%20and%20ARGUS.md): engine events, prompts, holds, aborts, statuses, and event queries.
- [Communications and Clients](Communications%20and%20Clients.md): TEMPEST operations, telemetry, connected clients, and public client libraries.
- [RAPID Share and Remote Nodes](RAPID%20Share%20and%20Remote%20Nodes.md): remote engine and driver-runtime sharing, remembered nodes, and remote channel behavior.

# Choosing The Right Extension Point

| Need | Use |
| --- | --- |
| Easy automation using channels already available in DARTWIC | DCode task or DCode channel calculation |
| Start/stop/hold lifecycle around runtime logic | CAESAR task |
| C++ lifecycle, hardware connection, custom device driver, or external data-source integration | Engine module in a plugin |
| Custom operator UI, resource page, schematic node, or settings surface | Interface plugin |
| External analysis, dashboards, or scripts talking to a running engine | Python or React client |
| Remote engine, driver runtime, or remote node that should appear in the local workspace | RAPID Share |

# Read More

- [DCode Overview](../DCode/Overview.md)
- [Plugins Overview](../Plugins/Overview.md)
- [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md)
- [Engine Plugin API](../Plugins/Engine%20Plugin%20API.md)
- [Python Client](../Clients/Python%20Client.md)
- [React Client](../Clients/React%20Client.md)
