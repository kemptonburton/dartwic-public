---
summary: Share script helpers and call functions supplied by engine plugins.
updated: 2026-10-27T05:04
created: 2026-08-03T15:41
---

DCode can reuse functions from helper files, call functions supplied by Engine plugins, and send operation requests to local or remote Engines.

# Helper Modules

A helper module groups reusable functions in a separate file. Import one to share the same filtering, conversions, or other script logic across several files.

Both backends import helper-only `.dcode` files, including nested imports. Lua also supports `.lua` helpers. Helpers cannot declare runtime blocks or events; use [Callbacks](Callbacks.md) to expose a function to schematic controls or external callers.

## Share a helper

This helper smooths an input by remembering its previous filtered value. Create `scripts/helpers/filter.dcode` in the active project:

```dcode
local previous = 0

gain = 0.2

function low_pass(value):
    global previous, gain
    previous = previous + ((value - previous) * gain)
    return previous

function reset(value):
    global previous
    previous = value
```

Bare functions and assignments are exported on the module. `previous` stays private because it is local; `gain`, `low_pass`, and `reset` are public.

Create `scripts/filter_demo.dcode` beside the `helpers` directory:

```dcode
import "./helpers/filter"

task_periodic docs_demo_filter:
    start:
        filter.reset(|docs_demo_raw|)

    task elapsed_seconds:
        |docs_demo_filtered| = filter.low_pass(|docs_demo_raw|)
```

Create the demo input channel before activating and starting the task. The output follows a smoothed input. Relative imports resolve from the importing file, including nested imports; dotted names map to folders inside `scripts`.

## Module Scope and Lifecycle

Helper functions use normal [function scope](Values%20and%20Scope.md#variable-scopes): arguments and working variables belong to each call. Module-level variables, such as `previous`, persist within the importing runtime.

Helpers use the caller's authority and have no separate runtime registration. The caller's stop/removal lifecycle handles its [channel cleanup](../Engine/Channels%20and%20Control.md#stop). Reactivate the importing file to apply helper edits; [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) covers replacement.

# Native Functions

A [native function](../Plugins/Reference/Engine/DCode/Overview.md) lets DCode call C++ code supplied by an Engine plugin. Use one for a device command, calculation, or library function that the plugin provides. These calls work from both Lua and Native C++ DCode.

Install and load the supplying plugin first. Call its functions as `plugin_id.function_name(...)`, using the arguments documented by that plugin.

## Call a native function

The public example plugin includes a function that adds two numbers. With that plugin loaded, call it from an executable body:

```dcode
result = example_device_plugin.test_value({ base: 40, offset: 2 })
|docs_demo_result| = result
```

This returns 42. Arguments and results support JSON-compatible values, including arrays, objects, and null; schemas are checked at the call boundary.

For several readings, `analyze_samples` returns their sum and maximum as named fields:

```dcode
local samples = [|sensor.one|, |sensor.two|, |sensor.three|]
local result = example_device_plugin.analyze_samples({samples: samples})
|sample_sum| = result.sum
|sample_maximum| = result.maximum
```

## Native Function Execution

Calls run **synchronously**: the calling DCode waits for the handler to return. Allocation, locking, I/O, and computation add to that duration. Keep slow functions out of calculations and event reactions; use an [Engine module or loop](../Plugins/Engine%20Plugin.md) for independently scheduled acquisition.

For Native C++, a plugin can supply a **prepared handler**: a version of the function with known argument and result types for compiled calls. Calls with unsupported argument or result types fail activation; Native arrays retain their length and objects their keys. See [Native C++ Execution](Native%20C%2B%2B%20Execution.md) for prepared bindings.

# TEMPEST Operations

A [TEMPEST operation](Reference/DCode%20Functions/function-tempest_operation.md) is a named request handled by an Engine, such as asking a camera node to capture an image. Use it to request an action on the current Engine or another connected node.

A list of TEMPEST Operations can be viewed by clicking on the node in the Network Map, and opening up the Network Details in the Node Board.

![](_attachments/telemetry-nodes-good-ui-usage.png)

DCode waits synchronously for the response. Handlers can block, and remote calls add network latency, so keep slow operations outside fixed-rate control callbacks.

## Call a TEMPEST operation

Pass the node name, operation name, and optional argument object:

```dcode
result = tempest_operation("camera-node", "camera/capture", {exposure_ms: 20})
```

The editor suggests nodes, their operations, and described argument fields. Local operations dispatch directly; remote operations use the peer connection. A remote timeout leaves completion unknown, so calls are not retried automatically.

## Pinned Operations

A [pinned operation](Reference/DCode%20Functions/function-tempest_pinned_operation.md) saves an operation and its arguments on a node so you can reuse the configured call. Select it by its stable ID or a label unique on that node; optional overrides replace saved arguments for this call:

```dcode
result = tempest_pinned_operation("camera-node", "capture-standard", {exposure_ms: 15})
```

The editor suggests the selected node's saved pins.

# Reference

- [Import directive](Reference/Directives/directive-import.md) — Paths, exports, and helper restrictions.
- [DCode functions](Reference/DCode%20Functions/Overview.md) — Host calls and their backend behavior.
- [Plugin function registration](../Plugins/Reference/Engine/DCode/SDK_API-registerDCodeFunction.md) — Schemas and prepared-handler ownership for plugin authors.
