---
updated: 2026-07-12T17:50
created: 2026-06-23
---

Commanding is any write to a channel's `value` field. DARTWIC does not decide write access from the UI alone; RAPID evaluates the write inside the engine using the channel's command fields and the source of the write.

# The Three Command Fields

| Field | Meaning |
| --- | --- |
| `control_policy` | The current authority mode: `free`, `automatic`, `manual_override`, or `observe_only`. |
| `control_owner` | The automatic owner of the channel. In normal task-owned control this is a task source such as `task:portal/name`. |
| `active_controller` | The source currently allowed to write while the channel is not `free`. During automatic control this usually matches `control_owner`; during manual override it is an operator source. |

Write sources are normalized into a few forms:

| Source Kind | Example | Meaning |
| --- | --- | --- |
| operator | `operator:<client-id>` | A connected interface or external client writing through TEMPEST. |
| task | `task:portal/name` | A CAESAR task writing through runtime logic. |
| loop | `loop:<name>` | A CAESAR loop source. |
| other | thread id or custom source | Any other runtime writer. |

# Control Policies

| Policy | Who Can Write `value` | How It Is Usually Entered |
| --- | --- | --- |
| `free` | Any normal writer can write. | Default for new channels. Task control helper channels such as `_running`, `_hold`, and `_target_frequency` are kept free. |
| `automatic` | Only `active_controller` can write. | When automation explicitly commands a free channel, RAPID marks it automatic and sets both `control_owner` and `active_controller` to that task or loop source. |
| `manual_override` | Only the operator in `active_controller` can write. | An operator writes with `take_manual_control: true` against an automatic channel that already has a `control_owner`. |
| `observe_only` | Operators cannot write. The owning runtime source can still update it. | Used for read-only telemetry and diagnostics, including actual-frequency task diagnostics. |

# What Happens On A Value Write

When a writer updates `<portal>/<channel>.value`, RAPID:

1. Resolves the command source.
2. Normalizes sources such as `caesar-task:` into `task:`.
3. Applies the channel authority rules.
4. Accepts or ignores the write based on `control_policy` and `active_controller`.
5. If accepted, updates `value`, `commanded_by`, and `timestamp`.
6. Records the sample if `record_mode` allows it.

If a write is rejected by authority, the channel is not updated. This is why a visible control in the interface may not change the live value.

# Automatic Control

Automatic control is task or loop ownership.

When DCode uses `command |portal/channel.value| = value` against a free channel, RAPID changes the channel to:

```text
control_policy: automatic
control_owner: task:<portal>/<task-name>
active_controller: task:<portal>/<task-name>
```

For loops, the owner/controller source is `loop:<loop-name>`. From that point, the same task or loop can keep writing. Other operators or runtime sources cannot write `value` unless the channel becomes free again or an operator takes manual override.

`claim |portal/channel.value|` takes the same automatic authority without writing a value. A plain DCode assignment such as `|portal/channel.value| = value` does not claim a free channel.

When a task stops or a loop is removed, CAESAR releases its `automatic` channels, including an automatic channel currently under manual override. RAPID clears `control_owner` and `active_controller` and returns those channels to `free`. Observe-only channels created with `set` remain protected after the controller stops. DCode can explicitly release either policy with `free |portal/channel.value|`.

C++ plugin tasks and loops use the same RAPID authority operations with a single `portal/channel` key:

```cpp
api->claimChannel("demo/pump_speed");
api->commandChannel("demo/pump_speed", 40.0);
api->setChannel("demo/pump_state", 1.0);
api->freeChannel("demo/pump_speed");
```

# Manual Override

Manual override is not a vague safety reminder. It is a specific authority transition:

```text
automatic task control -> operator active control -> automatic task control
```

An operator can take manual control only when all of these are true:

- the channel is in `automatic`
- `control_owner` is not empty
- the write request includes `take_manual_control: true`
- the writer source is an operator

When that succeeds, RAPID sets:

```text
control_policy: manual_override
active_controller: operator:<client-id>
```

`control_owner` stays pointed at the task that normally owns the channel. That is how the engine knows what to restore when the override is released.

# Releasing Manual Override

An operator releases override by sending `release_manual_override: true`. RAPID only releases if the channel is currently in `manual_override` and the active controller is an operator.

After release, RAPID restores:

```text
control_policy: automatic
active_controller: <control_owner>
```

If the channel has no `control_owner`, RAPID cannot restore automatic control and reports an error.

# Observe-Only Channels

`observe_only` means operators cannot write `value`. Runtime owners can still update the value when they are the active controller.

DCode uses `set |portal/channel.value|` to establish observe-only authority without changing the value, or `set |portal/channel.value| = value` to establish authority and update the value together.

Actual-frequency task diagnostics are forced into observe-only behavior so an operator cannot accidentally write measured loop frequency.

# Task Control Channels

Some task helper channels are intentionally free even though they affect a task:

- `<portal>/<name>_running.value`
- `<portal>/<name>_hold.value`
- `<portal>/<name>_target_frequency.value`

These are operator-facing control handles. The task-owned authority model applies to the task's produced outputs, not to the handles used to start, stop, hold, release, or tune the task.

# Example

A DCode task commands `demo/pump_speed.value`.

```text
control_policy: automatic
control_owner: task:tasks/pump
active_controller: task:tasks/pump
commanded_by: task:tasks/pump
```

An operator uses the interface to take manual control and write `40`.

```text
control_policy: manual_override
control_owner: task:tasks/pump
active_controller: operator:desktop-123
commanded_by: operator:desktop-123
value: 40
```

The operator releases override.

```text
control_policy: automatic
control_owner: task:tasks/pump
active_controller: task:tasks/pump
```

The task is now allowed to write the value again.
