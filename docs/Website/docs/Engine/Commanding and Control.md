---
summary: Understand automatic ownership, manual override, and observe-only channels.
updated: 2026-10-20T16:26
created: 2026-09-04T17:13
---

RAPID enforces value-write authority inside the engine. The interface, clients, DCode, and plugins all use this authority model.

TEMPEST checks the connection role before a request reaches channel authority. A viewer cannot command even a `free` channel. Administrator access permits command requests; the channel's policy and controller still determine whether its value write is accepted.

## Policies

| Policy | Who can update the value? |
| --- | --- |
| `free` | Any normal writer. |
| `automatic` | The active automatic controller. |
| `automatic_override` | The active safety/interlock controller; it supersedes ordinary automation. |
| `manual_override` | Authenticated operators; the active controller records who took the override. |
| `observe_only` | The owning runtime source; an operator must explicitly take manual override before writing. |

`control_owner` identifies the automatic owner, such as `task:tasks_fill`. `active_controller` identifies who currently controls the channel. `commanded_by` records the trusted origin of the last accepted value write, not who could write next.

## Claim from DCode

```dcode
task_sequence docs_demo_command:
    claim |demo_output|
    command |demo_output| = 25
    free |demo_output|
```

`claim` takes automatic ownership without changing the value. `command` claims a free channel and writes it. A plain assignment such as `|demo_output| = 25` does not claim a free channel.

Use `set` for runtime-owned, observe-only values:

```dcode
task_sequence docs_demo_status:
    set |demo_status| = 1
```

C++ plugin tasks and loops use the matching `claimChannel`, `commandChannel`, `setChannel`, and `freeChannel` SDK methods. Task and loop origins are tracked by the engine.

## Automatic override

Use `override` for an explicit safety or interlock action that must supersede
ordinary automation without making calculations generally command-capable.
It is available to CAESAR code, calculations, and declared-event reactions. This fragment belongs inside an event declaration:

```dcode
on_firing:
    if value == 1:
        override |fuel_valve| = 0
    if value == 0:
        free |fuel_valve|
```

The newest automatic override is active. Its `free` restores the policy and
controller present before the first automatic override. Manual operator control
still wins; releasing it returns to the automatic override, not directly to
the ordinary task.

## Take manual control

Use the interface's explicit manual-control action on any existing channel, including free channels, observe-only diagnostics, and channels owned by automation. The engine must classify the connection as an operator. Headless clients can make normal writes allowed by the channel policy, but cannot take or release operator manual override.

The Interface sends its operator identity when it registers with the engine, including after a connection is restored. If an older Interface session reports that it is headless, reconnect the Interface with the updated client.

The engine preserves `control_owner` and changes `active_controller` to the operator. Automation cannot continue overwriting the value during that override. Release manual control through the interface to restore the previous policy and controller; inspect the next accepted value rather than assuming a particular output value was restored.

## Stop and cleanup

When stop completes, the engine removes that task or loop's automatic ownership and overrides. It also releases its user-channel `observe_only` ownership; system diagnostics retain their separate protection. Other active controllers and operator manual control remain in place. Stopped automation is removed from the state that would otherwise be restored after an override.

Cleanup does not reset the stored value. Put final output commands in the task's `end:` handler or the driver's shutdown path, and use `free` when control should be released earlier. A held task keeps its authority.

Task handles such as `_running`, `_hold`, and `_target_frequency` are intentionally writable controls. Measured diagnostics such as `_actual_frequency` are observe-only.

## If a command does not work

Inspect the channel in [Channel Search](../Interface/Channel%20Search.md). Check its policy, owner, active controller, and provenance. Rejected writes leave the value unchanged. For remote channels, confirm the node qualifier; authority is enforced by the owning runtime.

An accepted value write can execute [inline calculations](Execution%20and%20Timing.md), but physical actuation depends on the driver and hardware. Check independent feedback when available.
