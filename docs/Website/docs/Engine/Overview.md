---
summary: Run the system that owns channels, tasks, events, and hardware integrations.
updated: 2026-10-22T02:21
created: 2026-08-03T15:41
---

The engine runs independently of the interface. It loads a project, hosts hardware modules, executes automation, accepts or rejects commands, records data, and serves connected clients.

## Runtime components

| Component | Responsibility |
| --- | --- |
| RAPID | Channel values, metadata, command authority, and history. |
| CAESAR | Tasks and scheduled loops. |
| ARGUS | Events, firing state, operator actions, and event history. |
| TEMPEST | Operation requests and telemetry delivery. |
| DCode | Scripted calculations, events, and automation. |
| TEMPEST Peer | Channels and events exchanged with other nodes. |

## Configure and start

A Release engine launched in an interactive terminal shows a workspace selector before startup. Choose a numbered engine instance; each entry identifies its workspace and node. Separator lines frame the menu, and **Q** exits. Noninteractive Release launches default to `engine/instances/default/`. A Debug executable starts the source checkout's primary instance (`tests/engine/instances/primary/`) directly, including from an IDE or terminal. `DARTWIC_CONFIG_DIR` selects an explicit instance directory in either build mode and bypasses the selector. The startup log prints the resolved configuration directory so you can verify which instance you launched.

The instance's `config.json` holds local launch settings such as workspace location, server address/base port, active project, credentials, and capacity. The node name belongs to the workspace's `workspace.json`; portable settings belong in workspace or project settings files. Engine plugins are shared under the installation's `plugins/` directory. Separate instances keep separate local configuration, recordings, and caches.

Follow [First Session](../Getting%20Started/First%20Session.md) for a packaged launch and connection. Use [Modules](Modules.md) to add device instances and [DCode](../DCode/Getting%20Started.md) to activate scripts.

## Design the data path

A module publishes a measurement to [RAPID](Channels.md). Dependent calculations and event conditions can run inline during that update. Scheduled tasks execute separately, and telemetry, recording, and TEMPEST peer delivery are asynchronous.

Read [Execution and Timing](Execution%20and%20Timing.md) before choosing where to put a limit response. Read [Commanding and Control](Commanding%20and%20Control.md) before exposing outputs to tasks or clients.

## Guides

| You need to… | Read… |
| --- | --- |
| Name signals and choose recording/freshness settings | [Channels](Channels.md). |
| Start and diagnose automation | [Tasks](Tasks.md). |
| Integrate a driver or native service | [Modules](Modules.md) and [Engine Plugin](../Plugins/Engine%20Plugin.md). |
| Review recorded data | [Telemetry and History](Telemetry%20and%20History.md). |
| Create or query events | [Events and ARGUS](Events%20and%20ARGUS.md). |
| Call operations and receive telemetry | [Using TEMPEST](Using%20TEMPEST.md). |
| Connect remote engines or custom nodes | [TEMPEST Peer](TEMPEST%20Peers.md). |

The generated [TEMPEST reference](Reference/TEMPEST/Overview.md) lists operation and telemetry contracts. Engine implementation details are separate from the public [plugin SDK](../Plugins/Reference/Engine/Overview.md).

An Engine update stops the selected instance, replaces its managed `bin/` and `assets/` files, then checks that it reconnects. Other Engines sharing the installation are not stopped automatically. If one still holds a file, the update rolls back and restarts the selected Engine with its previous files; the failure names the blocked path. Stop the other Engine before retrying. Plugin installation and loading have their own [separate status](../Interface/Plugins.md#installed-and-loaded-states).
