---
title: Tasks
summary: Inspect task definitions and control task runtime state.
created: 2026-08-04T17:33
updated: 2026-10-20T18:59
---

| Operation | Description |
| --- | --- |
| [`dartwic/abort-timeline`](dartwic/abort-timeline.md) | Aborts a running timeline and executes only its explicit abort handlers. |
| [`dartwic/create-task`](dartwic/create-task.md) | Creates task. |
| [`dartwic/get-registered-tasks`](dartwic/get-registered-tasks.md) | Searches registered tasks and related runtime resources. |
| [`dartwic/get-runtime-loops`](dartwic/get-runtime-loops.md) | Returns runtime loops. |
| [`dartwic/get-task-groups`](dartwic/get-task-groups.md) | Lists configured task groups registered with CAESAR. |
| [`dartwic/get-task-types`](dartwic/get-task-types.md) | Returns task types. |
| [`dartwic/preview-timeline-time`](dartwic/preview-timeline-time.md) | Holds a running timeline and previews the buckets crossed by a clock change. |
| [`dartwic/remove-task`](dartwic/remove-task.md) | Removes task. |
| [`dartwic/reset-timeline`](dartwic/reset-timeline.md) | Resets a stopped timeline to its configured clock and clears its bucket ledger. |
| [`dartwic/set-timeline-time`](dartwic/set-timeline-time.md) | Applies a previously previewed timeline clock change with explicit per-bucket decisions. |
| [`dartwic/unwatch-runtime-loops`](dartwic/unwatch-runtime-loops.md) | Stops a runtime-loop feed for the requesting view. |
| [`dartwic/watch-runtime-loops`](dartwic/watch-runtime-loops.md) | Begins a live runtime-loop feed and returns its initial filtered snapshot. |
