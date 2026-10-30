---
title: Statements
summary: Executable forms for authority, transitions, timing, no-op behavior, and channel writes.
created: 2026-08-04T17:38
updated: 2026-10-27T16:09
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [automatic override](statement-override.md) | Authority | `override \|channel\| [= <value>]` | File scope, Executable DCode bodies |
| [break](lua-keyword-break.md) | Keyword | `break` | Executable DCode bodies |
| [claim channel](statement-claim.md) | Authority | `claim \|channel\|` | File scope, Executable DCode bodies |
| [command channel](statement-command.md) | Authority | `command \|channel\| [= <value>]` | File scope, Executable DCode bodies |
| [free channel](statement-free.md) | Authority | `free \|channel\| [= <value>]` | File scope, Executable DCode bodies |
| [global](syntax-global.md) | Scope | `global <name>[, <name>...]` | Executable DCode bodies, Runtime block scope |
| [local](lua-keyword-local.md) | Keyword | `local <name> [= <value>]` | File scope, Executable DCode bodies |
| [pass](statement-pass.md) | No-op | `pass` | Executable DCode bodies |
| [pipe write](statement-pipe_write.md) | Channel I/O | `\|channel\|[:field] = <expression>` | Executable DCode bodies, File scope |
| [return](lua-keyword-return.md) | Keyword | `return [values]` | Executable DCode bodies |
| [set channel](statement-set.md) | Authority | `set \|channel\| [= <value>]` | File scope, Executable DCode bodies |
| [transition](statement-transition.md) | State Control | `transition <state>` | State handlers |
| [transition task](statement-transition_task.md) | State Control | `transition <task_name> to <state>` | State-machine bodies |
| [trigger event](statement-trigger_event.md) | ARGUS | `trigger <event_key>` | Executable DCode bodies, Shared helper functions |
