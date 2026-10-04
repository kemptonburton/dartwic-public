---
updated: 2026-06-23
created: 2026-06-23
---

DCode is DARTWIC's scripting layer for easy runtime automation. It is meant for logic that uses channels already available in the engine.

Use DCode when you want to:

- read and write RAPID channels with pipe syntax
- create periodic tasks
- create state-machine tasks
- create calculated channels
- call runtime-provided helper functions
- show prompts, holds, messages, warnings, or aborts through ARGUS
- keep automation close to the engine without writing a C++ plugin

# DCode Versus Modules

| DCode | Module |
| --- | --- |
| Scripted automation using existing channels. | Custom C++ runtime lifecycle. |
| Best for task logic, state machines, calculations, and operator prompts. | Best for hardware drivers, protocol integrations, external data sources, and reusable engine services. |
| Lives in project scripts and is managed as DARTWIC scripting content. | Lives inside an engine plugin and is instantiated from module JSON. |
| Usually faster to write and easier to inspect. | More powerful when you need C++ APIs, long-lived connections, or custom SDK behavior. |

# Common DCode Shapes

| Shape | Use It For |
| --- | --- |
| `task_periodic` | Repeat logic at a target frequency. |
| `task_state_machine` | Sequence behavior through named states and transitions. |
| `channel_calculation` | Compute one channel from other channels. |
| helper modules | Share functions and constants across scripts. |

# Example

```dcode
task_periodic tasks/watch_pressure:
    task elapsed_seconds:
        if |plc/pressure.value| > |plc/pressure_high_limit.value|:
            warning("Pressure high", "The pressure channel crossed the configured limit.")
            |plc/pump_enable.value| = 0
```

This assumes another module, task, or client is already publishing `plc/pressure.value` and `plc/pressure_high_limit.value`.

# Read More

- [DCode Overview](../DCode/Overview.md)
- [DCode Tasks](../DCode/Tasks.md)
- [Writing Periodic Tasks](../DCode/Writing%20Periodic%20Tasks.md)
- [Building State Machines](../DCode/Building%20State%20Machines.md)
- [Channel Calculations](../DCode/Channel%20Calculations.md)
- [Events and ARGUS](Events%20and%20ARGUS.md)
