---
updated: 2026-06-23T04:39
created: 2026-06-23
---

DARTWIC is an operations workspace for live systems. It combines an engine runtime, an operator interface, automation scripting, plugins, and external clients around one shared model: live channels, deliberate commands, useful history, and operator-visible events.

# Start Here

If you are new to DARTWIC, read these in order:

1. [DARTWIC Ecosystem](DARTWIC%20Ecosystem.md)
2. [First Session](First%20Session.md)
3. [Examples and Use Cases](Examples%20and%20Use%20Cases.md)
4. [Compatibility, Licensing, and Tiers](Compatibility,%20Licensing,%20and%20Tiers.md)

# The Map

| Area | Start Here | Use It For |
| --- | --- | --- |
| Engine | [Engine Overview](../Engine/Overview.md) | Channels, command authority, tasks, modules, ARGUS, TEMPEST, and runtime behavior. |
| Interface | [Interface Overview](../Interface/Overview.md) | Channel Search, schematics, task management, ARGUS events, exporter, plugins, and settings. |
| DCode | [DCode Overview](../DCode/Overview.md) | Easy automation logic using existing channels. |
| Plugins | [Plugins Overview](../Plugins/Overview.md) | Engine modules, interface pages, resources, schematic nodes, and packaged extensions. |
| Clients | [Python Client](../Clients/Python%20Client.md) | External scripts, analysis, dashboards, React integrations, and direct engine operations. |

# Choose A Path

| If You Want To... | Go To |
| --- | --- |
| Understand channel fields, recording, stale state, and values | [Channels](../Engine/Channels.md) |
| Understand who can write a value and why a control is blocked | [Commanding and Control](../Engine/Commanding%20and%20Control.md) |
| Write easy automation logic using existing data | [DCode and Scripting](../Engine/DCode%20and%20Scripting.md) |
| Build a C++ driver or external data-source integration | [Modules](../Engine/Modules.md) and [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md) |
| Operate the app day to day | [Interface Overview](../Interface/Overview.md) |
| Inspect connected engines, driver runtimes, or remote nodes | [Cluster Map](../Interface/Cluster%20Map.md) and [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md) |
| Work with recorded channel groups | [DataFrames](../Interface/DataFrames.md) and [Telemetry Exporter](../Interface/Telemetry%20Exporter.md) |
| Write operator procedures | [Checklists](../Interface/Checklists.md) |
| Query data from Python | [Python Client](../Clients/Python%20Client.md) and [Python Query Example](../Clients/Python%20Query%20Example.md) |
| Build a plugin | [Creating a Plugin](../Plugins/Creating%20a%20Plugin.md) |

# Working Mental Model

1. Modules, DCode, tasks, plugins, clients, or engine code publish channels.
2. RAPID stores latest channel state and optional history.
3. CAESAR runs tasks and loops.
4. ARGUS records events that operators need to notice.
5. TEMPEST lets the interface and clients call operations and receive telemetry.
6. The interface turns that runtime state into usable operator workflows.
