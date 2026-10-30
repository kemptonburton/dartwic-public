---
summary: Understand event conditions, operator lifecycle, log streams, and recorded evidence.
created: 2026-09-04T17:13
updated: 2026-10-29T02:07
---

An **event** is a named condition or occurrence that someone may need to investigate or act on: a device disconnect, a pressure limit, a prompt, or a task hold.

![](_attachments/Pasted%20image%2020261028143012.png)

A **log** is timestamped text explaining what the system did.

![](_attachments/Pasted%20image%2020261028142931.png)

ARGUS manages both for DCode, plugins, and Engine services. For a failed device read, a log captures the transaction error while an event tracks the problem through acknowledgement and recovery.

Use [Interface Events and Logs](../Interface/Events%20and%20Logs.md) for the operator views. Recorded events and logs can be compared with channels in [Data](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md) and through the combined [Telemetry Graphs](../Interface/Telemetry%20Graphs.md) view.

# Events

Events track firing (active) separately from operator handling. Choose a type, firing rules, and any reaction logic.

## Event Types

The type describes what the event means to the operator:

| Type    | Purpose                                                                                    |
| ------- | ------------------------------------------------------------------------------------------ |
| Message | Report information or a completed action.                                                  |
| Warning | Highlight a condition that needs attention.                                                |
| Error   | Report a failure or fault.                                                                 |
| Abort   | Report a condition that requires an abort response. The application defines that response. |
| Hold    | Pause the invoking workflow until the hold is released.                                    |
| Prompt  | Ask the operator for an answer, such as a number, text, or a selected option.              |

DCode event declarations support `message`, `warning`, `error`, and `abort`. Holds and prompts use their own functions. An event's type alone does not command equipment or stop tasks.

## Event Metadata

DCode declarations use these fields; reporting functions use arguments and select the type by function name.

| Field | Purpose |
| --- | --- |
| `title` | Required display title; part of the event's identity. |
| `type` | `message`, `warning`, `error`, or `abort`; defaults to `message`. Holds and prompts use separate functions. |
| `description` | Explain the condition or what happened. |
| `resolution` | Tell the operator what to check or do next. These are instructions, not executable reaction logic. |
| `system` | Top-level grouping, such as `PROPULSION`; defaults to `SOFTWARE` in DCode and the SDK helpers. |
| `subsystem` | More specific grouping, such as `FUEL`; defaults to `DCODE` in DCode and the SDK helpers. |
| `channels` | Related channels and event graphs. Commas add series; semicolons add graphs. `graphs` is an alias. |
| `auto_acknowledge` | Seconds before automatic acknowledgement. Zero disables it. |
| `firing_timeout_seconds` | Quiet interval before ARGUS ends the firing occurrence. Zero disables automatic expiry and is the default for declarations. |

The Engine supplies origin fields (`node`, `source`, `loop`, `file`, `line`), IDs, timestamps, and counts where available. These are not declaration fields. See the [event field reference](../DCode/Reference/Fields/Overview.md) for syntax and graph options.

ARGUS groups repeated reports by **node, title, system, and subsystem**. Description and type can change without creating another logical event. Keep declaration keys unique; a matching title alone does not bind a reporting function to a declaration's handlers.

