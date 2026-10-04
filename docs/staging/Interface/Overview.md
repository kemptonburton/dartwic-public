---
updated: 2026-06-23T04:39
created: 2026-06-23
---

The DARTWIC interface is the operator workspace for a running engine. It is where users inspect channels, manage tasks, operate schematics, review ARGUS events, export telemetry, configure plugins, and adjust settings.

# Main Interface Areas

| Area | Use It For |
| --- | --- |
| [Channel Search](Channel%20Search.md) | Find live channels, inspect field metadata, edit writable fields, open exports, and debug freshness. |
| [DataFrames](DataFrames.md) | Find recorded channel groups, compare configured and recorded channels, and open focused exports. |
| [Managing Tasks](Managing%20Tasks.md) | Start, stop, hold, release, inspect, and tune CAESAR tasks. |
| [Schematics](Schematics.md) | Build operator views with channel displays, controls, task nodes, graphs, images, and plugin nodes. |
| [Checklists](Checklists.md) | Write project procedures with Markdown task lists, live channel inserts, and links to resources. |
| [Cluster Map](Cluster%20Map.md) | Inspect the local engine, connected clients, remote nodes, remembered nodes, and cluster health. |
| [Telemetry Exporter](Telemetry%20Exporter.md) | Query historical data, graph selected channels, and export bounded ranges. |
| [ARGUS Events](ARGUS%20Events.md) | Review events, prompts, holds, aborts, warnings, messages, and operator responses. |
| [Plugins](Plugins.md) | Use plugin resources, module configuration pages, and project-specific interface extensions. |
| [Settings](Settings.md) | Configure interface behavior, runtime preferences, and environment-specific options. |

# Operator Flow

Most sessions move through the same loop:

1. Confirm the interface is connected to the right engine.
2. Use Channel Search, Schematics, Cluster Map, DataFrames, or plugin pages to find the system state you care about.
3. Check freshness, task state, and command authority before acting.
4. Use the highest-level control available: checklist procedure, schematic control, task control, plugin workflow, or channel write.
5. Watch ARGUS events and live telemetry for the result.
6. Export a focused data range when you need analysis outside the live workspace.

# Read More

- [Engine Overview](../Engine/Overview.md)
- [Channels](../Engine/Channels.md)
- [Commanding and Control](../Engine/Commanding%20and%20Control.md)
- [Events and ARGUS](../Engine/Events%20and%20ARGUS.md)
- [RAPID Share and Remote Nodes](../Engine/RAPID%20Share%20and%20Remote%20Nodes.md)
- [Plugins Overview](../Plugins/Overview.md)
