---
title: task_group
summary: Order existing CAESAR tasks or loops whenever their own absolute monotonic releases are due.
created: 2026-10-04T18:31
updated: 2026-10-26T22:01
---

## Syntax

```dcode
task_group <name>:
```

## Available in

- File scope

## Lifecycle

A task group is ordering configuration, not a combined task and not a separate user-configured clock. Every member keeps its own frequency, diagnostics, and enabled state. The internal scheduler derives its wakeups from member frequencies and uses the highest requested member priority; there is no task-group frequency or priority setting. Members share one monotonic epoch, and members due at the same release execute in declared order. Disabled members are skipped and rejoin on their next scheduled release. A blocking member delays members after it, so keep blocking I/O independent when that coupling is not intentional. Callback exceptions are logged and counted in task failure diagnostics without automatically inhibiting later due members. Ordering does not require a successful acquisition or fresh input; applications must define their fault response.

## Example

```dcode
task_group group_name:
    run: first_task
    run: second_task
```
