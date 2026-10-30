---
summary: Configure device connections, operate automation, and check the result.
created: 2026-08-03T15:41
updated: 2026-10-29T20:15
---

A **module** provides a device connection or shared service; a **task** does work with it, such as reading measurements or sending outputs. Connect to the Engine, select the project, and install the device's [plugin](Plugins.md) before configuring it.

Use one to communicate to hardware devices such as Modbus, LabJack, or Ethercat devices.

# Modules

A module keeps the connection settings for a particular device in one place. For example, a controller's read and write tasks can share its address and connection through the same module. Changing that module can therefore affect both tasks.

The plugin supplies a **module type**, such as a Modbus connection. You create a named **instance** for each device using that type, so two controllers can have separate settings. The screenshots use Example Device and Modbus drivers; other plugins provide their own settings.

## Configure a Module

If the plugin discovers a device and presents setup recommendations through the shared recommendation UI, you should see a notification to setup a module when a device is detected. Open the bell's **Notifications**, choose **Set up**, and review the suggested module, tasks, and channel mappings. Follow **Next** to the final review and create them.

![A device-discovery notification with its Set up action.](../Getting%20Started/_attachments/Pasted%20image%2020261026230635.png)

You can see what the plugin is recommending to create with the Module, such as a Read or Write Task, and associated Channels. Configuration options depend on the Plugin.

![Reviewing the module and tasks before creation.](../Getting%20Started/_attachments/Pasted%20image%2020261026231002.png)

To create one manually, open **Modules**, right-click the resource list, choose **Create Resource**, select its type, and name the instance. Enter the connection settings, apply the configuration, and check the connection status and errors.

![A Modbus module's connection settings and linked tasks.](../Engine/_attachments/Pasted%20image%2020261027193841.png)

For how types, instances, and shared connections fit together, see [Engine Modules](../Engine/Modules%20and%20Tasks.md#modules).

# CAESAR

Tasks are the work you run: reading a sensor repeatedly, controlling pressure, or carrying out a test procedure. **CAESAR** is the Engine component that runs this work and reports its progress. Open **Tasks** to find the configured work and its controls; source buttons open the script or module that defines it.

Different tasks suit different jobs. A **periodic task** repeats at a chosen rate. A **state machine** organizes work into stages such as idle, filling, and venting. A **sequence** follows a procedure from beginning to end, while a plugin's **worker task** can run a device's continuous acquisition process. The available controls depend on that structure.

## Task Configuration

Connecting to a device is only part of the setup. A read task needs to know which inputs supply your measurement channels; a write task needs to know which channels command its outputs.

Use the module editor's task buttons to add supported plugin tasks. Open the task, select its module, and check its device-to-channel mappings before choosing **Apply**. Configure DCode tasks by editing and activating their [script](DCode%20Editor.md).

![The Tasks editor beside Channels, showing task controls and mappings.](../Getting%20Started/_attachments/Pasted%20image%2020261026231551.png)

## Task Controls

Once a device is configured, you can start collecting measurements or run its automation. During a test, you may need to pause a procedure to check something, continue it, or stop the run. The task controls let you do that while showing whether the work is actually running at the requested rate.

For repeating work, frequency is how often it runs: 10 Hz means ten iterations per second. Compare the target with the measured actual rate. For a state machine, current and target state show which stage it is in and which transition you requested.

| Control or readout | Use |
| --- | --- |
| Start / Stop | Begin or end a run. |
| Hold / Release | Pause supported work, then continue the same run. |
| Target / Actual frequency | Compare the requested rate with measured execution. |
| Current / Target state | Check the current state and request a transition. |

In linked-task lists, click the action and then its check mark to confirm. Check running/held state, measured rate, and channel timestamps afterward. Starting an output task can command equipment; stopping a task does not by itself establish the equipment's final state.

For task structures, startup, and control behavior, see [Task Structures](../Engine/Modules%20and%20Tasks.md#task-structures), [Task Channels](../Engine/Modules%20and%20Tasks.md#task-channels), and [Lifecycle](../Engine/Modules%20and%20Tasks.md#lifecycle).

## Loops, Calculations, and Callbacks

Some work runs in response to a timer, measurement, or request rather than through an ordinary task's Start button. The Tasks view also lets you inspect these definitions and follow them back to their source:

| Work | Example and purpose |
| --- | --- |
| Loop | Repeat a small operation, such as publishing a heartbeat once a second. DCode loops start when their script is activated. |
| Calculation | Update a derived signal when its inputs change, such as converting a sensor voltage into pressure. |
| Callback | Provide a named operation that another part of the system calls when needed, such as a reusable valve procedure. The list shows the definition, not each individual call. |

See [Other Artifacts](../Engine/Modules%20and%20Tasks.md#other-artifacts) for their execution rules.

## Timelines

A timeline runs actions at scheduled times during a procedure. For a test countdown, it might begin filling at T−60 seconds, check readiness at T−10, and start ignition at T0. Use it when actions need to share a clock before and after a common reference point.

**T0** is that reference point. **Mission time** shows where you are relative to it: negative times are before T0 and positive times are afterward. Each scheduled group of steps is called a **bucket**. Open the timeline in Tasks to inspect its clock and the progress of those groups, then use its start and hold controls to operate the run.

If you need to adjust the countdown, changing mission time or target T0 opens a preview of the scheduled groups you would cross and the proposed actions. Review before applying; a running timeline stays held until you resume it. See [Timelines](../DCode/Timelines.md) for scheduling, clock holds, and recovery details.

# Removal and Replacement

Editing a saved file and changing the work already installed in the Engine are separate actions. For example, removing a task from a script does not update the Engine until you activate that script again. Review running work before applying a replacement or deletion.

Apply module changes or reactivate scripts to update their runtime definitions. Deletion opens [Project Actions](Node%2C%20Context%2C%20and%20Project%20Board.md#project-actions-and-references) for review. Retained script declarations can recreate resources when activated again; [Removal and Replacement](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) explains their lifecycle.
