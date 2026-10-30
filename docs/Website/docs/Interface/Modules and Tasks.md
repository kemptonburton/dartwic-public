---
summary: Configure device connections, operate automation, and check the result.
created: 2026-08-03T15:41
updated: 2026-10-29T22:44
---

A module provides a connection or service; a task does work with it. Open **Modules** or **Tasks** from the left sidebar to create, configure, and monitor them. This walkthrough uses a Modbus device to connect inputs and outputs to channels and operate the resulting tasks. Install the device's [plugin](Plugins.md) and select your project first.

# Modules

A **module**, in DARTWIC, is a C++ object provided by an Engine plugin. Most modules handle device communication and control—a **driver**—but they can also provide other services or manage resources.

Open **Modules** in the left sidebar to browse the project's saved modules. From this resource, you can create a module, open its settings, monitor its connection and linked tasks, or reload and remove it. Select a module from the resource list to open its editor.

![](_attachments/Pasted%20image%2020261029224137.png)

Here, a Modbus module keeps the controller's address and connection in one place so its read and write tasks can share them.
## Configure a Module

To create a module manually, right-click the Modules resource list and choose **Create Resource**. The picker shows the **module types** supplied by your installed plugins. Search or filter the list and select the type you need.

![](_attachments/Pasted%20image%2020261029215038.png)

Enter a name and choose **Create module**. This creates an **instance** of that type: two Modbus devices can use the same implementation with separate names, addresses, and connections.

Open the new module, enter the driver's connection settings, and apply them. Check the connection status and any errors. The plugin determines the available settings; [Engine Modules](../Engine/Modules%20and%20Tasks.md#modules) explains types, instances, and shared connections.

## Set Up a Discovered Device

Some plugins can find devices for you. Open the bell's **Notifications** and choose **Set up** on the device suggestion.

