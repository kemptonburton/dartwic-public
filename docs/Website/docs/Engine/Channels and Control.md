---
summary: Understand RAPID channels, fields, storage, authority, and native or DCode publishing.
created: 2026-09-04T17:13
updated: 2026-10-26T19:42
document_kind: walkthrough
---

A channel is a named signal: a measurement, command, task status, or calculated value. RAPID stores its current value and enforces who may change it. Drivers, automation, and operators work with the same channel state.

For the Interface workflow, see [Channels](../Interface/Channels.md).

# RAPID channels

RAPID (Real-time Access Parallel In-memory Database) holds live channel state in memory and provides recording for historical data. A driver can publish a pressure sample, a task can read that sample and write a valve request, and the Interface can display both.

## Reading and writing values

A channel key is its name, such as `tank_pressure`. In DCode, put the key between pipes to read its value, assign to it to write, or add a field selector after the closing pipe:

```dcode
pressure = |tank_pressure|                    # read the value
|demo_pressure| = pressure                          # write another channel
units = |tank_pressure|:units                 # read a field
remote = |SECONDARY_NODE:tank_pressure|        # read from another node
```

In C++, use `queryChannel` for the value, `queryChannelData` for the full channel data, and `upsertChannel` for an ordinary write:

```cpp
const double pressure = rapid.queryChannel("tank_pressure");
rapid.upsertChannel("demo_pressure", pressure);
```

These examples assume an existing pressure input and a writable demo output. A named upsert can create missing dynamic state; fixed channels are prepared during configuration. Ordinary reads and writes do not acquire authority. Every write checks permission and current authority.

## Public fields

Fields describe the value, its source, and its control. For example, `value = 12.5`, `units = "bar"`, and `timestamp` describe a pressure reading and when it was acquired.

| Field | Meaning | What changes it |
| --- | --- | --- |
| `value` | Current numeric value. | An accepted value write. |
| `timestamp` | Source value or measurement time, in Unix-epoch nanoseconds. | Accepted value ingestion; supplied measurement time or Engine-assigned time. |
| `commanded_by` | Origin of the last accepted value write. | Engine-managed writer attribution. |
| `control_policy` | Effective authority policy. | Authority operations and lifecycle cleanup. |
| `control_owner` | Underlying owner. | Authority operations and lifecycle cleanup. |
| `active_controller` | Current controller under the effective policy. | Authority operations and lifecycle cleanup. |
| `created_by` | Channel creation provenance. | Creation/restoration; later writes do not replace it. |
| `storage` | Fixed or dynamic storage. | Channel configuration. |
| `units` | Display units, such as bar or degC. | Permitted metadata configuration. |
| `stale_timeout` | Freshness threshold in seconds. | Permitted metadata configuration. |
| `record_mode` | `on_value_change`, `every_value`, or `never`. | Permitted recording configuration. |
| `value_options` | Numeric choices and display labels. | Permitted metadata configuration. |
| `startup_value` | Optional value applied during Engine startup. | Configuration; changing it does not write the current value. |
| `calculation_scripts` | Attached calculation relationships. | Calculation activation/configuration. |

A steady number may be a new measurement or an old sample. Check its timestamp and freshness threshold; retransmitting an old sample does not refresh it.

[Channel Calculations](../DCode/Channel%20Calculations.md) derive values during writes. [Recording and Retention](Recording%20and%20Retention.md) covers samples and history, separate from the current live value.

## Fixed and dynamic channels

| Storage | Purpose |
| --- | --- |
| Dynamic | Channels created flexibly at runtime. |
| Fixed | Reserved storage and prepared direct bindings for a known repeated path. |

