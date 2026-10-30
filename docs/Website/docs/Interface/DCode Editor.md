---
summary: Edit scripts, understand saved versus active code, and find runtime errors.
created: 2026-10-24
updated: 2026-10-29T18:28
---

**DCode** is DARTWIC's automation language. A script can convert a sensor reading into engineering units, control a tank fill, or run a test procedure. Open **Scripts** to write and apply that automation. This guide covers using the editor; the [DCode overview](../DCode/Overview.md) introduces the language and examples.

# Open and Edit a Script

Choose a saved script, or right-click the resource list and choose **Create Resource**. The toolbar's execution mode chooses how the Engine runs it: **DCode · Lua** interprets the script, while native execution compiles it into C++. Start with Lua for the language examples; native execution needs [Builder setup](../DCode/Native%20C%2B%2B%20Execution.md).

![The editor's loaded-code indicator and runtime-block gutter icons.](../DCode/_attachments/Pasted%20image%2020261026135823.png)

Use completion, hover help, and error markers while editing. Icons beside the line numbers open the work defined by that part of the script; source links elsewhere in the Interface bring you back to its definition. Check the save/synchronization state before leaving the file.

# Activation and Replacement

You can edit a controller while the Engine is still using the version you last activated. This gives you time to finish the changes before applying them. Activation is the step that asks the Engine to use the edited file.

Sections that define Engine-managed work, such as a task or calculation, are called **runtime blocks**. Activation makes their definitions available to the Engine; starting a task begins its procedure.

Use **Run script** or **Ctrl+R** to save and activate the file. Wait for the result, then inspect its runtime blocks. A task defined by the script may still need **Start** in [Tasks](Modules%20and%20Tasks.md#task-controls); loops start on activation.

Saving alone does not replace loaded behavior. Run activates the whole file, including unchanged declarations; [Activation and Replacement](../DCode/Runtime%20Blocks%20and%20Activation.md#activation-and-replacement) explains what is replaced and restarted.

## Template Activation

Several similar valves can share one script, with their names and settings listed in a **YAML** file, a text file holding configuration values. A **template** uses those entries to generate work for each valve. When you change the list, the Engine needs to activate the script again to update that generated work.

When a script uses YAML parameters, edit those alongside the script. The YAML editor's **Run** saves it and activates its dependent scripts.

![A script and its YAML parameters with loaded-code indicators.](../DCode/_attachments/Pasted%20image%2020261026140141.png)

See [Templates and Configuration](../DCode/Templates%20and%20Configuration.md) for parameter files and generated declarations.

# Script and Activation Errors

An error can occur while applying a script or later while its automation runs. The activation result tells you whether applying the file succeeded; events and logs help explain failures during execution. **Builder** is the tool that compiles native DCode, so its output is useful for compilation errors.

Read activation details and the node's events/logs, then follow reported file/line links. For native failures, open **Project → Builder logs** and inspect **DARTWIC BUILDER** output alongside the action result.

After correcting and reactivating the script, check the affected task and channels. Closing the editor does not stop runtime work. Export retained failure output through [recorded logs](Events%20and%20Logs.md#recorded-logs) when sharing a diagnosis.
