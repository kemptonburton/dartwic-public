---
title: Runtime Sections
summary: Task execution sections, state handlers, implicit loop/sequence bodies, and scheduled timeline buckets.
created: 2026-08-04T17:38
updated: 2026-10-26T22:01
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [abort](section-timeline_abort.md) | Timeline | `abort:` | A mission-time task_timeline declaration |
| [at](section-timeline_at.md) | Timeline | `at <T-/T+ time> [(label)]:` | A mission-time task_timeline declaration |
| [end](section-end.md) | Lifecycle | `end:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [hold](section-timeline_hold.md) | Timeline | `hold:` | A mission-time task_timeline declaration |
| [loop body](section-loop_body.md) | Loop | `<indented loop statements>` | A loop declaration |
| [missed](section-missed.md) | Lifecycle | `missed:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [resume](section-timeline_resume.md) | Timeline | `resume:` | A mission-time task_timeline declaration |
| [sequence body](section-sequence_body.md) | Sequence | `<indented sequence statements>` | A task_sequence declaration |
| [start](section-start.md) | Lifecycle | `start:` | A task_periodic declaration, A task_state_machine declaration, A task_sequence declaration |
| [state](section-state.md) | State Machine | `state <name>:` | A task_state_machine declaration |
| [stop](section-timeline_stop.md) | Timeline | `stop:` | A mission-time task_timeline declaration |
| [task](section-task.md) | Periodic | `task [elapsed_seconds]:` | A task_periodic declaration |
