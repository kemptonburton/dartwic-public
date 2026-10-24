---
summary: Start, stop, hold, and inspect runtime tasks.
updated: 2026-10-23T18:19
status: coming-soon
created: 2026-08-03T15:41
---

Open **Tasks** to operate CAESAR tasks. A task card presents controls and diagnostics for a runtime task; plugins can supply specialized cards and configuration editors.

Your card or list view choice is remembered in this browser or desktop app when you reopen Tasks, including after restarting the interface. Timelines use their own view without replacing that saved choice.

Use the source buttons on DCode task cards and rows to open their script; clicking the card or row itself does not open the file. DCode loop, calculation, and callback rows open their declaring script; focused rows support Enter or Space. Callback source buttons open the same declaration. Runtime controls such as status and target frequency remain separate from that navigation. Unavailable list values display `-`, including target frequency for tasks that do not expose that control.

Module-backed tasks show the module link and its shared connection indicator in both list and card views. Green means the declared device connection is healthy, red means disconnected, and a muted icon means the observation is unavailable or stale. Hover for the endpoint and current state. A healthy connection does not guarantee that every configured mapping succeeds.

## Runtime tabs

Tasks includes Tasks, Timelines, Loops, Calculations, and Callbacks. The Callbacks tab follows Calculations and lists active DCode callback registrations with their argument names, execution backend, and source declaration. Search matches callback names, arguments, and source paths; sortable columns and source links use the same compact table controls as other runtime lists. Refresh reloads the registrations, and script activation updates the inventory. This list describes registered declarations rather than individual running calls.

## Task controls

Starting, stopping, holding or refreshing tasks keeps the current rows visible,
preserving scroll position and selection while the inventory request completes.
A temporary refresh failure retains the last successful results. A new search or
connection can show the initial loading view.

| Control | Effect |
| --- | --- |
| **Start / Stop** | Starts or ends a run. Closing the tab does neither. |
| **Hold / Release** | Pauses supported task execution while preserving state. |
| **Target frequency** | Requested Hz for scheduled tasks. |
| **Actual frequency** | Measured execution rate; observe-only. |
| **Current state** | State-machine state currently executing. |
| **Target state** | Requests a state; acceptance depends on the task implementation. |

Start a task, then confirm its running state and actual frequency. A running-but-held task is not advancing normally. Releasing its **TASK HOLD** event also clears that task's hold channel, allowing its execution path to resume; the accepted release request is not proof that the next cycle has completed. Stopping clears hold and releases the task's automatic channel ownership; it does not imply that every output has been driven to a hardware-safe value.

A newly created DCode scheduled task starts with its declared target frequency: `task_periodic example 100 normal:` initializes a 100 Hz target. Reconfiguring an existing task preserves its current target, including an operator's adjustment. The target is a requested rate; inspect actual frequency separately.

To start a task when the Engine opens a workspace, configure startup value `1` on its `<task_name>_running` channel. Startup holds callbacks until task and fixed-channel configuration has finished, then starts the requested task. Confirm its running and actual-frequency channels after connection.

## Delete tasks

Task deletion opens Project Actions with references, explicit task stops, any task-group releases, task removal, owned-channel cleanup, and snapshot saving. Confirm the full list before applying. Referenced inputs are shown for review without automatically becoming deletion candidates. Deleting a module includes its linked tasks in the same reviewed cascade.

Tasks outside the deletion that use removed channels remain stopped. Repair their references before starting them again. Source files remain intact, so activating a DCode declaration can recreate a deleted task and its channels. Cancellation retains completed removals and reports what happened; it does not undo deletion. A blocked action displays the reason beside its apply controls.

## Diagnose timing

Inspect execution time, missed cycles, failed cycles, and the task's health details alongside actual frequency. A missed cycle counts a skipped release; a failed cycle counts a callback exception caught by CAESAR. An active overdue callback is still executing beyond its completion deadline. These observations do not identify the cause by themselves.

Workers report their own work rate rather than a scheduled actual frequency. An unpaced worker or sequence has no assumed timing deadline. If work takes longer than the requested period, raising frequency makes the schedule harder to meet. Check source logic or device polling before changing the target. [Engine Tasks](../Engine/Tasks.md#controls-and-failure-diagnostics) explains the counters and completion deadlines.

State-machine requests deserve special care: DCode handlers must explicitly compare the requested target and call `transition`. Selecting a target is not proof that the transition occurred. Confirm the current-state channel afterward.

## Configure behavior

Task configuration determines the implementation and its parameters; live task controls determine the current run state. Use the task's editor for configuration and inspect its save/apply result. For DCode, edit and activate the script that declares the task.

See [Engine Tasks](../Engine/Tasks.md) for structures and lifecycle, [DCode](../DCode/Overview.md) for scripting, and [Commanding and Control](../Engine/Commanding%20and%20Control.md) for ownership.
