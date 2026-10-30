---
title: DCode Reference
summary: Shared language reference for DCode with Lua and Native C++ execution.
created: 2026-08-04T17:38
updated: 2026-10-28T19:18
---

Use the [DCode guides](../Overview.md) for tutorials and examples, or choose a category below when you already know what you need.

Lua and Native C++ use this single feature catalog. [Values and Scope](../Values%20and%20Scope.md) defines shared arrays, objects, expressions and variable rules. Lua Base entries describe legacy Lua APIs and may remain Lua-specific; each Native C++ note identifies a backend limitation. See [Native C++ Execution](../Native%20C%2B%2B%20Execution.md) for build requirements and fixed-channel verification.

| Category | Description | Entries |
|---|---|---|
| [Runtime Blocks](Runtime%20Blocks/Overview.md) | Top-level declarations for tasks, loops, calculations, events, task groups, and callbacks. Scheduled blocks retain runtime state; callbacks use a separate function scope per invocation. | 9 |
| [Runtime Sections](Runtime%20Sections/Overview.md) | Task execution sections, state handlers, implicit loop/sequence bodies, and scheduled timeline buckets. | 12 |
| [Handlers](Handlers/Overview.md) | Executable entries inside timeline buckets and events. | 8 |
| [Fields](Fields/Overview.md) | Named configuration values inside their owning runtime block or bucket. | 15 |
| [Blocks](Blocks/Overview.md) | Ordinary indentation-based control-flow, iteration, and definition constructs used inside executable DCode bodies. | 11 |
| [Statements](Statements/Overview.md) | Executable forms for authority, transitions, timing, no-op behavior, and channel writes. | 14 |
| [Directives](Directives/Overview.md) | Compile-time and module-level forms that import code, define parameters, or expand templates. | 3 |
| [Syntax](Syntax/Overview.md) | DCode values, expressions, scope, channel paths, comments, and indentation. | 9 |
| [Context Variables](Context%20Variables/Overview.md) | Values supplied by the engine only in the runtime blocks and handlers where they are meaningful. | 10 |
| [DCode Functions](DCode%20Functions/Overview.md) | Functions supplied by DARTWIC for channels, prompting, logging, timing, and other runtime behavior. | 38 |
| [Lua Base](Lua%20Base/Overview.md) | Lua keywords, literals, base functions, and standard libraries available to DCode scripts. | 42 |
