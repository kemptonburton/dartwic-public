---
summary: Edit scripts, understand saved versus active code, and find runtime errors.
created: 2026-10-24
updated: 2026-10-30T02:35
---

**DCode** is DARTWIC's automation language for calculations, device control, event conditions, and procedures. Open **Scripts** in the left sidebar to work with it. This guide covers opening or creating a script, the editor's language tools, choosing what to build, and activating changes in the Engine.

# Open or Create a Script

Open **Scripts** and select an existing file, or right-click its resource list and choose **Create Resource** to name a new script. The file opens in an editor tab.

![](_attachments/Pasted%20image%2020261030023548.png)

Add your code or start with an example from the DCode guides below. Create any channels or other inputs required by the example first. Check the file's save/synchronization status while editing; saving and activating are separate steps.

# Editor

The editor provides language help while you write, so you can check syntax, look up arguments, and follow references without leaving your script.

## Syntax Checking

Error and warning markers identify problems in the script. Hover a marker to read its message and locate the affected code. Correct reported problems before activation; activation results and runtime events may reveal additional issues.

For example, spelling the keyword `transition` incorrectly.

![](_attachments/Pasted%20image%2020261030022442.png)

## Autocomplete

As you type, suggestions help complete keywords, runtime blocks, fields, functions, variables, and channel references where supported. Function calls also show argument hints, including the parameter you are currently entering. Available plugin functions depend on the installed plugins.

For example, writing channel names using pipes `||` will pull up a list of the current matched channels the engine has in memory.

![](_attachments/Pasted%20image%2020261030022527.png)

## Hover Help and Docstrings

Hover a supported function, keyword, or field to read its documentation: what it does, its signature and arguments, and examples where provided. These inline descriptions and docstrings help you use a feature without memorizing its syntax. The [DCode reference](../DCode/Reference/Overview.md) provides the full catalog.

Hovering most keywords or blocks will show its documentation.

![](_attachments/Pasted%20image%2020261030022652.png)

Hover a channel reference such as `|tank_pressure|` to inspect its live value and related information while editing.

![](_attachments/Pasted%20image%2020261030022747.png)

## Ctrl-Click Navigation

Hold **Ctrl** and click a supported reference to follow it. Variables and functions can lead to their definitions; imports and YAML parameter paths open related files. Channel references open Channels, task references open their task view, and native plugin references open the plugin's settings where available.

Control Clicking the import shown will open its YAML file.

![](_attachments/Pasted%20image%2020261030022832.png)

## Gutter Icons

The **gutter** is the strip beside the line numbers. Icons mark runtime declarations such as tasks, loops, calculations, and events. Hover an icon for its name and current status, or click it to open the corresponding runtime view.

Colors help you spot activity: green generally means active or registered, grey means inactive, and yellow can indicate a held task or work needing activation. Calculations can show red for an error. Read the tooltip for the exact state.

![](_attachments/Pasted%20image%2020261030023031.png)

Templates also have gutter controls to expand or collapse their generated code. In a YAML parameter file, gutter links open the scripts that use those entries.

![](_attachments/Pasted%20image%2020261030023101.png)

![](_attachments/Pasted%20image%2020261030023123.png)

## Line Followers

For some runtime blocks, a line follower will show the current section of the block that is executing.

![](_attachments/Pasted%20image%2020261030022946.png)

# DCode Features

Start with the [DCode overview](../DCode/Overview.md) and [Common Syntax and Functions](../DCode/Common%20Syntax%20and%20Functions.md) for the language basics. Use [Values and Scope](../DCode/Values%20and%20Scope.md) for variables and shared state, then choose a guide for the job you want to do.

One file can define several pieces of Engine-managed work, called **runtime blocks**.

| You want to… | Create… | Main guide |
| --- | --- | --- |
| Repeat control logic, move between stages, or run an ordered procedure | A periodic, state-machine, or sequence task. | [DCode Tasks](../DCode/Tasks.md) |
| Schedule actions during a countdown | A timeline with actions before and after T0. | [Timelines](../DCode/Timelines.md) |
| Repeat a small background operation | A loop that starts on activation. | [Loops](../DCode/Loops.md) |
| Scale a measurement or derive a value | A channel calculation. | [Channel Calculations](../DCode/Channel%20Calculations.md) |
| Report a condition needing attention | An event, such as a pressure warning. | [DCode Events](../DCode/Events.md) |
| Expose a reusable procedure to another caller | A callback. | [Callbacks](../DCode/Callbacks.md) |
| Coordinate several tasks | A task group. | [Task Groups](../DCode/Tasks.md#task-groups) |
| Generate similar work from a configuration list | A template driven by YAML parameters. | [Templates and Configuration](../DCode/Templates%20and%20Configuration.md) |

The linked guides provide syntax and working examples. Choose an example, add it to your project, and activate it when ready.

# Activation and Replacement

The Engine can keep running the last activated version while you edit. **Saving** stores the file; **activation** asks the Engine to use it. Choose **Run script** or press **Ctrl+R** to save and activate, then wait for the result.

The toolbar's execution mode selects **DCode · Lua** or native C++ execution. Start with Lua for the language examples; native execution requires [Builder setup](../DCode/Native%20C%2B%2B%20Execution.md).

![](_attachments/Pasted%20image%2020261030023254.png)

Check the loaded-code indicator and [gutter icons](#gutter-icons) after activation. A newly defined task may still need **Start** in [Tasks](Modules%20and%20Tasks.md#task-controls); loops start on activation.

Running again replaces the file's runtime definitions, including unchanged ones, and creates fresh runtime state. Tasks that were running can restart; they do not continue from their previous procedure position. Closing the editor does not stop the installed work. See [Activation and Replacement](../DCode/Runtime%20Blocks%20and%20Activation.md#activation-and-replacement) for each block's lifecycle and what remains afterward.

## Template Activation

A template can generate similar work for several devices using a YAML configuration file. Edit its parameters alongside the script. The YAML editor's **Run** saves the YAML and activates its dependent scripts, replacing their generated work too.

![A script and its YAML parameters with loaded-code indicators.](../DCode/_attachments/Pasted%20image%2020261026140141.png)

Follow [Templates and Configuration](../DCode/Templates%20and%20Configuration.md) for parameter files and generated declarations.

## Script and Activation Errors

Read the activation result before assuming the edited version is running. Follow reported file/line links and check the node's events and logs for execution failures. For native compilation errors, open **Project → Builder logs** and inspect **DARTWIC BUILDER** output.

Correct the problem, reactivate, and check the affected task and channels. See [Activation Errors and Limits](../DCode/Runtime%20Blocks%20and%20Activation.md#activation-errors-and-limits) for failure behavior, or [export logs](Events%20and%20Logs.md#export-logs) when sharing a diagnosis.
