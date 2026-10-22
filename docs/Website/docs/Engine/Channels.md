---
summary: Name and configure live signals, recordings, freshness, and startup values.
updated: 2026-10-14T22:35
created: 2026-09-04T17:13
---

A RAPID channel is a named numeric signal with metadata. It can represent a measurement, command target, task state, diagnostic, or calculated value.

## Keys and references

```text
tank_pressure                    # local key
SECONDARY_NODE:tank_pressure     # remote key
|tank_pressure|                 # value reference
|tank_pressure|:units            # metadata reference
|SECONDARY_NODE:tank_pressure|   # remote value reference
```

Use flat signal names such as `tank_pressure`. Keep metadata outside the closing pipe; the earlier dotted-field notation is not the field-access syntax. API requests that accept `channel_name` take a key without pipes and a separate `field`.

## Public fields

| Field | Type | Editing | Meaning |
| --- | --- | --- | --- |
| `value` | Number | Authority checked | Current numeric value. |
| `timestamp` | Number | Read-only | Latest value timestamp, Unix-epoch nanoseconds. |
| `units` | Text | Editable | Display units, such as bar or degC. |
| `stale_timeout` | Number | Editable | Freshness threshold in seconds. |
| `record_mode` | Text | Editable | Write-triggered recording: `on_value_change`, `every_value`, or `never`. |
| `control_policy` | Text | Authority operations | `free`, `automatic`, `automatic_override`, `manual_override`, or `observe_only`. |
| `control_owner` | Text | Read-only | Automatic owner retained during manual override. |
| `active_controller` | Text | Read-only | Controller currently permitted to update the value. |
| `commanded_by` | Text | Read-only | Trusted origin of the latest accepted value write. |
| `created_by` | Text | Read-only | Recorded origin of channel creation; it is not the latest writer. |
| `calculation_scripts` | Calculation links | Read-only | Associated scripts, relationship, and line number. |
| `value_options` | Value/label entries | Editable | Numeric choices with operator-facing labels. |
| `startup_value` | Object | Editable | Optional next-start override, with `enabled` and numeric `value`. |

Authority changes use explicit claim, override, and release actions rather than metadata edits. Full channel snapshots also report `storage` (`fixed` or `dynamic`) and creation provenance, including creator, node, ancestry, and dependencies. [Channel Search](../Interface/Channel%20Search.md) uses that context when reviewing references and cleanup.

A current value does not establish freshness or recording. Inspect timestamps and [history coverage](Telemetry%20and%20History.md) separately.

## Read and write

In DCode:

```dcode
local pressure = |tank_pressure|
|demo_pressure| = pressure
|demo_pressure|:units = "bar"
```

Through a TEMPEST client:

```python
response = client.operation("rapid/upsert-channel-field", {
    "channel_name": "demo_pressure",
    "field": "value",
    "value": 2.5,
})
response.raise_for_error()
```

The engine checks [authority](Commanding%20and%20Control.md) on value writes. Metadata editing and value commanding are distinct operations. SDK code uses typed `ChannelField` and `ChannelValue`; see [Engine Plugin](../Plugins/Engine%20Plugin.md#4-publish-channels-and-respect-authority).

## Calculations and recording

Use [channel calculations](../DCode/Channel%20Calculations.md) for scaling, offsets, and derived signals. These are explicit scripts, not implicit scale or mapping fields on a channel.

`on_value_change` records changed values; `every_value` records each accepted value write; `never` disables write-triggered recording. The engine's periodic auto recorder is separate and can still sample channels marked `never`. Samples retain timestamp, data frame, value, and provenance. Recording is asynchronous and does not delay inline dependency reactions until a disk flush. [Telemetry and History](Telemetry%20and%20History.md#choose-a-recording-policy) explains both paths.

## Startup values

Set `startup_value` when a channel needs a configured value at engine startup:

```json
{"enabled": true, "value": 0}
```

Changing this field does not command the channel immediately. On startup, dynamic channels apply the override while restoring their snapshot; fixed channels apply it after declaration and before deferred runtimes start. The driver still determines whether and when that value reaches hardware.

## Fixed and dynamic channels

Both storage classes use the same channel names, public fields, recording options, and authority rules. A fixed value still changes normally; **fixed** describes its allocated storage and binding, not a constant value.

| Storage | Use it for | Runtime behavior |
| --- | --- | --- |
| Dynamic | Ad hoc signals and channels whose set of names changes at runtime. | Ordinary creation defaults to dynamic. Native readers use name-based queries. |
| Fixed | A declared repeating acquisition, calculation, or control path whose recurring memory and storage work must be prepared. | RAPID reserves slots and resolves handles during configuration. Each accepted ordinary DCode read or write acts at its executing line. |

### Why use fixed channels with native DCode?

Fixed channels let native DCode and plugins retain handles instead of looking up names on each cycle. Their numeric storage is reserved before execution. Use them when a known repeated path benefits from that preparation; ordinary dynamic channels remain useful for flexible automation.

Reads and writes happen at their executing lines, without a task-wide input snapshot or output transaction. Synchronous calculations still contribute to the writer's duration. Fixed storage alone does not establish that a callback is allocation-free or meets a deadline. [Deterministic Automation](Deterministic%20Automation.md) explains the practical tradeoffs.

Configure mappings before starting and reconfigure when they change. Handles include a generation so an old binding cannot silently address a different channel after a slot is reused. Use [Builder](DARTWIC%20Builder.md) to inspect the bindings and any reconfiguration errors.

### Declare the producer's channels

For [Native C++ DCode](../DCode/Native%20C%2B%2B%20Execution.md), activation automatically declares direct `|output| = expression` targets, calculation targets, and state-machine current/target channels as fixed. It includes outputs from other configured native files when resolving producer/consumer bindings.

Reading `|input|` does not declare a fixed producer. If no channel exists, native activation creates a dynamic channel with value zero and reports a warning. Configure the acquiring plugin to publish fixed storage, or supply the intended native producer. Do not add a dummy writer merely to suppress a dynamic-binding warning.

For an engine plugin, declare channels during task configuration (`on_configure`), using its SDK pointer:

```cpp
auto pressure = api->createFixedChannel("sensor_pressure", 0.0);
auto temperature = api->createFixedChannel("sensor_temperature", 0.0);
```

This creates or promotes storage and returns a retained local handle. The supplied initial value applies only to a new channel; existing fixed or promoted dynamic state stays intact. Call it during configuration, save the handles in task instance state, then use [queryChannel](../Plugins/Reference/Engine/Channels/SDK_API-queryChannel.md) and [upsertChannel](../Plugins/Reference/Engine/Channels/SDK_API-upsertChannel.md) at the executing lines. Ordinary upserts do not claim authority. `TaskRuntime::setFixedInputChannels` retains declared plugin inputs; ordinary DCode reads them when reached.

### Configure and verify the layout

[DARTWIC Builder](DARTWIC%20Builder.md) applies declared configuration changes at a lifecycle boundary, even when the layout is protected. Direct fixed-layout changes outside that boundary remain restricted. Normal DCode activation and task configuration do not require a manual unlock.

Inspect the channel's `storage` value (`fixed` or `dynamic`) and the editor's native binding chip. Builder lists each binding and reports changes that rebind loaded consumers. The engine's `rapid_fixed_channel_capacity` setting defaults to **4096** slots and is read when RAPID is constructed. If capacity is exhausted, increase it and restart; the pool does not grow automatically at runtime.
