---
summary: Understand configuration, execution, recording, and connections in the Engine.
created: 2026-08-03T15:41
updated: 2026-10-26T21:52
---

The Engine is the part of DARTWIC that connects to devices, runs automation, and records what happens. It runs independently of the Interface, so closing a display does not stop the work running on it.

For example, a device task publishes pressure to a channel, a controller calculates a valve request, and an output task sends it to the device. The guides below explain that path, how to configure it, and how to check its results.

```text
Device → Module / task → Channels → Calculations and event reactions
                            ├─ Commands → Driver → Equipment feedback
                            ├─ Recording → History and saved runs
                            └─ Telemetry → Interfaces, clients, and peers
```

# Engine guides

| Question | Guide |
| --- | --- |
| What belongs to an installation, instance, workspace, or project? | [Configuration and Storage](Configuration%20and%20Storage.md) |
| What does a value mean, and who can write it? | [Channels and Control](Channels%20and%20Control.md) |
| What happens during configuration, start, stop, and reload? | [Modules and Tasks](Modules%20and%20Tasks.md) |
| What runs inline, on a schedule, or later? | [Execution and Timing](Execution%20and%20Timing.md) |
| What reaches history, and what can expire or be lost? | [Recording and Retention](Recording%20and%20Retention.md) |
| How do conditions, operator actions, and text output differ? | [Events and Logs](Events%20and%20Logs.md) |
| How do clients and other nodes exchange data? | [Networking and Peers](Networking%20and%20Peers.md) |
| What should I check when something fails or falls behind? | [Diagnostics and Troubleshooting](Diagnostics%20and%20Troubleshooting.md) |

# Advanced topics

| You need to… | Guide |
| --- | --- |
| Follow native builds and fixed-channel preparation | [DARTWIC Builder](Advanced/DARTWIC%20Builder.md) |
| Measure a control cycle and test its failure response | [Deterministic Automation](Advanced/Deterministic%20Automation.md) |
| Understand recording queues, indexing, and delivery loss | [Recording and Delivery Tuning](Advanced/Recording%20and%20Delivery%20Tuning.md) |
| Find Engine addresses before connecting | [Network Discovery](Advanced/Network%20Discovery.md) |
| Implement a raw operation and telemetry connection | [Using TEMPEST](Advanced/Using%20TEMPEST.md) |

Use [First Session](../Getting%20Started/First%20Session.md) for installation and the first connection. [DCode](../DCode/Overview.md), [Plugins](../Plugins/Overview.md), and [Clients](../Clients/Overview.md) cover writing your own behavior; the [operation reference](Reference/TEMPEST/Overview.md) lists the current request and telemetry APIs.
