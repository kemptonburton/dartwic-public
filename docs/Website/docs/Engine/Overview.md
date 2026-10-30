---
summary: Understand configuration, execution, recording, and connections in the Engine.
created: 2026-08-03T15:41
updated: 2026-10-28T18:44
---

The Engine is the part of DARTWIC that connects to devices, runs automation, and records what happens. It runs independently of the Interface, so closing a display does not stop the work running on it.

# Architecture

The Engine brings together core services, automation, and extensions. Clients connect external applications to those services.

## RAPID

RAPID is the Engine's channel store. Drivers publish measurements, automation reads and writes values, and write authority determines who may control each signal. RAPID also records channel history.

![](_attachments/Pasted%20image%2020261028001732.png)

Read [Channels and Control](Channels%20and%20Control.md) for values and authority, and [Recording and Telemetry](Recording%20and%20Telemetry.md) for recording policies and history.

## CAESAR

CAESAR runs tasks and loops. It schedules repeated work and manages start, hold, resume, and stop so device acquisition, controllers, and procedures share the same execution lifecycle.

![](_attachments/Pasted%20image%2020261028001759.png)

Read [Modules and Tasks](Modules%20and%20Tasks.md) for lifecycle and configuration, [Execution and Timing](Execution%20and%20Timing.md) for scheduling, inline reactions, and the prepared execution path.

## ARGUS

ARGUS manages events and text logs. Events give operators conditions or occurrences to follow; logs explain what ran and what happened. ARGUS keeps live event state and records event/log history.

![](_attachments/Pasted%20image%2020261028001848.png)

Read [Events and Logs](Events%20and%20Logs.md) for event identity, operator state, and log streams. [Diagnostics](Diagnostics%20and%20Troubleshooting.md) explains recording backlog and publication loss.

## TEMPEST

TEMPEST connects the Engine to Interfaces, clients, and peer nodes. Operations carry requests and responses; telemetry delivers observations such as channel snapshots and event updates.

![](_attachments/Pasted%20image%2020261028002050.png)

Read [Networking and Peers](Networking%20and%20Peers.md) for the TEMPEST architecture, clients, peers, operations, telemetry, and discovery. [Using TEMPEST](Advanced/Using%20TEMPEST.md) covers payloads and raw connections.

## DCode

DCode is DARTWIC's automation language. Use it to calculate channel values, run procedures, and react to conditions without building a plugin. The Engine loads scripts from your projects and manages their runtime definitions.

![](_attachments/Pasted%20image%2020261028002206.png)

For compiled scripts, [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) covers Builder preparation, logs, and troubleshooting.

Start with the [DCode overview](../DCode/Overview.md), then read [Runtime Blocks and Activation](../DCode/Runtime%20Blocks%20and%20Activation.md) for how scripts are loaded and replaced, or [Tasks](../DCode/Tasks.md) for periodic work, sequences, and state machines.

## Plugins

Plugins add capabilities such as device drivers, native functions, and custom operator tools. Engine plugins run native code inside the Engine; an accompanying Interface plugin can provide configuration editors and controls.

![](_attachments/Pasted%20image%2020261028002239.png)

Read the [Plugins overview](../Plugins/Overview.md) for the available extension types, [Engine Plugin](../Plugins/Engine%20Plugin.md) and [Interface Plugin](../Plugins/Interface%20Plugin.md) for configuration and registration, and [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) for a complete device integration.

## Clients

Clients let external applications read Engine data, send commands, and follow live updates. Use them for analysis scripts, dashboards, and other tools that connect to a running Engine.

The [Clients overview](../Clients/Overview.md) helps you choose a library. [Networking and Peers](Networking%20and%20Peers.md#clients) explains sessions and permissions; [Using TEMPEST](Advanced/Using%20TEMPEST.md) covers raw protocol connections.

## Data Flow

For example, a device task publishes pressure to a channel, a controller calculates a valve request, and an output task sends it to the device. The guides below explain that path, how to configure it, and how to check its results.

```text
Device → Module / task → Channels → Calculations and event reactions
                            ├─ Commands → Driver → Equipment feedback
                            ├─ Recording → History and saved runs
                            └─ Telemetry → Interfaces, clients, and peers
```

# Engine Guides

Start with the topic that matches the part of the system you are configuring or investigating.

| Topic | Guide |
| --- | --- |
| Installation, instance, and workspace files | [Configuration and Storage](Configuration%20and%20Storage.md) |
| Channel values and write authority | [Channels and Control](Channels%20and%20Control.md) |
| Device services and task lifecycle | [Modules and Tasks](Modules%20and%20Tasks.md) |
| Synchronous work, scheduling, and timing | [Execution and Timing](Execution%20and%20Timing.md) |
| Recording policy, history, and retention | [Recording and Telemetry](Recording%20and%20Telemetry.md) |
| Events, operator state, and logs | [Events and Logs](Events%20and%20Logs.md) |
| Client sessions and peer connections | [Networking and Peers](Networking%20and%20Peers.md) |
| Runtime diagnostics and troubleshooting | [Diagnostics and Troubleshooting](Diagnostics%20and%20Troubleshooting.md) |

# Advanced Topics

These guides are for applications implementing endpoint discovery or raw network connections. Native builds, execution timing, and recording configuration are covered in the guides above.

| Task                                                     | Guide                                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Find Engine addresses before connecting                  | [Network discovery](Networking%20and%20Peers.md#discovery)                             |
| Implement a raw operation and telemetry connection       | [Using TEMPEST](Advanced/Using%20TEMPEST.md)                                     |

Use [First Session](../Getting%20Started/First%20Session.md) for installation and the first connection. The [operation reference](Reference/TEMPEST/Overview.md) lists the current request and telemetry APIs.
