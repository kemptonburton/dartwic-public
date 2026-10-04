---
updated: 2026-06-23
created: 2026-06-23
---

Task management surfaces show CAESAR runtime tasks and their control channels. Use them to operate automation without editing lower-level channels by hand.

# What Operators Manage

| Control | Meaning |
| --- | --- |
| running | Start or stop the task. |
| hold | Pause execution without clearing task state. |
| target frequency | Request a loop frequency for periodic and state-machine tasks. |
| actual frequency | Inspect measured loop frequency. This is observe-only. |
| current state | Inspect a state-machine task's current state. |
| target state | Request a state-machine transition when supported. |

# Normal Workflow

1. Find the task by name or surface.
2. Check whether it is running.
3. Check hold state before assuming automation is active.
4. Check actual frequency for periodic or state-machine tasks.
5. Use task controls instead of raw channel writes when possible.
6. Watch ARGUS events for holds, prompts, warnings, aborts, or task output.

# Read More

- [Engine Tasks](../Engine/Tasks.md)
- [DCode and Scripting](../Engine/DCode%20and%20Scripting.md)
- [ARGUS Events](ARGUS%20Events.md)
