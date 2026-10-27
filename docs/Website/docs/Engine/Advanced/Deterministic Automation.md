---
summary: Prepare a repeated control path and qualify its timing and failure response.
created: 2026-09-09
updated: 2026-10-26T21:52
---

Deterministic automation aims to make a repeated control cycle predictable: which inputs it uses, what order it runs in, when it finishes, and how it responds to failure. This matters when a late or stale result could produce the wrong equipment command.

For a pressure controller, the path might be read the device, calculate a valve request, then send it. The useful timing measurement includes the device transactions and feedback. DARTWIC provides scheduling, prepared channel access, native execution, and diagnostics to help build and inspect that path.

# Execution mode

Start with Lua for ordinary procedures, state machines, prompts, and changing channel sets. It is the default DCode backend and is useful for developing the behavior before tuning execution.

Use fixed channels and Native C++—the compiled DCode backend—when a known repeated numeric path needs less recurring storage and interpreter work. **Prepared** means its storage, channel bindings, and reusable buffers are set up before execution. Choose this from measured cost and required response time, rather than frequency alone.

For example, a 10 Hz controller requests a 100 ms period, but its required equipment response may be a different interval. State both before choosing a backend. A hard physical deadline also needs suitable operating-system behavior, drivers, hardware timing, and testing under expected load.

# Fixed channels and bindings

Prepared execution sets up known numeric storage, retained channel bindings, and reusable buffers before work starts. CAESAR scheduling, fixed channels, Native C++ DCode, and supported prepared plugin calls can reuse that framework storage during repeated work.

Use [Channels and Control](../Channels%20and%20Control.md#fixed-and-dynamic-channels) for the storage concepts and [Builder](DARTWIC%20Builder.md#fixed-native-channels) for declarations and binding checks. Preparation does not establish the cost of your whole callback: device I/O, plugin bodies, inline calculations, host calls, and lifecycle work can still allocate or block.

# Inline work and delivery

Include dependent calculations and event reactions in a writer's measured duration; they run before that write returns. This also applies when a native task reaches a Lua calculation. [Execution and Timing](../Execution%20and%20Timing.md) owns the scheduling and per-line read/write explanation.

Recording and telemetry run asynchronously and have separate loss counters. A committed value is separate from recorded history, a display update, or equipment acknowledgement. Follow the affected path when investigating a failure.

# Task health

Check release lateness, callback duration, actual frequency, and missed/failed cycles together. The independently sampled task-health report can identify a callback that remains active beyond its completion deadline, but does not terminate that callback or choose the equipment response.

[Diagnostics](../Diagnostics%20and%20Troubleshooting.md#task-health-and-failures) owns the measurements and deadline settings. Decide how your application should handle invalid data, disconnection, late work, or a rejected command.

# Task groups

For a read → control → write cycle, first configure tasks named `device_read`, `control`, and `device_write`. Give them the same frequency when every cycle should run all three. This excerpt then groups their due work in declaration order:

```dcode
task_group device_cycle:
    run: device_read
    run: control
    run: device_write
```

The group orders callbacks; it does not supply the device implementations. A slower member runs only when its own schedule is due.

Ordering does not require an earlier member to succeed. Check acquisition validity, sample age, and member outcomes before using the result. The [read-control-write example](../Execution%20and%20Timing.md#read-control-write-example) demonstrates the ordering and failure behavior without hardware.

# Timing and failure tests

**Qualification** means testing the complete setup against its timing and failure requirements on the intended machine, devices, and workload.

1. State the required period and completion time, and what should happen on a missed or failed cycle.
2. Configure device modules, fixed channels, mappings, buffers, and native scripts before starting.
3. Confirm Builder's activation result and fixed bindings, then verify the expected values at a modest rate.
4. Measure the full acquisition → control → output path under representative load. Include device feedback, rather than stopping at the accepted command value.
5. Exercise lost input, disconnect/reconnect, command rejection, slow work, and recording or telemetry pressure. Check the response you intended actually occurs.

Record the required period, observed worst delay, missed/failed work, and actual equipment response for each trial. Keep the results specific to the machine, build, driver, and workload tested. [Execution and Timing](../Execution%20and%20Timing.md) explains the boundaries, and [Native C++ Execution](../../DCode/Native%20C%2B%2B%20Execution.md) covers compiler setup.

# Timing measurements

Native DCode, fixed records, supported fixed numeric collections, and typed prepared plugin calls can reuse storage. Other operations, plugin code, and inline calculations can still allocate or block. The native benchmark measures host C++ allocation/free counts and release-to-completion time through missed-release recovery. Generated modules and plugin DLLs need separate probes; zero host counts alone do not prove an allocation-free deployment.

A short desktop benchmark is evidence for that workload and run, not a worst-case deadline bound. Windows scheduling and competing machine load can delay a release even when its callback performs no allocation; missed releases alone do not identify whether the delay came from the OS, callback logic, or core contention. Include driver execution, recording, contention, and reconfiguration in qualification. A callback-duration number by itself omits scheduling lateness and can omit recovery work.
