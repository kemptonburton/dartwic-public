---
summary: Share script helpers and call functions supplied by engine plugins.
updated: 2026-10-26T14:16
created: 2026-08-03T15:41
---

Helper files let several scripts reuse the same function. Native functions let a script call behavior supplied by an Engine plugin, such as a device operation or C++ calculation.

Both backends import helper-only `.dcode` files, including nested imports. Lua also accepts `.lua` helpers. Importing helpers and calling installed plugin functions are separate choices; use either when your script needs it.

# Share a helper

Create `scripts/helpers/filter.dcode` in the active project:

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

Bare functions and assignments are exported on the imported module table. `previous` stays private because it is local; `gain`, `low_pass`, and `reset` are public.

Create `scripts/filter_demo.dcode` beside the `helpers` directory:

```dcode
import "./helpers/filter"

task_periodic docs_demo_filter:
    start:
        filter.reset(|docs_demo_raw|)

    task elapsed_seconds:
        |docs_demo_filtered| = filter.low_pass(|docs_demo_raw|)
```

Relative imports use the importing file's folder, including when one helper imports another; dotted imports map to folders inside `scripts`. Native C++ accepts `.dcode` helpers only. Helpers cannot declare runtime blocks or events. The filter's private value persists within its importing runtime; keep independent filter histories in each task's ordinary variables and pass the previous value to a stateless helper when several tasks need separate filters.

# Call a TEMPEST operation

Pass the current engine's node name or a remote node name first, then the operation name and optional JSON-compatible argument object:

```dcode
result = tempest_operation("camera-node", "camera/capture", {exposure_ms: 20})
```

The editor suggests the current node and connected or remembered remote nodes, then the selected node's callable operations. In the argument object, it suggests fields from the operation descriptor and can insert all required fields. The current node dispatches its registered handler directly; remote nodes use the peer connection. A remote timeout means completion is unknown, so operations are not retried automatically. Handlers can block, and remote calls add network latency, so keep these calls outside fixed-rate control callbacks.

For a saved pinned operation on the current engine or a remote node, use its stable ID or a label that is unique on that node. Optional overrides replace saved argument fields for this call:

```dcode
result = tempest_pinned_operation("camera-node", "capture-standard", {exposure_ms: 15})
```

The editor suggests that node's saved pins. A pin must have a stable ID or a label unique on that node.

# Call a native function

With the public example plugin installed and loaded, an executable body can call:

```dcode
result = example_device_plugin.test_value({ base: 40, offset: 2 })
|docs_demo_result| = result
```

This function returns 42 by adding base and offset. Plugin functions are qualified by plugin ID and can receive and return JSON-compatible values, including arrays, objects, and null. Declared schemas are checked at the call boundary; use the installed plugin's documented arguments.

For example, its sample-analysis function returns named outputs:

```dcode
local samples = [|sensor.one|, |sensor.two|, |sensor.three|]
local result = example_device_plugin.analyze_samples({samples: samples})
|sample_sum| = result.sum
|sample_maximum| = result.maximum
```

The plugin can supply a typed prepared handler for this fixed numeric shape in Native C++. Unsupported prepared shapes fail activation with diagnostics. Native arrays keep their length and objects their keys; Lua can resize arrays.

The call runs on the calling DCode path. The plugin's allocation, locking, I/O, and execution time add to it. Keep slow functions out of calculations and event reactions; use an [Engine module or loop](../Plugins/Engine%20Plugin.md) when acquisition needs independent scheduling. [Native C++ Execution](Native%20C%2B%2B%20Execution.md) explains prepared bindings.

# Expose a DCode callback

Use a [callback](Callbacks.md) declaration to expose an ordinary DCode function to schematic controls and other callers. It keeps ordinary function scope; activation registers it without executing its body.

# Reference

- [Import directive](Reference/Directives/directive-import.md) — Paths, exports, and helper restrictions.
- [DCode functions](Reference/DCode%20Functions/Overview.md) — Host calls and their backend behavior.
- [Plugin function registration](../Plugins/Reference/Engine/DCode/SDK_API-registerDCodeFunction.md) — Schemas and prepared-handler ownership for plugin authors.