See [Firing Events](#firing-events) for how `firing_timeout_seconds` applies to function reports and declared conditions.

## Event States

Status tracks operator/workflow handling. An event can stop firing while remaining new or acknowledged.

| State | Meaning | Active board / graph |
| --- | --- | --- |
| `new` | Reported and awaiting acknowledgement. | Visible; realtime while the owner is available. |
| `acknowledged` | Marked as seen, by an operator or configured automatic acknowledgement. It may still be firing. | Visible; realtime while the owner is available. |
| `resolved` | Finished through the resolution action after firing stopped. A later detection can reopen the event. | Hidden; historical graph. |
| `silenced` | Hidden from the board without stopping the condition or changing equipment. It can still fire. | Hidden; historical graph. |
| `deleted` | Removed through the event deletion lifecycle. This does not erase recorded history. | Hidden; historical graph. |
| `responded` | A prompt received its answer. The response and responder are retained. | Hidden; historical graph. |
| `released` | A hold was released. Check the task/workflow state to confirm what resumed. | Hidden; historical graph. |
| `stale` | Left open in an earlier recording session when a new session began. The old observation is no longer treated as current. | Hidden; historical graph. |

**New active** and **acknowledged active** are firing display labels, not additional statuses. **Firing unknown** means the owner's current firing state is unavailable. **Observed** labels a resolved observation record, not an actionable event.

## Event Actions

Actions change how an event is handled. They do not by themselves prove that equipment recovered or that a physical command completed.

| Action | Result |
| --- | --- |
| Acknowledge | Changes a new event to `acknowledged`, recording that it was seen. Firing can continue. |
| Unacknowledge | Returns an acknowledged event to `new`. |
| Resolve | Changes a stopped event to `resolved` and removes it from the board. A new event is acknowledged as part of resolution. A later detection can reopen it. |
| Unresolve | Returns a resolved event to `acknowledged`. It does not restart firing. |
| Silence | Changes the state to `silenced` and hides the event from the board without stopping its firing condition. |
| Unsilence | Returns a silenced event to `acknowledged` so it can appear on the board again. |
| Respond | Submits a prompt's answer and changes it to `responded`, preserving the answer and responder. |
| Release hold | Changes a hold to `released` and wakes its waiting workflow. Check task state to confirm what resumed. |
| Delete | Marks the event `deleted` through its deletion lifecycle. Recorded history is retained. |
| Resolve locally | Clears a retained event from a disconnected remote board and records a local operator action. Source status and firing history stay unchanged; an unresolved event can reappear on reconnect. |

Actions depend on type, state, and permissions. Holds and prompts finish through Release or Respond. Resolve locally can clear an unavailable remote hold or prompt from the board, but cannot release or answer it.

## Firing Events

An event is **firing** while ARGUS considers its condition or occurrence active. Each qualifying report is a **detection**: the first starts firing; further detections keep it firing.

Report through a function or a declaration, using one of three entry points:

**Reporting function:** each `message(...)`, `warning(...)`, `error(...)`, or `abort(...)` call reports one detection.

  ```dcode
  warning("Temperature high", "Inspect cooling", [])
  ```

**Declared condition:** each evaluation of `trigger:` returning numeric `1` reports a detection; returning `0` stops firing.

  ```dcode
  event docs_demo_alarm:
      title: "Alarm active"
      trigger:
          return 1
  ```

**Explicit declaration trigger:** use `trigger event_name`, or write `1` to its `_trigger` input when present. Each assertion requests one detection; the input resets to `0` independently of firing. Using the declaration above:

  ```dcode
  task_sequence docs_demo_alarm_once:
      trigger docs_demo_alarm
      -- Alternative: set |docs_demo_alarm_trigger| = 1
  ```

An **occurrence** is one continuous period of firing: ten detections before it stops are one occurrence; a detection afterward starts another. Acknowledging does not stop firing, and stopping does not resolve the event or remove it from the board.

A **quiet interval** is time without new detections. `firing_timeout_seconds` ends firing after that interval; each detection restarts the timer. Reporting functions default to **five seconds**; declarations default to `0` (no automatic expiry). A false condition or explicit stop can end firing sooner.

**Stop a declared condition:** return `0` when it clears. Excerpt from the declaration's body:

```dcode
trigger:
    return 0
```

This stops firing when evaluated. Writing `0` to the `_trigger` pulse input does not.

**Stop either form elsewhere in DCode:** call `stop_event_firing(...)` from a task, loop, or other executable body. Use the displayed title, system, and subsystem not the declaration key:

```dcode
stop_event_firing("Alarm active", "SOFTWARE", "DCODE")
stop_event_firing("Temperature high", "SOFTWARE", "DCODE")
```

These stop the declaration and warning above. Match any custom system/subsystem arguments. A later true evaluation, report, or explicit trigger can restart firing; stopping does not disable the producer.

For the examples below, activate the script in a test project after creating its input channels. Use a free demo valve channel with no hardware connection.

### Report calls with an inactivity timeout

This loop checks a demo temperature once per second:

```dcode
loop docs_demo_temperature_reports 1:
    if |docs_demo_temperature| > 80:
        warning("Temperature high", "Measured above 80 degrees.", ["docs_demo_temperature"], "Inspect cooling", 0, 5)
```

Each call adds a detection and restarts the five-second timer. Reports at seconds 0, 2 and 4 form one occurrence ending at second 9. The function does not monitor temperature after returning; your code must call it again.

The final arguments disable automatic acknowledgement (`0`) and set the timeout (`5`). The timeout groups reports without delaying or rate-limiting calls. Reporting lets the task continue; an abort response requires explicit task or channel actions.

### Keep firing until an explicit stop

Use timeout `0` when your code will explicitly report recovery. Create `docs_demo_sensor_connected`: `1` means connected, `0` disconnected.

```dcode
loop docs_demo_connection_reports 2:
    if |docs_demo_sensor_connected| == 0:
        error("Sensor disconnected", "The sensor connection is unavailable.", ["docs_demo_sensor_connected"], "Check the connection", 0, 0)
    else:
        stop_event_firing("Sensor disconnected")
```

Reports share one occurrence until the loop detects recovery and stops firing. Without the explicit stop, this zero-timeout event would remain firing.

`stop_event_firing(title, system?, subsystem?)` preserves status and history and returns whether it stopped a firing. Repeated calls, or calls before the event exists, are harmless. Its default grouping is `SOFTWARE` / `DCODE`, matching the reporting helpers.

### Declare a condition that stops when false

Declared conditions evaluate on channel writes. Start `docs_demo_temperature` below 80; this event fires above 80 and stops at 80 or below:

```dcode
event docs_demo_overtemp:
    title: "Temperature limit exceeded"
    type: abort
    firing_timeout_seconds: 0
    channels: |docs_demo_temperature|, |docs_demo_valve_command|

    trigger:
        if |docs_demo_temperature| > 80:
            return 1
        return 0

    on_firing:
        if value == 1:
            override |docs_demo_valve_command| = 0
        if value == 0:
            free |docs_demo_valve_command|
```

Activation evaluates `trigger:` once; later input-channel writes evaluate it again. Each `1` adds a detection; `0` stops firing immediately. Timeout `0` leaves firing active between evaluations until a false result or explicit stop.

Even with a condition body, `trigger docs_demo_overtemp` or writing `1` to `|docs_demo_overtemp_trigger|` reports a detection directly, without requiring the condition to return `1`. A later condition evaluation returning `0` stops firing again.

`on_firing:` receives `value = 1` on start and `0` on stop. It closes the demo valve command, then frees the override on recovery. Freeing leaves the command unchanged; it does not reopen the valve. The `abort` type alone performs no actions.

The trigger and reaction finish before the input write returns, so keep them short. Device communication follows on the driver's next write cycle. See [DCode Events](../DCode/Events.md#limit-event-example) for generated channels, authority, and cleanup.

### Trigger a declaration on demand

A declaration can represent a checkpoint without a `trigger:` section:

```dcode
event docs_demo_checkpoint:
    title: "Checkpoint reached"
    type: message
    firing_timeout_seconds: 5

task_sequence docs_demo_checkpoint_run:
    trigger docs_demo_checkpoint
```

Start **docs_demo_checkpoint_run** from Tasks: it reports one detection. Firing ends five seconds after the latest detection.

The keyword works with or without a `trigger:` body. Add an empty `trigger:` only if you also want the writable pulse input `docs_demo_checkpoint_trigger`. Writing `1` to that input reports a detection, then resets to `0`. This reset does not stop firing; observe `docs_demo_checkpoint_firing` for the ongoing state.

A positive timeout also applies to declared conditions. With timeout `5`, the temperature event expires five seconds after its last true evaluation if input updates cease, even if that result was `1`. Expiry indicates quiet reporting, not confirmed physical recovery.

Condition changes and explicit stops run declaration reactions synchronously; timeout expiry runs asynchronously. Reporting functions with the same event identity do not invoke declaration reactions or renew the declaration's timeout.

### Holds and prompts

Holds and prompts stay firing until released or answered, with no firing-timeout argument. Start this sequence from Tasks:

```dcode
task_sequence docs_demo_inspection:
    approved = promptYesNo("Inspection complete?", "Has the sensor been checked?", [], "", 0)
```

The prompt blocks the sequence's thread, returning `1` for Yes or `0` for No. A `hold(...)` waits for release. Acknowledgement and `stop_event_firing(...)` cannot answer or release them. See the [prompt](../DCode/Reference/DCode%20Functions/function-promptYesNo.md) and [hold](../DCode/Reference/DCode%20Functions/function-hold.md) references for workflow and timeline behavior.

### Engine plugin calls

Plugins use the same helpers through `DARTWIC::API::SDK_API* api`. Inside a plugin callback, report detection and recovery with:

```cpp
api->error("Sensor disconnected", "The sensor connection is unavailable.",
    {"docs_demo_sensor_connected"}, "Check the connection", 0, 0.0);

// When the plugin detects recovery:
api->stop_event_firing("Sensor disconnected");
```

Reports return a numeric host result (normally `1`), not an event ID; stops return a boolean. Defaults match DCode. Reporting and explicit stops are synchronous; recording and telemetry are asynchronous. Calls may allocate, lock, or throw on invalid input or host failure. SDK holds and prompts block the C++ thread; use a worker or sequence that can wait.

The [SDK event reference](../Plugins/Reference/Engine/Events/Overview.md) lists complete signatures and graph arguments. Use [SDK_API::recordEvent](../Plugins/Reference/Engine/Events/SDK_API-recordEvent.md) for richer JSON metadata. [Recording and Telemetry](Recording%20and%20Telemetry.md#events) explains recorded occurrences and counts; [Diagnostics](Diagnostics%20and%20Troubleshooting.md#argus) shows recording and delivery progress.

## Query Events

With a [connected Python client](../Clients/Python%20Client.md), this query prints the IDs, titles, and statuses of up to 100 active events:

```python
response = client.operation("argus/get-active-events", {
    "limit": 100,
    "offset": 0,
})
response.raise_for_error()
for event in response.payload["events"]:
    print(event.get("event_id"), event.get("title"), event.get("status"))
```

An empty list means no active entries matched. Query history for resolved events; use returned IDs for lifecycle actions.

History filters include node, system/subsystem, type, status, channel, text, session, and time. Event `_ns` timestamps use epoch nanoseconds; detached-job timestamps use milliseconds.

Use the generated [Events operation reference](Reference/TEMPEST/Operations/Events.md) for query fields and lifecycle actions. [Events in the Interface](../Interface/Events%20and%20Logs.md#events) explains the board, details, prompts, and holds.

# Logs

Logs provide chronological text for investigating what ran and why it failed. Writing a log does not create an event to acknowledge.

## Log Streams and Sessions

A **stream** groups output by source, such as the Engine, Builder, or a plugin. A **session** identifies one Engine run.

## Log Metadata

Every structured log record contains these fields:

| Field | Contents |
| --- | --- |
| `node` | Originating node name. |
| `session` | Engine session that produced the record. |
| `stream` | Named output stream, such as `test_run` or `DARTWIC BUILDER`. |
| `channel` | Output category, normally `stdout` or `stderr`; this is not a RAPID channel reference. |
| `level` | Message level, normally `info`, `warning`, or `error`. |
| `text` | The message text. |
| `sequence` | Position within that node/session/stream, serialized as a decimal string. |
| `timestamp_ns` | Source time in Unix-epoch nanoseconds, serialized as a decimal string. |

ARGUS supplies local node, session, sequence, and time; peer records retain their source values. Example with illustrative generated values:

```json
{
  "node": "TEST_STAND",
  "session": "engine-session-id",
  "stream": "test_run",
  "channel": "stderr",
  "level": "error",
  "text": "Device read failed\n",
  "sequence": "42",
  "timestamp_ns": "1793188800000000000"
}
```

## Write Logs

### DCode

Put this sequence in a project script, activate it, then start it from Tasks:

```dcode
task_sequence docs_demo_log:
    log("test_run", "Starting pressure check")
    log_warning("test_run", "Pressure sample is stale")
    log_error("test_run", "Device read failed")
```

Open the `test_run` stream in Logs. These functions produce `info/stdout`, `warning/stdout`, and `error/stderr` records respectively, with a newline appended to the text. The JSON above illustrates the final error record.

### C++

In an Engine plugin callback using its `DARTWIC::API::SDK_API* api`:

```cpp
api->log("test_run", "Starting pressure check");
api->log_warning("test_run", "Pressure sample is stale");
const bool accepted = api->log_error("test_run", "Device read failed");
```

Plugin streams are qualified by plugin ID: the example plugin writes to `example_device_plugin/test_run`. `accepted` reports admission for asynchronous writing, not completed storage or delivery; handle a rejected write according to the plugin's reporting policy. See [SDK_API::writeLog](../Plugins/Reference/Engine/Logs/SDK_API-writeLog.md).

These helpers append a newline and use the same writer and channel/level pairs as DCode. Use `writeLog` for raw text or custom channel/level choices.

Native C++ DCode requires a literal stream name. Formatting and logging can allocate, so include their cost when reviewing a control task's timing. The [log function reference](../DCode/Reference/DCode%20Functions/function-log.md) documents backend behavior.

Readable `.log` files and queryable records live under the instance's ARGUS runtime storage. [Logs in the Interface](../Interface/Events%20and%20Logs.md#logs) covers streams, sessions, and retained ranges; [diagnostics](Diagnostics%20and%20Troubleshooting.md#argus) distinguish a quiet stream from recording backlog or write failure.
