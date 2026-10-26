---
summary: Write readable automation with channels, scoped state, reusable logic, and YAML templates.
updated: 2026-10-26T14:16
created: 2026-08-03T15:41
---

DCode is DARTWIC's language for automation. A script can turn measurements into engineering values, control outputs, raise warnings, or run a test procedure. Save `.dcode` files in your project's `scripts` folder and activate them from the Interface.

![](_attachments/Pasted%20image%2020261026000728.png)

# Parts of a DCode script

A script combines declarations that tell the Engine what work exists with code that performs that work. The names below follow the type labels in the editor's documentation popup. Links open the relevant reference lists.

| Part                                                           | Purpose and examples                                                                                                                                                                  |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Runtime blocks](Reference/Runtime%20Blocks/Overview.md)       | Declare Engine-managed work, such as `task_periodic`, `loop`, or `event`.                                                                                                             |
| [Runtime sections](Reference/Runtime%20Sections/Overview.md)   | Organize a runtime block's handlers or configuration: `start:`, `task:`, `end:`, or `on_firing:`.                                                                                     |
| [Blocks](Reference/Blocks/Overview.md)                         | Group, choose, or repeat ordinary code: `if`, `for`, `while`, and `once`.                                                                                                             |
| [Statements](Reference/Statements/Overview.md)                 | Perform an action, such as `command`, `free`, or `transition`.                                                                                                                        |
| [Functions](Reference/DCode%20Functions/Overview.md)           | Call reusable work, such as `clamp(...)` or `wait_until(...)`, or helpers you define yourself. Standard functions are also listed under [Lua Base](Reference/Lua%20Base/Overview.md). |
| [Modules](Reference/Lua%20Base/Overview.md)                    | Group related functions and values, such as `math` and `string`. Each reference notes backend support.                                                                                |
| [Keywords](Reference/Lua%20Base/Overview.md)                   | Words with language-defined meaning, such as `and`, `not`, and `return`.                                                                                                              |
| [Syntax](Reference/Syntax/Overview.md)                         | Forms for expressions, channel pipes, comments, and indentation.                                                                                                                      |
| Variables                                                      | Values you name in your code, such as `limits` and `filling`, including function arguments.                                                                                           |
| [Context variables](Reference/Context%20Variables/Overview.md) | Values supplied by the Engine in particular handlers, such as `elapsed_seconds` or `current_state`.                                                                                   |
| [Directives](Reference/Directives/Overview.md)                 | Import helper code, load YAML parameters, or expand a `template(...)`.                                                                                                                |
| [Fields](Reference/Event%20Metadata/Overview.md)               | Named configuration entries, such as an event's `title:`, `type:`, and `channels:`. As of now only Events use fields.                                                                 |

These roles overlap: a keyword can introduce a block or statement. In the example below, `task_periodic` declares a runtime block, `start:` is a runtime section, `if` is a conditional block, and `command` writes an output under automation control.

# A small controller

This controller requests filling below 20, stops above 40, and remembers its decision between those limits. That gap avoids repeated switching near a threshold.

In a test project, create `docs_demo_pressure_a` and `docs_demo_pressure_b` at 30. The output is a demo channel with no hardware connection:

```dcode
limits = {low: 20, high: 40}

task_periodic docs_demo_fill:
    start:
        filling = 0

    task elapsed_seconds:
        global limits

        readings = [
            |docs_demo_pressure_a|,
            |docs_demo_pressure_b|
        ]
        pressure = math.max(readings[0], readings[1])

        if pressure < limits.low:
            filling = 1
        elif pressure > limits.high:
            filling = 0

        command |docs_demo_fill_request| = filling

    end:
        command |docs_demo_fill_request| = 0
        free |docs_demo_fill_request|
```

Activate the file and start **docs_demo_fill**. Set both inputs to 10: the request becomes 1. Return them to 30: it stays 1. Raise either to 45: it becomes 0. Stopping writes 0 and releases the task's claim. Operator manual control still takes precedence; [Channels and Control](../Engine/Channels%20and%20Control.md) explains write authority.

# Pick the right kind of block

DCode exposes its runtime actions in **Runtime Blocks**. These are statements in the script that create artifacts that the engine manages, such as a task or a channel calculation. Read more at [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md)

Below are some pages to take a first look at depending on what you want to do:

| You want to…                                      | Read                                                                  |
| ------------------------------------------------- | --------------------------------------------------------------------- |
| Derive a value when an input is written           | [Channel Calculations](Channel%20Calculations.md)                     |
| Report a condition or react to a limit            | [Events](Events.md)                                                   |
| Repeat work at a requested frequency              | [Tasks](Tasks.md#periodic-tasks)               |
| Organize behavior into named stages               | [Tasks](Tasks.md#state-machine-tasks)             |
| Run ordered steps and waits                       | [Tasks](Tasks.md#sequence-tasks) |
| Schedule actions around T0                        | [Scheduling Timelines](Scheduling%20Timelines.md)                     |
| Expose an action to a schematic or another caller | [Callbacks](Callbacks.md)                                             |

Activation installs the file's runtime definitions. Closing its editor does not stop them; reactivation replaces them and resets script state.

![](_attachments/Pasted%20image%2020261026135823.png)

Runtime blocks are marked by icons in the gutter, and their activation state is displayed in the menu bar, showing if they are loaded into memory or not. The icons will change color based on their state. Green indicates running, Grey indicates loaded but not running, and Yellow indicates stale/ not loaded.

When edits are made, the script will have to be re executed to rewrite what the engine has loaded in memory.

![](_attachments/Pasted%20image%2020261026140141.png)

In the photo above, the YAML that drives the templated loops has been changed, which requires the script to be ran again.
# Reuse the logic, configure the differences

Use [Values and Scope](Values%20and%20Scope.md) for variables, collections, and shared state. [Templates and Configuration](Templates%20and%20Configuration.md) creates several controllers from one definition and a YAML list; [Modules and Native Functions](Modules%20and%20Native%20Functions.md) covers helper files and plugin calls.

![](_attachments/Pasted%20image%2020261026000621.png)

Start with the default Lua backend. [Native C++ Execution](Native%20C%2B%2B%20Execution.md) explains compiled execution when you need it. Use the [language reference](Reference/Overview.md) to look up exact syntax and arguments.