Both storage types use the same authority rules. [Builder](Advanced/DARTWIC%20Builder.md#fixed-native-channels) explains declarations and binding checks.

Fixed storage uses preallocated channel storage, handles and bindings, while dynamic storage creates channels as needed in a concurrent map. The reason for the two options is determinism: the fixed path avoids channel-storage allocation during repeated access, helping keep C++ DCode cycle times predictable.

Most of the time, you do not need to choose the storage yourself. Lua DCode normally uses dynamic storage; eligible static channels in Native C++ use fixed storage. Most device plugins also use the fixed path in their acquisition and control tasks.

## Remote channels

A remote channel belongs to another connected Engine. In DCode, prefix its name with the node name; in C++, use the node/key overload:

```dcode
pressure = |SECONDARY_NODE:tank_pressure|
|SECONDARY_NODE:valve_command| = 1
```

```cpp
const double pressure = rapid.queryChannel("SECONDARY_NODE", "tank_pressure");
rapid.upsertChannel("SECONDARY_NODE", "valve_command", 1.0);
```

Reads use the latest cached observation from that Engine. Check connection status and the sample's timestamp: a retained value may be stale, and disconnecting does not turn it into a fresh sample. Writes go to the owning Engine, which checks permissions and channel authority. Sending a write does not by itself confirm acceptance or hardware action.

**Authority stays on the owning Engine.** Remote `command`, `set`, `override` and `free` calls with a value behave as ordinary upserts. They attempt the value write but never acquire, change or release authority. Without a value, they do nothing.

```dcode
command |SECONDARY_NODE:valve_command| = 1  # Ordinary remote write; no claim.
free |SECONDARY_NODE:valve_command| = 0     # Ordinary remote write; no release.
override |SECONDARY_NODE:valve_command|     # No value: no operation.
```

These writes can still be rejected by the owning Engine's channel protection. Run automation there when it needs to own a channel. Stopping or disconnecting the requesting Engine does not release that local owner's claims.

For more about remote nodes:
- [Network Map](../Interface/Network%20Map.md): connect to peers and inspect connection status and traffic.
- [Networking and Peers](Networking%20and%20Peers.md): understand TEMPEST connections, permissions, remote data and recovery.
- [TEMPEST peers API](Reference/TEMPEST/Operations/TEMPEST%20peers.md): connect, list and manage peers programmatically.

## Startup values

An enabled startup value initializes the channel once when the Engine starts, before other channel writes are allowed. It is not reapplied when a task starts, restarts, or a script reloads. Changes to the setting take effect on the next Engine start.

Use this when a valve or actuator should start at a chosen command instead of its last restored value.

In a plugin's start callback, acquire authority without replacing the existing values:

```cpp
rapid.commandChannel("valve_command"); // Acquire automatic authority; keep the value.
rapid.setChannel("valve_feedback");   // Acquire publishing authority; keep the value.
```

Supplying a value instead requests a write on every task start. Use this only when the reset is intentional:

```cpp
rapid.commandChannel("valve_command", 0.0); // Command zero, replacing the current value.
rapid.setChannel("valve_feedback", 0.0);    // Publish zero, replacing the last feedback.
```

An output driver normally reads the existing command rather than acquiring or resetting it. For channel defaults, use create-only `insertChannel` or create/get fixed channels during configuration so existing values survive.


# Control authority

Authority answers two different questions: who owns the underlying channel claim, and who currently controls writes?

- **Owner:** the artifact holding automatic ownership or observe-only publishing authority.
- **Active controller:** the controller currently allowed to write under that policy. An override can temporarily replace the owner as the active controller.
- **Last writer:** the origin of the most recently accepted value write. It does not necessarily still own or control the channel.

## Policies

| Policy | Meaning |
| --- | --- |
| `free` | No exclusive claim. Writers with the required request permissions may write. |
| `automatic` | The underlying automatic owner controls writes. |
| `observe_only` | The publisher controls writes. Ordinary operator writes are rejected. |
| `automatic_override` | The current automation override controls writes; underlying ownership may remain. |
| `manual_override` | Explicit operator control takes precedence over automation. |

An authority-only operation changes control fields, not `value`, `timestamp`, or `commanded_by`. Taking or releasing control does not create a new measurement.

# CAESAR lifecycle

These rules apply to CAESAR tasks, sequences, state machines, timelines, workers, and standalone loops.

| Phase          | Purpose                                                                               | Channel practice                                                                            |
| -------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Configure      | Prepare an installed artifact: handles, buffers, device mappings, and retained state. | Create/get fixed channels and configure metadata.                                           |
| Start          | Begin each run, including a restart.                                                  | Reset per-run state and explicitly acquire authority over the channels needed for that run. |
| Run            | Execute the body or procedure.                                                        | Read/write under current authority; acquire or release additional channels where needed.    |
| Hold           | Pause applicable execution.                                                           | Retain authority.                                                                           |
| Resume         | Continue the held run. | Continue with existing claims; normal authority checks still apply. |
| Stop requested | Begin stopping; work may still be executing.                                          | Retain authority until active work and end handling finish.                                 |
| Stop completed | Finish the run and its cleanup.                                                       | Remove that artifact's claims.                                                              |

## Start

Starting does not grant authority by itself. Acquire it in the start callback or later where needed. Configuration does not repeat on restart, so each run must reacquire its claims.

A rejected authority operation raises the normal ARGUS warning and leaves that channel unchanged. Start continues into the task body; the rejection does not automatically fail or stop the task. Earlier successful claims and writes remain in place. If your code acquires authority only at start, resolve the conflict and restart the task to try again.

## Hold and resume

Hold pauses supported execution while retaining authority and the last value. It does not command zero, give control to the operator, or guarantee an in-flight callback has finished.

Resume continues the same run without repeating start or reacquiring retained claims. Overrides still apply; stopping while held performs normal stop cleanup.

## Stop

Tasks, state machines, sequences, timelines, workers and standalone loops automatically release their authority when their run finishes stopping, including natural completion. Active work and applicable end handling finish first. Returning from one cycle, changing state, waiting or holding is not a stop.

**Calculations, including event calculations, require explicit `free` during their lifetime.** Returning, clearing a condition or receiving no new inputs does not release authority. Event calculations share the event's identity. Deleting the runtime triggers cleanup below.

For artifacts with a stop lifecycle, no `free` code is needed for completed-stop cleanup. The same authority results apply when a runtime is deleted:

| Authority acquired with | Role of the stopping artifact | Result |
| --- | --- | --- |
| `command` | Automatic owner, without an override | Channel becomes free; owner and active controller are cleared. |
| `set` | Observe-only publisher, without an override | Channel stays observe-only; owner and active controller are cleared. |
| `command` or `set` | Underlying owner beneath another artifact's override | Remove this owner's claim; keep the other artifact's override. |
| `override` | Current automation override | Remove this override; expose the current underlying owner and policy. |
| `command`, `set`, or `override` | Automation suspended beneath manual control | Remove this artifact's claims; preserve operator control. |

Put final commands in `end:`, which runs before automatic release and still follows authority checks. Cleanup preserves the last value, timestamp and writer.

For example, stopping `pressure_reader` leaves `tank_pressure` **observe-only with no publisher**, keeping its last measurement. A restarted or replacement reader must use `set` to acquire the vacant claim; ordinary upserts cannot acquire it, and `set` cannot displace another publisher.

Task-produced readbacks such as `current_state` follow this rule. Diagnostics that continue publishing while a task is stopped belong to the monitoring artifact that actually publishes them. Controls such as `_running`, `_hold`, and `_target_frequency` remain writable controls rather than measurements.

## Cleanup (artifact deletion)

**Deleting any runtime block removes its authority, including calculations and events.** Cleanup prevents new execution, finishes or cancels in-flight work, then removes the runtime's underlying, active and suspended claims.

Replacement cleans up the old runtime without clearing the replacement's claims. Deleting a whole DCode file cleans up all its runtime blocks. 

**Channels themselves are not deleted.** Their last value, timestamp, last writer and history remain. Observe-only protection remains, and cleanup preserves other artifacts' claims and operator control.

**Functions and callbacks use their caller's authority.** Returning from or deleting them does not release the caller's claims. Calls from script globals or schematics have no eligible authority owner and use the fallback below. See [Callbacks](../DCode/Callbacks.md) for execution behavior.

# Authority operations

For eligible authority owners, these four operations manage claims with or without a value:

| C++ API | DCode | Without a value | With a value |
| --- | --- | --- | --- |
| `commandChannel` | `command` | Acquire or retain automatic ownership. | Acquire/retain ownership and write. |
| `setChannel` | `set` | Acquire or retain observe-only publishing. | Acquire/retain publishing and write. |
| `overrideChannel` | `override` | Acquire or retain an automation override. | Acquire/retain the override and write. |
| `freeChannel` | `free` | Release the caller's applicable authority. | Write a final value and release. |

Without an eligible owner, or when targeting a [remote channel](#remote-channels), all four act as ordinary upserts when given a value and do nothing without one. Channel permissions still apply. An eligible local owner's rejected authority operation never falls back to an ordinary write.

Use a name or fixed handle in C++, or a channel pipe in DCode. For example:

```cpp
rapid.commandChannel(channel);
rapid.commandChannel(channel, value);
```

```dcode
command |channel|
command |channel| = value
```

For local authority operations with a value, the authority transition and write either both succeed or neither changes. Earlier accepted operations in the callback remain visible.

For example, `free |valve_command| = 0` writes zero and releases the caller's applicable control. If another controller prevents that write, neither action happens. Value-free `free |valve_command|` can still relinquish the caller's underlying claim without disturbing another controller.

An ordinary assignment preserves authority. After these accepted statements, the task still owns automatic control and the value is zero:

```dcode
command |valve_command| = 1
|valve_command| = 0
```

Repeated `command` and `set` writes explicitly acquire or retain authority. If control was released, they can acquire an available claim again; ordinary assignments cannot. Accepted local writes take effect during the call, including synchronous calculations, but do not prove physical actuation.

# Overrides

The **owner** is responsible for the channel; the **active controller** can write right now. An override temporarily takes over writing without removing the owner. When it releases, whoever owns the channel at that time can write again.

For instance, imagine a sequence that takes ownership while an event overrides a valve. Each row is a separate actor or lifecycle action:

| Action | `control_owner` | `active_controller` | `value` |
| --- | --- | --- | --- |
| Task A: `command \|valve\| = 1` | Task A | Task A | 1 |
| Event: `override \|valve\| = 0` | Task A | Event | 0 |
| Task A stops | None | Event | 0 |
| Sequence: `command \|valve\|` | Sequence | Event | 0 |
| Sequence waits ten minutes | Sequence | Event | 0 |
| Sequence: `command \|valve\| = 1` — rejected | Sequence | Event | 0 |
| Event: `free \|valve\|` | Sequence | Sequence | 0 |
| Sequence: `command \|valve\| = 1` — accepted | Sequence | Sequence | 1 |

The rejected command changes nothing. Releasing the override keeps the value at **0**; the sequence's next accepted command changes it to **1**.

If the sequence never acquires ownership—or stops before the event releases—the channel becomes **free** on release, still at **0**. A value-free `command` can acquire only a vacant underlying claim; it cannot displace another owner.

**What changes in the other cases?**

- **A measurement uses `set`:** Reader A stops; Reader B uses value-free `set` to become the publisher beneath the override, then waits for release before publishing. Unlike the valve example, no replacement means the channel returns to **observe-only with no publisher**, not free. An existing publisher cannot be displaced by `set`.
- **Another event overrides:** Event C replaces Event B as the active controller. B stopping or releasing cannot disturb C. When C releases, the current underlying owner takes over; B's old override does not return.
- **The operator takes manual control:** The sequence's value-free `command` is rejected too. Manual control blocks both new automation claims and writes, including on observe-only channels. Artifacts can still release their claims or stop. When the operator releases, any remaining valid automation override or owner resumes; stopped artifacts never return.

Taking or releasing authority without a value never changes the stored value or replays an old command.

# Recommended practices

For device plugins, prepare resources in `on_configure`, acquire publishing/control authority in `on_start`, and use ordinary writes during execution. In DCode, keep the intended authority visible beside the action.

## Native DAQ with fixed channels

A driver publishes measurements and feedback, and reads commands chosen by other controllers. These RAPID excerpts show the three lifecycle phases; plugin registration and device I/O are omitted.

Retain these bindings in the task instance:

```cpp
std::optional<RAPID::FixedChannelHandle> pressure;
std::optional<RAPID::FixedChannelHandle> valve_command;
std::optional<RAPID::FixedChannelHandle> valve_feedback;
```

In `on_configure`, create/get the fixed channels and prepare device mappings and buffers:

```cpp
pressure = rapid.createFixedChannel("tank_pressure");
valve_command = rapid.createFixedChannel("valve_command");
valve_feedback = rapid.createFixedChannel("valve_feedback");

if (!pressure || !valve_command || !valve_feedback)
    throw std::runtime_error("Channel preparation failed");
```

Getting an existing fixed channel preserves its value and authority.

In `on_start`, acquire the channels this driver publishes:

```cpp
rapid.setChannel(*pressure);
rapid.setChannel(*valve_feedback);
```

The driver reads `valve_command` without owning it. A publishing conflict fails start before the body runs.

After obtaining a device sample, use the retained handles in `on_task`:

```cpp
rapid.upsertChannel(*pressure, measured_pressure, sample_timestamp);

const double requested_position = rapid.queryChannel(*valve_command);
// Deliver requested_position through the device's output path.

rapid.upsertChannel(
    *valve_feedback, measured_position, feedback_timestamp);
```

Measurements and timestamps come from the device; feedback is not a copy of the request. Handle-based upserts remain prepared operations and report whether each write was accepted. On stop, observations retain their last sample and observe-only policy without this driver's claim. Restart reacquires publishing authority.

## DCode

DCode can acquire authority at start or beside each write. Use a test project and provide the demonstration inputs below.

**Continuous tasks:** You can acquire authority in `start:` and use ordinary assignments afterward. This controller retains ownership between cycles:

```dcode
task_periodic demo_pressure_controller 10 normal:
    start:
        command |demo_valve_command|

    task:
        requested = 0
        if |demo_pressure| < 20:
            requested = 1

        |demo_valve_command| = requested
```

Assignments preserve the claim; an override blocks writes until released. Completed stop removes the claim.

For readability, prefer `command` on commanded writes and `set` on observations, even after acquiring authority in `start:`. Each write then shows its role. These operations can reacquire an available claim after release; ordinary assignments cannot.

For example, this publisher uses `set` with every measurement:

```dcode
task_periodic demo_pressure_conversion 10 normal:
    task:
        set |demo_pressure| = |demo_raw_pressure| * 0.1
```

A controller can likewise use `command` on every output write. Neither form writes through another controller. Eligible static numeric pipes use prepared bindings in [Native C++](../DCode/Native%20C%2B%2B%20Execution.md), with the same authority rules as Lua.

**Sequences and events:** Acquire control at the point of use and release it when that action finishes. This sequence commands a demonstration valve, waits for pressure, then writes a final value and releases:

```dcode
task_sequence demo_fill:
    command |demo_valve_command| = 1
    wait_until(|demo_pressure| >= 40)
    free |demo_valve_command| = 0
```

Ownership remains while waiting. [Completion automatically releases authority](#caesar-lifecycle), so the final line could use `command ... = 0` instead. Omitting it removes the zero command too; cleanup alone leaves the last value unchanged.

An override can reject the final write-and-release; completed stop still cleans up the sequence's claim. Stopping early skips the remaining body lines, so put intentional stop commands in `end:`.

Use `free` to release authority **while still running**. This state machine releases on entry to `manual` and reacquires with `command` in `automatic`:

```dcode
task_state_machine demo_valve_control 10 normal:
    states:
        manual
        automatic

    state manual:
        once:
            free |demo_valve_command|  # Release on entry; keep the current value.
        if target_state == states.automatic:
            transition automatic

    state automatic:
        if target_state == states.manual:
            transition manual
        else:
            requested = 0
            if |demo_pressure| < 20:
                requested = 1
            command |demo_valve_command| = requested
```

It starts in `manual`; use `demo_valve_control_target_state` to request either state. Manual entry preserves the value and allows ordinary operator writes if no other claim blocks them; it does not take a manual override. Automatic acquisition still respects other owners and overrides.

Inside a [DCode event declaration](../DCode/Events.md), this reaction takes an override when the condition fires and releases it when the condition clears:

```dcode
on_firing:
    if value == 1:
        override |demo_valve_command| = 0
    if value == 0:
        free |demo_valve_command|
```

The override persists between reactions; acknowledging the event does not release it. Release exposes the current underlying owner and leaves the last value unchanged.

