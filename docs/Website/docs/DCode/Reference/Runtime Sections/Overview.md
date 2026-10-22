---
title: "Runtime Sections"
summary: "Named sections that configure handlers or data inside a compatible runtime block."
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [calculation body](section-calculation_body.md) | Calculation | `<indented calculation expressions>` | A channel_calculation declaration |
| [depends_on](section-depends_on.md) | Calculation | `depends_on: <channel>, ...` | A channel_calculation declaration |
| [end](section-end.md) | Lifecycle | `end:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [loop body](section-loop_body.md) | Loop | `<indented loop statements>` | A loop declaration |
| [missed](section-missed.md) | Lifecycle | `missed:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [on_event](section-event_on_event.md) | ARGUS | `on_event:` | An event declaration |
| [on_firing](section-event_on_firing.md) | ARGUS | `on_firing:` | An event declaration |
| [run](section-task_group_run.md) | Task Group | `run: <task-or-loop-name>` | A task_group declaration |
| [sequence body](section-sequence_body.md) | Sequence | `<indented sequence statements>` | A task_sequence declaration |
| [start](section-start.md) | Lifecycle | `start:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [state](section-state.md) | State Machine | `state <name>:` | A task_state_machine declaration |
| [states](section-states.md) | State Machine | `states:` | A task_state_machine declaration |
| [task](section-task.md) | Periodic | `task [elapsed_seconds]:` | A task_periodic declaration |
| [trigger](section-event_trigger.md) | ARGUS | `trigger:` | An event declaration |
