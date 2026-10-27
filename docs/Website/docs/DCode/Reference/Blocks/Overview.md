---
title: Blocks
summary: Ordinary indentation-based control-flow, iteration, and definition constructs used inside executable DCode bodies.
created: 2026-08-04T17:38
updated: 2026-10-26T22:01
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [do](block-do.md) | Definition | `do:` | Executable DCode bodies |
| [elif](block-elif.md) | Conditional | `elif <condition>:` | Executable DCode bodies |
| [else](block-else.md) | Conditional | `else:` | Executable DCode bodies |
| [elseif](block-elseif.md) | Conditional | `elseif <condition>:` | Executable DCode bodies |
| [for](block-for.md) | Iteration | `for <Lua for-clause>:` | Executable DCode bodies |
| [for each](block-for_each.md) | Iteration | `for <name> in <array-or-object>:` | Executable DCode bodies |
| [function](block-function.md) | Definition | `[local] function <name>(<arguments>):` | File scope, Executable DCode bodies |
| [if](block-if.md) | Conditional | `if <condition>:` | Executable DCode bodies |
| [once](block-once.md) | DCode Conditional | `once:` | Task, state, loop, sequence and timeline runtime sections |
| [when](block-when.md) | DCode Conditional | `when(condition, time=seconds):` | Executable DCode bodies |
| [while](block-while.md) | Iteration | `while <condition>:` | Executable DCode bodies |
