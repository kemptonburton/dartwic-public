---
summary: Write readable automation with channels, scoped state, reusable logic, and YAML templates.
updated: 2026-10-22T17:38
created: 2026-08-03T15:41
---

DCode is the language you use to connect live signals to decisions in DARTWIC. A script can turn a sensor reading into an engineering value, control a valve, raise a warning, or run a test sequence. You write `.dcode` files in your project's `scripts` folder and activate them from the Interface.

The useful pieces of a script are usually small: read the inputs, decide what should happen, and make the output and its cleanup clear.

## A small controller

This example requests filling when both pressure readings are below 20, stops filling when either exceeds 40, and keeps its previous decision between those limits. That gap prevents the request from switching repeatedly near one threshold.

Try it in a test project: create `docs_demo_pressure_a` and `docs_demo_pressure_b`, both at 30. The output is a demonstration channel; it is not connected to hardware. Save this as `fill_demo.dcode`:

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

Activate the file, then start **docs_demo_fill** in Tasks. Set both inputs to 10: the request becomes 1. Return both to 30: it stays 1. Raise either input to 45: it becomes 0. Stop the task when finished; its `end:` section writes 0 and releases its claim. [Getting Started](Getting%20Started.md) walks through activation and task controls.

A few choices make this easy to follow:

- **Channels are the connection to the engine.** `|docs_demo_pressure_a|` reads a channel; `command` writes an output while taking automatic control. Operator manual control still takes precedence. [Commanding and Control](../Engine/Commanding%20and%20Control.md) explains assignment, `command`, `override`, `set`, and `free`.
- **Objects name related settings; arrays hold ordered values.** `limits.low` reads an object field, and `readings[0]` reads the first array element. Arrays start at zero. Both can contain nested data. [Values and Scope](Values%20and%20Scope.md) covers collection helpers, copying, and JSON.
- **Keep state with the logic that owns it.** `limits` belongs to the file, so the task declares `global limits` before using it. `readings` and `pressure` belong to this task and are reassigned each iteration. `filling` remembers the decision between iterations and is initialized in `start:`. Task variables persist across lifecycle sections and iterations; an `if` or `for` does not create a new scope. Neither a `state.` prefix nor `local` is needed. See [Values and Scope](Values%20and%20Scope.md#variables-and-lifetime).

## Reuse the logic, configure the differences

When several sensors or devices follow the same rules, a template lets you keep one definition and put their names and settings in YAML. For example, save this as `scaling.yaml` beside `scaling.dcode`:

```yaml
sensors:
  - name: pressure_a
    input: docs_demo_pressure_a
    gain: 2
  - name: pressure_b
    input: docs_demo_pressure_b
    gain: 3
```

Then put this in `scaling.dcode`:

```dcode
params = yaml "./scaling.yaml#sensors"

template(params) channel_calculation docs_scaled_{params.name}:
    return |{params.input}| * {params.gain}
```

Activation expands the two YAML rows into two calculations. With both input channels at 10, `docs_scaled_pressure_a` becomes 20 and `docs_scaled_pressure_b` becomes 30. Change an input to see its calculated output update.

Edit the YAML and reactivate the consuming script to apply new settings. [Templates and Configuration](Templates%20and%20Configuration.md) continues with valve controllers and warnings. Use [Modules and Native Functions](Modules%20and%20Native%20Functions.md) when you want to share helper functions between files.

## Pick the right kind of block

The controller above is a [periodic task](Writing%20Periodic%20Tasks.md): it reads pressure when its scheduled iteration runs. The template creates [channel calculations](Channel%20Calculations.md), which run in response to their input updates. Choose the block that matches the job:

- [Events](Events.md) expose maintained conditions and one-shot reports as messages, warnings, errors, or abort events. Separate prompt functions wait for operator input.
- [State machines](Building%20State%20Machines.md) give a process named stages, such as filling, venting, and complete.
- [Sequences and timelines](Sequences%20and%20Task%20Lifecycle.md) organize ordered steps, waits, and actions at test times.
- [Callbacks](Callbacks.md) expose actions that a schematic, client, or another script can call.

Activating a file installs its runtime definitions; closing the editor does not stop them. Reactivating replaces them and resets their script state. Read [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) before changing an active procedure.

Lua is the default backend. Start with it, then read [Native C++ Execution](Native%20C%2B%2B%20Execution.md) if you need compiled execution and prepared fixed-channel access. The [language reference](Reference/Overview.md) is the place to look up exact syntax and function arguments.
