---
title: Deterministic Automation
summary: Prepare a control path, measure its timing, and decide how it responds to failures.
created: 2026-09-09
updated: 2026-10-14T15:14
---

A controller needs more than a requested frequency. It needs to read the intended inputs, finish its work in time, and handle a failed measurement or command. DARTWIC provides scheduling, fixed-channel storage, native DCode, and diagnostics to help you build and inspect that path.

For example, a pressure controller might read a device, calculate a valve request, and write the request back to the device. The useful timing measurement covers all three steps, including the device transactions.

## Choose the simplest path that meets the measured need

Start with Lua for ordinary procedures, state machines, prompts, and changing channel sets. It is the default DCode backend and is useful for developing the behavior before tuning execution.

Use fixed channels and Native C++ when you have a known repeated numeric path and need to reduce recurring storage and interpreter work. A plugin can use the same fixed-channel APIs with handles and buffers prepared during configuration. Choose this based on measured work and required response time, rather than a frequency threshold alone.

A desktop benchmark cannot establish a hard physical deadline. A deployment with that requirement also needs a suitable operating system, driver behavior, hardware timing, and testing under its expected load.

## Why fixed RAPID channels exist

Fixed channels reserve storage before execution. Native DCode and plugin tasks can retain validated handles instead of finding channels by name on every cycle. Plugins also prepare transaction buffers and mappings before starting.

A fixed read observes the value when that line runs. An accepted write becomes visible at that line; it is not held until the task finishes. Several reads or writes are not a transaction or a task-wide snapshot.

[Channels](Channels.md#fixed-and-dynamic-channels) explains declaration and capacity. [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) shows how the Modbus plugin prepares its repeated work.

### The strongest supported repeated-release path

For a prepared numeric cycle, combine CAESAR scheduling, declared fixed channels, and Native C++ DCode or a plugin using retained handles. Supported repeated numeric operations reuse prepared framework storage.

Keep that claim separate from the cost of your complete callback. Plugin bodies, device I/O, inline calculations, general host functions, and lifecycle work can allocate or block. Native compilation does not make a loop bounded or a device respond sooner.

## Delivery and dependencies must not be surprises

When a task writes a channel, dependent calculations and event reactions can run before the write returns. Their execution and any wait for them are part of that task's duration. This remains true when a native task triggers a Lua calculation.

Recording and telemetry use asynchronous delivery. A live value can be accepted before it is recorded or displayed. Under overload, delivery can lose observations while the local value remains committed. Inspect the separate recording and notification loss counters in [Diagnostics](../Interface/Diagnostics.md); do not use a display update as an acknowledgement from equipment.

## 2. Health and response

Inspect actual frequency, release lateness, callback duration, missed cycles, and failed cycles together. An average rate can hide an occasional long cycle.

CAESAR also samples task health outside the callback. It can report an active callback that has exceeded its completion deadline even while that callback is blocked. It does not forcibly terminate the callback or decide the device's response. [Tasks](Tasks.md#controls-and-failure-diagnostics) explains these observations and deadline configuration.

Decide what your controller should do when input is invalid, a device disconnects, or a cycle finishes late. The right response may be to stop a procedure, hold a state, inhibit an output, or alert an operator; it depends on the equipment.

## 3. Deterministic composition

A task group runs members that are due together in declaration order:

```dcode
task_group device_cycle:
    run: device_read
    run: control
    run: device_write
```

This fragment assumes those three tasks already exist. Give them the same frequency when every cycle should run all three. A slower member runs only when its own schedule is due.

In the DCode editor, typing after `run:` suggests registered tasks and loops, plus declarations in the open file.

The read callback returns before control starts, and accepted channel writes are already visible. A failed or stopped read does not automatically prevent later members from running. Check acquisition validity and freshness in your application. The group's reported member outcomes help explain what happened; order alone does not prove success.

Follow the [read → control → write example](Tasks.md#try-a-read-control-write-cycle) to see the ordering without hardware.

## Build and qualify a prepared automation

1. State the required period and completion time, and what should happen on a missed or failed cycle.
2. Configure device modules, fixed channels, mappings, buffers, and native scripts before starting.
3. Confirm Builder's activation result and fixed bindings, then verify the expected values at a modest rate.
4. Measure the full acquisition → control → output path under representative load. Include device feedback, rather than stopping at the accepted command value.
5. Exercise lost input, disconnect/reconnect, command rejection, slow work, and recording or telemetry pressure. Check the response you intended actually occurs.

Keep the results specific to the machine, build, driver, and workload tested. [Execution and Timing](Execution%20and%20Timing.md) explains the boundaries, and [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) covers compiler setup.
