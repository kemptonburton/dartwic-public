---
title: Fields
summary: Named configuration values inside their owning runtime block or bucket.
created: 2026-10-27T16:09
updated: 2026-10-28T19:18
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [auto_acknowledge](event-metadata-auto_acknowledge.md) | ARGUS | `auto_acknowledge: <seconds>` | An event declaration |
| [channels](event-metadata-channels.md) | ARGUS | `channels: <series> [, <series> ...] [; <series> ...]` | An event declaration |
| [clock_start](field-timeline_clock_start.md) | Timeline | `clock_start: <T-/T+ time>` | A mission-time task_timeline declaration |
| [clock_t0](field-timeline_clock_t0.md) | Timeline | `clock_t0: <ISO-8601 timestamp>` | A mission-time task_timeline declaration |
| [depends_on](field-depends_on.md) | Calculation | `depends_on: <channel>, ...` | A channel_calculation declaration |
| [description](event-metadata-description.md) | ARGUS | `description: "<text>"` | An event declaration |
| [firing_timeout_seconds](event-metadata-firing_timeout_seconds.md) | ARGUS | `firing_timeout_seconds: <seconds>` | An event declaration |
| [hold_at](field-bucket_hold_at.md) | Timeline | `hold_at: <T-/T+ time or next_bucket>` | A timeline at bucket |
| [resolution](event-metadata-resolution.md) | ARGUS | `resolution: "<instructions>"` | An event declaration |
| [run](field-run.md) | Task Group | `run: <task-or-loop-name>` | A task_group declaration |
| [states](field-states.md) | State Machine | `states:` | A task_state_machine declaration |
| [subsystem](event-metadata-subsystem.md) | ARGUS | `subsystem: "<subsystem>"` | An event declaration |
| [system](event-metadata-system.md) | ARGUS | `system: "<system>"` | An event declaration |
| [title](event-metadata-title.md) | ARGUS | `title: "<display title>"` | An event declaration |
| [type](event-metadata-type.md) | ARGUS | `type: <type>` | An event declaration |
