---
title: Runtime Blocks
summary: Top-level declarations that create engine-managed tasks, calculations, or loops with persistent runtime state.
created: 2026-08-04T17:38
updated: 2026-10-04T21:47
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [callback](runtime-callback.md) | Callback | `callback <name>(<arguments>):` | File scope |
| [channel_calculation](runtime-channel_calculation.md) | Calculation | `channel_calculation <channel>:` | File scope |
| [event](runtime-event.md) | ARGUS | `event <event_key>:` | File scope |
| [loop](runtime-loop.md) | Loop | `loop <name> <frequency_hz> [disable_warnings]:` | File scope |
| [task_group](runtime-task_group.md) | Task Group | `task_group <name>:` | File scope |
| [task_periodic](runtime-task_periodic.md) | Task | `task_periodic <name> [frequency_hz] [priority] [disable_warnings]:` | File scope |
| [task_sequence](runtime-task_sequence.md) | Task | `task_sequence <name> [disable_warnings]:` | File scope |
| [task_state_machine](runtime-task_state_machine.md) | Task | `task_state_machine <name> [disable_warnings]:` | File scope |
| [task_timeline](runtime-task_timeline.md) | Task | `task_timeline <name> [frequency_hz] [priority] [disable_warnings]:` | File scope |
