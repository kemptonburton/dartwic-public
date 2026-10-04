---
updated: 2026-06-23
created: 2026-06-23
---

A channel is one named runtime signal in RAPID. It can hold telemetry, a command target, task state, a diagnostic value, or a calculated value.

Every channel is addressed as:

```text
<portal>/<channel>.<field>
```

For example:

```text
tasks/fill_running.value
engine/rpm.units
demo/filtered.record_mode
```

The part before the final dot identifies the channel. The part after the final dot identifies the field on that channel.

# Channel Data Model

RAPID stores one latest snapshot per channel and optionally records historical samples. The latest snapshot contains more than just `value`; it also contains metadata that tells the interface how to display the channel, whether to record it, and whether a write should be allowed.

The engine exposes the field list through `rapid/get-channel-field-config`. The current fields are:

| Field | Type | Write | What It Means |
| --- | --- | --- | --- |
| `value` | number | yes | The current channel value. Writes to this field go through command authority checks. The stored value is `raw * scale + offset`. |
| `commanded_by` | text | no | The source that last wrote `value`, such as an operator client, task, loop, or thread source. |
| `timestamp` | number | no | The latest update time in Unix epoch nanoseconds. If a write does not provide a timestamp, RAPID assigns the current time. |
| `units` | text | yes | Display units for the value, such as `V`, `rpm`, `degC`, or `%`. |
| `scale` | number | yes | Multiplier applied to incoming raw `value` writes. Changing it preserves the underlying raw value and recalculates the displayed value. |
| `offset` | number | yes | Offset added after scaling incoming raw `value` writes. Changing it preserves the underlying raw value and recalculates the displayed value. |
| `stale_timeout` | number | yes | Freshness threshold for consumers. A value greater than zero tells the interface and clients how long the current timestamp should be trusted. |
| `mapped_channel` | text | yes | Another channel linked to this one. Writes to `value` can propagate to the mapped channel. Clearing this field removes the mapping. |
| `record_mode` | text | yes | Historical recording mode. Allowed values are `on_value_change`, `every_value`, and `never`. |
| `mean` | number | no | Mean of the channel's recent value buffer. It is recalculated on query. |
| `stdev` | number | no | Standard deviation of the recent value buffer. It is recalculated on query. |
| `buffer_size` | number | yes | Number of recent values to keep for `mean` and `stdev`. Values of `0` or `1` disable the buffer. |
| `data_frame` | text | yes | Historical grouping label used when samples are recorded and queried. Defaults to `default`. |
| `control_policy` | text | yes | Current command authority mode. Allowed values are `free`, `automatic`, `manual_override`, and `observe_only`. |
| `control_owner` | text | no | The automatic owner of the channel, usually a task source such as `task:portal/name`. |
| `active_controller` | text | no | The source currently allowed to write the channel while the policy is `automatic`, `manual_override`, or `observe_only`. |
| `calculation_scripts` | text | no | JSON text listing DCode calculation scripts linked to this channel. |
| `value_options` | text | no | JSON text listing allowed display/control choices. The interface accepts strings or objects with `value` or `id` plus optional `label` or `name`. |

# Recording

`record_mode` controls whether `value` writes are persisted to the historical database:

| Value | Behavior |
| --- | --- |
| `on_value_change` | Record only when the displayed value changes. This is the default. |
| `every_value` | Record every value write, including repeated values. Use this when sample count and timing matter. |
| `never` | Do not record samples for this channel. The latest value still exists in memory. |

Historical samples are stored with the channel name, value, `commanded_by`, `data_frame`, and timestamp.

# Scaling

When code writes `value`, RAPID stores:

```text
displayed_value = raw_value * scale + offset
```

This is useful when a module publishes raw device counts but operators should see engineering units. If you change `scale` or `offset`, RAPID keeps the same underlying raw value and recalculates the displayed value.

# Mapped Channels

`mapped_channel` links two channel keys. If channel A maps to channel B, a value write on A also updates B through the normal write path. RAPID creates the mapped channel if it does not already exist and records the reverse mapping.

Use this for aliasing or exposing one runtime signal through another public channel name. Do not use it as a substitute for a real module or task when behavior needs its own lifecycle.

# Buffers, Mean, And Standard Deviation

Set `buffer_size` above `1` to keep recent values in memory. RAPID uses that buffer to calculate `mean` and `stdev` when the channel is queried.

These fields are display/query helpers. They are not historical aggregates, and they reset with the in-memory channel state.

# Command Fields

`control_policy`, `control_owner`, and `active_controller` are explained in [Commanding and Control](Commanding%20and%20Control.md). The short version:

- `free` means normal writes are accepted.
- `automatic` means the active task or loop controls the channel.
- `manual_override` means an operator has temporarily taken active control from the automatic owner.
- `observe_only` means operators cannot write the value.
