---
title: "Blocks"
summary: "Ordinary indentation-based control-flow, iteration, and definition constructs used inside executable DCode bodies."
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
| [once](block-once.md) | DCode Conditional | `once:` | State handlers |
| [once when](block-once_when.md) | DCode Conditional | `once when <condition>:` | Executable DCode bodies |
| [when](block-when.md) | DCode Conditional | `when <condition>:` | Executable DCode bodies |
| [while](block-while.md) | Iteration | `while <condition>:` | Executable DCode bodies |