![A discovered device's Set up notification.](../Getting%20Started/_attachments/Pasted%20image%2020261026230635.png)

Review the suggested module settings, tasks, and channels, then use **Next** to reach the final review. Create only the resources you need; the choices depend on the plugin.

![Reviewing a discovered module and its suggested tasks before creation.](../Getting%20Started/_attachments/Pasted%20image%2020261026231002.png)

# CAESAR Tasks

A **task** is work you can run, such as reading a device, controlling pressure, or carrying out a procedure. **CAESAR** is the Engine component that runs it.

Open **Tasks** in the left sidebar to browse the work installed in the Engine. You can create tasks, search and filter them, switch between cards and a list, and select one to open its configuration. The task controls let you start, hold, resume, or stop supported work and check its progress. 
Toolbar tabs also open timelines, loops, calculations, and callbacks.

![](_attachments/Pasted%20image%2020261029224416.png)

## Task Types and Structures

The selected card shows three different things: its **instance name**, `modbus_127_0_0_1_502_u1_read`; its **type**, `modbus_tcp_client.read`; and its **structure**, Periodic Task.

The **type** is the implementation supplied by the plugin. When creating a task, you select that type and give the new instance a name. 

![](_attachments/Pasted%20image%2020261029215120.png)

The **structure** is DARTWIC's built-in runtime that the type uses. Here, periodic means it repeats at a configured rate.

| Structure | How the task runs |
| --- | --- |
| [Periodic](../Engine/Modules%20and%20Tasks.md#periodic-tasks) | Repeats work at a configured rate, such as reading a sensor ten times per second. |
| [State machine](../Engine/Modules%20and%20Tasks.md#state-machine-tasks) | Repeats the current stage's work and transitions between stages such as idle, filling, and venting. |
| [Sequence](../Engine/Modules%20and%20Tasks.md#sequence-tasks) | Runs an ordered procedure once per start, including waits between steps. |
| [Worker](../Engine/Modules%20and%20Tasks.md#worker-tasks) | Runs long-lived work such as a device's continuous acquisition process. |
| [Timeline](../DCode/Timelines.md) | Runs groups of actions at scheduled times around a common clock, such as a countdown. |

DARTWIC also provides DCode types for the structures except worker, letting you write your own logic. [Engine Task Structures](../Engine/Modules%20and%20Tasks.md#task-structures) explains the runtimes; the steps below show how to create plugin and DCode tasks.

## Task Configuration

### Create a Plugin Task

For this device, choose a read task to publish measurements or a write task to send channel commands to its outputs. In **Tasks → Tasks**, click the plus button, **Create task**. 

![](_attachments/Pasted%20image%2020261029215302.png)

Search the available types, select the driver's type, name the instance, and choose its module when required. Then choose **Create task**.

![](_attachments/Pasted%20image%2020261029215543.png)

Open the created task and configure its mappings: which device input publishes to which channel, or which channel commands each output. Edits that need to be saved show in yellow, if that task uses the Plugin SDK Config Map. Choose **Apply** to save the configuration.

![](_attachments/Pasted%20image%2020261029220047.png)

If the Plugin that adds the Module also uses the Config Map SDK, you can also use the task buttons in a module editor to begin with a compatible type and module selected. See [Task Types and Instances](../Engine/Modules%20and%20Tasks.md#task-types-and-instances) for how these reusable implementations become configured tasks.

![A task editor beside Channels, showing its module and channel mappings.](../Getting%20Started/_attachments/Pasted%20image%2020261026231551.png)

Plugins can give completely different config UI's and user panels for configuring Module and Task config and settings, so configuration once you have the Module or Task open depends completely upon the Plugin.
### Create a DCode Task

For your own automation, choose the DCode **Periodic Task**, **State Machine Task**, or **Sequence Task** in New Task. These suit repeating control logic, stages such as filling and venting, or a procedure that runs from beginning to end.

![](_attachments/Pasted%20image%2020261029220510.png)

Name the task and create it. The Interface creates and activates a starter script, then opens it for editing. Add your logic using the matching [DCode Tasks example](../DCode/Tasks.md#task-execution), and use **Run script** to apply it. You can also define tasks in an existing script; [DCode Editor](DCode%20Editor.md) covers that workflow.

![](_attachments/Pasted%20image%2020261029220557.png)

You dont have to create a DCode task through the Tasks resource either. Just add the task runtime block declaration to any DCode script and activate it, the Task will popup in the Tasks resource.

## Task Controls

With the task configured, use **Start** to begin its work. A task can be running but held, so check both controls and the resulting channel readings.

![](_attachments/Pasted%20image%2020261029220833.png)

| Control or readout | Task channels | Use |
| --- | --- | --- |
| Start / Stop | `<task>_running` | Write `1` to request start or `0` to request stop. |
| Hold / Release | `<task>_hold` | Write `1` to hold supported work or `0` to continue the same run. |
| Target / Actual frequency | `<task>_target_frequency` / `<task>_actual_frequency` | Set the requested rate and read the measured rate; 10 Hz means ten iterations per second. Actual frequency is read-only. |
| Current / Target state | `<task>_current_state` / `<task>_target_state` | Read the current stage and write a requested state-machine transition. The task's logic decides whether to accept it; current state is read-only. |

Replace `<task>` with the task's name: a task named `tank_fill` has `tank_fill_running`, for example. You can command these control channels from Channels, DCode, or a client instead of using the task buttons. Available channels depend on the task's structure and implementation.

Starting a write task can command equipment depending on its configuration and the Task type. After Stop, check equipment feedback for its final state. [Task Channels](../Engine/Modules%20and%20Tasks.md#task-channels) and [Lifecycle](../Engine/Modules%20and%20Tasks.md#lifecycle) explain the controls and stop behavior.

## Loops, Calculations, and Callbacks

The toolbar also opens work triggered by timers, channel updates, or calls from other code. For example, the DCode **loop** below supplies valve-pulsing logic using the same channel names mapped in the Modbus task.

![](_attachments/Pasted%20image%2020261029215921.png)

Use a [loop](../DCode/Loops.md) for small repeating work, a [calculation](../DCode/Channel%20Calculations.md) to derive a value when inputs change, or a [callback](../DCode/Callbacks.md) for a named procedure called when needed. Define one in a script and activate it, then use its Tasks view to inspect it or open its source. The linked guides provide syntax and examples; plugins can supply these features too.

## Timelines

A **timeline** schedules actions around a common clock—for example, start filling at T−60 seconds and begin ignition at T0. **T0** is the reference point; **mission time** counts before and after it. A scheduled group of steps is a **bucket**.

![](_attachments/Pasted%20image%2020261029224037.png)

Create a script using the [timeline example](../DCode/Timelines.md#timeline-example), activate it, then open **Tasks → Timelines**. Inspect its clock and bucket progress, and use Start or Hold to operate the run.

Changing mission time or target T0 opens a preview of the scheduled groups you would cross and the proposed actions. Review before applying; a running timeline stays held until you resume it. [Timelines](../DCode/Timelines.md) explains scheduling, clock holds, and recovery.

# Removal and Replacement

Apply module changes or reactivate scripts to update the work installed in the Engine. Deletion opens [Project Actions](Node%2C%20Context%2C%20and%20Project%20Board.md#project-actions-and-references) so you can review affected resources. Check stopped tasks and partial results afterward. [Removal and Replacement](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) explains what remains and what is removed.
