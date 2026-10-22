---
summary: Create and inspect a small DCode task and its calculated output.
updated: 2026-10-14T20:57
created: 2026-08-03T15:41
---

Create this demo in a test project. It writes only `docs_demo_*` channels and does not need a hardware plugin.

## Create the script

Open **Scripts**, create `docs_demo.dcode`, and enter:

```dcode
task_periodic docs_demo_clock:
    task elapsed_seconds:
        |docs_demo_seconds| = elapsed_seconds

channel_calculation docs_demo_minutes:
    return |docs_demo_seconds| / 60
```

The task publishes elapsed time on a schedule. The calculation runs inline when `docs_demo_seconds` is committed and writes `docs_demo_minutes`.

## Validate and activate

Save the script, use the editor's validation/build diagnostics, and correct reported errors before activating it. Activation registers the task and calculation with the engine. Use the task's **Start** control, or set `docs_demo_clock_running` to `1` from Channels if it is stopped.

Open **Channels** and search for `docs_demo`. While the task runs, seconds should advance and minutes should be seconds divided by 60. The interface updates on its telemetry interval, so it need not show every task iteration.

| Channel | Expected behavior |
| --- | --- |
| `docs_demo_seconds` | Increasing active elapsed time while the task runs. |
| `docs_demo_minutes` | Derived seconds / 60. |
| `docs_demo_clock_running` | `1` while running, `0` while stopped. |
| `docs_demo_clock_target_frequency` | Requested update rate in Hz. |
| `docs_demo_clock_actual_frequency` | Measured rate; read-only. |
| `docs_demo_clock_hold` | `1` pauses the task while preserving state. |

Stop the demo through its task control when finished. Closing the script tab does not stop it. Saving source edits also does not prove the running declaration was replaced; activate the edited version and inspect the build result.

## Keep values between iterations

Use ordinary variables for data owned by one task:

```dcode
task_periodic docs_demo_counter:
    start:
        count = 0

    task elapsed_seconds:
        count = count + 1
        |docs_demo_count| = count

    end:
        print("Demo counter stopped")
```

`start:` initializes the run, `task:` repeats, and `end:` performs stop handling. Variables assigned in a runtime block persist across these sections; initialize them before reading. `local` is optional, and explicit functions have their own scope. See [Values and Scope](Values%20and%20Scope.md).

## If it does not run

| Symptom | Check |
| --- | --- |
| No task appears | Activation/build result and script errors. |
| Values remain stationary | Running and hold controls. |
| Calculation output stays unchanged | Calculation errors and whether a dependency is being updated. |
| A write is ignored | Channel authority and the current owner. |
| UI lags while diagnostics advance | Telemetry/display interval; compare with the engine's actual frequency. |

Continue with [Periodic Tasks](Writing%20Periodic%20Tasks.md), [Channel Calculations](Channel%20Calculations.md), or [Events](Events.md).
