---
summary: Understand where data, automation, and extensions live.
updated: 2026-10-05T01:04
created: 2026-09-04T17:13
---

The engine runs the system; the interface and clients connect to it. Closing an interface does not by itself stop engine tasks. A project holds the resources and configuration used by that engine, including scripts, schematics, module instances, and saved remote connections.

## Inside the engine

| Component | Responsibility | Guide |
| --- | --- | --- |
| RAPID | Current channel values, metadata, authority, and recorded samples. | [Channels](../Engine/Channels.md) |
| CAESAR | Task and loop execution, including start, stop, hold, and timing diagnostics. | [Tasks](../Engine/Tasks.md) |
| ARGUS | Events, firing state, acknowledgements, prompts, and holds. | [Events and ARGUS](../Engine/Events%20and%20ARGUS.md) |
| TEMPEST | Client operation requests and telemetry delivery. | [Using TEMPEST](../Engine/Using%20TEMPEST.md) |
| TEMPEST Peer | Channel and ARGUS communication between nodes. | [TEMPEST Peer](../Engine/TEMPEST%20Peers.md) |

A device module receives a measurement and writes it to RAPID. Inline calculations and dependent event conditions react during that write. Separate workers deliver telemetry and record samples. The interface receives those updates and redraws its views; its displayed refresh rate is not the engine's control-loop rate.

## Where should your code go?

| You need to… | Start with… |
| --- | --- |
| Calculate or automate using existing channels | [DCode](../DCode/Overview.md). |
| Own a device connection, driver, or long-lived C++ service | An [engine plugin](../Plugins/Engine%20Plugin.md) with a module. |
| Give operators a custom page, task editor, or schematic node | An [interface plugin](../Plugins/Interface%20Plugin.md). |
| Query data from another process | The [Python client](../Clients/Python%20Client.md). |
| Build a separate web dashboard | The [React client](../Clients/React%20Client.md). |
| Integrate an external C++ node using the normal engine transport | The [C++ TEMPEST peer guide](../Clients/C%2B%2B%20TEMPEST%20Peer.md). |
| Carry peer frames over radio, serial, or another custom link | The [TEMPEST peer guide](../Engine/TEMPEST%20Peers.md). |

A plugin is a package, a module is an instance created by an engine plugin, and a task is a controllable unit of execution. A single driver plugin can supply several module instances and task types, plus interface panels for configuring them.
