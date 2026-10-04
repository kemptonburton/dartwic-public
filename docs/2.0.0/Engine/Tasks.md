---
updated: 2026-06-23
created: 2026-05-01
---

Tasks are CAESAR-managed runtime units. They give DARTWIC a consistent way to start, stop, hold, inspect, and measure automation logic.

Use tasks when the behavior is runtime automation over channels that already exist in DARTWIC. Use [Modules](Modules.md) when you need custom C++ lifecycle, a device driver, or an external data-source integration that creates or manages those channels.

# Task Structures

DARTWIC currently exposes three task structures:

| Structure | Use It For |
| --- | --- |
| `periodic` | Loop logic that runs repeatedly at a target frequency. |
| `worker` | Long-running or blocking work that should run as a worker task instead of a frequency-controlled loop. |
| `state machine` | Sequenced logic with named states and transitions. |

The structure describes how CAESAR runs the task. The task type describes what implementation runs inside that structure, such as `DCode` or a plugin-provided task type.

# Shared Task Channels

Every concrete task structure creates these RAPID channels:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `<portal>/<name>_running.value` | writable | Set to `1` to start the task, or `0` to stop it. |
| `<portal>/<name>_hold.value` | writable | Set to `1` to hold task execution without stopping it. Set back to `0` to release the hold. |

Holding a task pauses execution while preserving task state. Stopping a task ends the current run and clears the hold channel back to `0`.

# Frequency Channels

Periodic and state-machine tasks also create frequency-control channels:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `<portal>/<name>_target_frequency.value` | writable | Requested loop frequency in Hz. Defaults to `10`. |
| `<portal>/<name>_actual_frequency.value` | observe-only | Measured loop frequency in Hz. DARTWIC writes `0` when the task is stopped. |

Worker tasks do not use target or actual frequency channels.

# State-Machine Channels

State-machine tasks also create state channels:

| Channel | Direction | Purpose |
| --- | --- | --- |
| `<portal>/<name>_current_state.value` | observe-only | Current state selected from the task's state list. Owned by the task. |
| `<portal>/<name>_target_state.value` | writable | Requested state selected from the task's state list. |

State-machine implementations may expose a command or language keyword to move between states. In DCode, use `transition <state>` for the current task, or `transition <task> to <state>` to request a state on another state-machine task.

# DCode Tasks

DCode task blocks create CAESAR tasks with the task type `DCode`.

| DCode Block | Task Structure |
| --- | --- |
| `task_periodic <portal>/<name>:` | `periodic` |
| `task_state_machine <portal>/<name>:` | `state machine` |

See [DCode Tasks](../DCode/Tasks.md) for the DCode-specific block format and examples.

# Read More

- [DCode and Scripting](DCode%20and%20Scripting.md)
- [DCode Overview](../DCode/Overview.md)
- [Commanding and Control](Commanding%20and%20Control.md)
- [Modules](Modules.md)
