---
summary: Configure device connections, operate automation, and check the result.
created: 2026-08-03T15:41
updated: 2026-10-26T21:52
---

A **module** provides a device connection or shared service. A **task** does work, such as reading that device or running an automation. Several tasks can use one module.

# Configure a module

Open **Modules**, choose an installed plugin's module type, name the instance, and enter its parameters. Follow the driver's documentation for addresses, mappings, and timeouts. [Plugins](Plugins.md) explains installation.

Save and reload the module, then inspect its connection and any reported errors. Valid configuration does not prove the device connected; a connected device can still reject a particular mapping. Check readings and feedback before running outputs.

Plugin task types select their module and arguments in the task editor. Activating a DCode script registers its declared tasks; use [DCode Editor](DCode%20Editor.md) to edit that logic.

# Runtime status

Open **Tasks**. Its tabs separate tasks, timelines, loops, calculations, and callbacks. Callbacks list registered declarations, rather than individual running calls.

Use source buttons to open a declaration or module configuration. A module connection indicator means connected, disconnected, or unavailable/stale; inspect its endpoint and errors when needed. Healthy connectivity does not establish that every device transaction succeeds.

# Task controls

| Control or readout | Meaning |
| --- | --- |
| Start / Stop | Begin or end a run. Closing a tab does neither. |
| Hold / Release | Pause supported work while preserving its state. |
| Target frequency | The requested execution rate. |
| Actual frequency | The measured execution rate. |
| Current state | The state currently executing. |
| Target state | A request handled by the task's own transition logic. |

After Start or Release, confirm the runtime state and measured activity. A task can be running but held. A state request does not establish that the transition happened.

Stopping waits for executing work to return. It releases applicable automatic channel ownership after stop completes; final output values depend on the task or driver. Check equipment feedback separately.

For startup behavior, configure startup value `1` on the task's `<task_name>_running` channel. The Engine defers that start until configuration is ready. See [Engine lifecycle](../Engine/Modules%20and%20Tasks.md#startup-and-stop).

# Timeline controls

Timeline controls expose mission time and target T0. A time change opens a preview of crossed buckets and their proposed actions. Applying the change leaves a running timeline held until you resume it. Check the preview before applying; editing a clock is different from restarting a run.

# Configuration updates and deletion

Module configuration changes use save/reload. DCode changes use script activation. These configure behavior; live Start, Hold, and frequency controls operate the current run.

Deletion opens the [Project board](Node%2C%20Context%2C%20and%20Project%20Board.md#project-actions-and-references) with affected tasks, channels, and references. Review its steps and partial-failure results. A retained DCode declaration can recreate resources when activated again.

If work falls behind, compare frequency, execution time, missed/failed cycles, and health. [Diagnostics and Troubleshooting](../Engine/Diagnostics%20and%20Troubleshooting.md) explains what those observations establish.
