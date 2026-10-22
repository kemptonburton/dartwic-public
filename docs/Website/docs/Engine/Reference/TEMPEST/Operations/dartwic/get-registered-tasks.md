---
title: dartwic/get-registered-tasks
summary: Searches registered tasks and related runtime resources.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Text matched across task metadata and related resources. |
| `scope` | `string` | Optional | Use `tasks` to omit loops, task groups, calculations, and loaded scripts. |
| `limit` | `integer` | Optional | Maximum returned task count; zero means unlimited. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `tasks` | `array<RegisteredTask>` | Matching task descriptors and diagnostic channel names. Each task includes `failed_cycles_channel`, execution diagnostics, and an independently sampled health report when available. Health reports include state, completion deadline, timing/counters, and `last_failure_kind`; `configuration_contention` means a prepared fixed release was promptly rejected during fixed-channel configuration, while `active_overdue` observes a callback that exceeded its deadline without forcibly stopping it. |
| `loops` | `array<RuntimeLoop>` | Matching runtime loops unless `scope` is `tasks`. |
| `task_groups` | `array<TaskGroup>` | Matching task-group configurations unless `scope` is `tasks`, including each member's last due-release outcome, complete group source map, and cumulative `execution_timing` counters (`cycles_total`, `members_executed_total`, `wall_ns_total`, `thread_cpu_ns_total`, `member_service_ns_total`, `callback_ns_total`). `execution_timing.by_task_type` breaks executed-member count, callback wall time and member-service wall time out by configured task type (or `standalone_loop`); it does not measure CPU by type or substeps within a callback. Compare counter differences across snapshots. Wall time includes descheduling; thread CPU is unavailable when its counter remains zero. A task descriptor's embedded `task_group.sources` contains only that member's run/schedule source entries. Group order does not itself prove that an earlier member completed successfully. |
| `channel_calculations` | `array<ChannelCalculation>` | Matching active DCode channel calculations unless `scope` is `tasks`, including Native C++/Lua mode, inline post-commit execution boundary, active state, invocation count, cumulative/recent/max execution duration, sampled dependency target-read/publication/chain totals and sample count, declaration line, and whether its DCode body contains a loop construct. Execution duration includes waiting for that calculation's mutex but excludes its result publication and downstream reactions. Dependency timing samples approximately one in 32 invocations; publication includes synchronous downstream work, so nested timings can overlap. A loop construct is a review signal, not a proof of unbounded work. |
| `callbacks` | `array<object>` | Active DCode callbacks with source location and named arguments unless scope is tasks. |
| `loaded_scripts` | `array<DCodeScript>` | Matching loaded DCode scripts unless `scope` is `tasks`. |
| `query` | `string` | The applied search query. |
