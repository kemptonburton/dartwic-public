---
title: "Statements"
summary: "Executable forms for authority, transitions, timing, no-op behavior, and channel writes."
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [automatic override](statement-override.md) | Authority | `override \|channel\| = <value>` | CAESAR task and loop bodies, Channel calculations, event reaction, Shared helper functions |
| [claim channel](statement-claim.md) | Authority | `claim \|channel\|` | CAESAR task and loop bodies, Shared helper functions |
| [command channel](statement-command.md) | Authority | `command \|channel\| = <value>` | CAESAR task and loop bodies, Shared helper functions |
| [free channel](statement-free.md) | Authority | `free \|channel\|` | CAESAR task and loop bodies, Channel calculations, event reaction, Shared helper functions |
| [pass](statement-pass.md) | No-op | `pass` | Executable DCode bodies |
| [pipe write](statement-pipe_write.md) | Channel I/O | `\|channel\|[:field] = <expression>` | Executable DCode bodies, File scope |
| [set channel](statement-set.md) | Authority | `set \|channel\| [= <value>]` | CAESAR task and loop bodies, Shared helper functions |
| [transition](statement-transition.md) | State Control | `transition <state>` | State handlers |
| [transition task](statement-transition_task.md) | State Control | `transition <task_name> to <state>` | State-machine bodies |
| [trigger event](statement-trigger_event.md) | ARGUS | `trigger <event_key>` | Executable DCode bodies, Shared helper functions |
