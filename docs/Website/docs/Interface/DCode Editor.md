---
summary: Edit scripts, understand saved versus active code, and find runtime errors.
created: 2026-10-24
updated: 2026-10-26T00:08
---

Open **Scripts** to edit a project's DCode files. The editor connects source code to the tasks, calculations, events, and callbacks it creates. For the language itself, start with the [DCode overview](../DCode/Overview.md).

# Open and edit a script

Choose a script from the resource list or follow a source link from Tasks, Channels, or an event. Source links can jump to the declaration line.

The editor provides completion, hover documentation, and error markers. Use the channel references and runtime markers to inspect related signals or open the resulting runtime view. Check the resource's save/synchronization state when working from several Interfaces.

# Save, activate, and run

| Action | What changes |
| --- | --- |
| Edit and save | The project's source file. Loaded runtime behavior can still be from the previous activation. |
| Run script / Ctrl+R | Saves the current script, then asks the Engine to activate it. |
| Start a declared task | Begins that task's execution through its runtime controls. |
| Change execution mode | Selects the backend used for the next activation. |

Run can execute top-level code and register or reconfigure runtime declarations. A task declaration does not imply that every task starts immediately; script logic and startup controls determine that. Inspect the action result and runtime state before assuming new behavior is running.

For YAML template parameters, Run saves the YAML and activates its dependent scripts. Review which scripts are affected. [Templates and Configuration](../DCode/Templates%20and%20Configuration.md) explains this relationship.

# Find an error

Fix reported DCode errors before activation. Checking code helps find problems; activation can still fail during configuration, native compilation, or dependency binding.

Read the activation detail and its **DARTWIC BUILDER** output. Follow file and line locations back to the source. The editor's loaded-code and binding indicators help distinguish the file you are editing from what is loaded in Engine memory.

| Problem | Next check |
| --- | --- |
| Edited code has no effect | Save/activation result and loaded-code state. |
| Task exists but does not execute | Running/held state in [Modules and Tasks](Modules%20and%20Tasks.md). |
| Native activation fails | Compiler output, toolchain, and reported bindings. |
| Output write is rejected | [Channel authority](../Engine/Channels%20and%20Control.md#policies). |

Saving or closing an editor does not stop existing runtime work. Use its task controls when changing execution. For activation and replacement semantics, see [Runtime Blocks and Activation](../DCode/Runtime%20Blocks%20and%20Activation.md); for native setup, see [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md).
