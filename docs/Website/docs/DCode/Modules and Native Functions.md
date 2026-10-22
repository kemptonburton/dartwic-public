---
summary: Share script helpers and call functions supplied by engine plugins.
updated: 2026-10-04T21:49
created: 2026-08-03T15:41
---

Import helper files to reuse DCode or Lua functions. Call a plugin's native DCode function when work needs the device access or C++ implementation supplied by that plugin.

Both backends import helper-only `.dcode` modules, including nested imports. The Lua backend also accepts `.lua` helpers; native C++ does not compile raw Lua. Plugin functions can be called from either backend with the same DCode arrays, objects and scalar values. [Native C++ Execution](Native%20C%2B%2B%20Execution.md) compiles imported DCode helpers into the artifact and reaches plugin functions through the engine host.

## Share a helper

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

Relative imports use the importing file's folder, including when one helper imports another; dotted imports map to folders inside `scripts`. Native C++ accepts `.dcode` helpers only. Helpers cannot declare runtime blocks or events. The filter's private value persists within its importing runtime; use per-task `state` when several tasks need independent filter histories.

## Call a TEMPEST operation

Pass the current engine's node name or a remote node name first, then the operation name and optional JSON-compatible argument object:

```dcode
result = tempest_operation("camera-node", "camera/capture", {exposure_ms: 20})
```

The editor suggests the current node and connected or remembered remote nodes, then the selected node's callable operations. In the argument object, it suggests fields from the operation descriptor and can insert all required fields. The current node dispatches its registered handler directly; remote nodes use the peer connection. A remote timeout means completion is unknown, so operations are not retried automatically. Handlers can block, and remote calls add network latency, so keep these calls outside fixed-rate control callbacks.

For a saved pinned operation on the current engine or a remote node, use its stable ID or a label that is unique on that node. Optional overrides replace saved argument fields for this call:

```dcode
result = tempest_pinned_operation("camera-node", "capture-standard", {exposure_ms: 15})
```

The editor suggests that node's saved pins. Engine plugins have [SDK_API::callTempest](../Plugins/Reference/Engine/Operations/SDK_API-callTempest.md) and [SDK_API::callPinnedTempest](../Plugins/Reference/Engine/Operations/SDK_API-callPinnedTempest.md) for local or remote operations; interface plugins can use [useRemoteTempest](../Plugins/Reference/Interface/Hooks%20and%20Utilities/useRemoteTempest.md) to list nodes, operations, and pins or call either form.

## Call a native function

An engine plugin can register functions with [SDK_API::registerDCodeFunction](../Plugins/Reference/Engine/DCode/SDK_API-registerDCodeFunction.md). The engine qualifies the function with the plugin ID. With the public example plugin installed and loaded, an executable body can call:

```dcode
result = example_device_plugin.test_value({ base: 40, offset: 2 })
|docs_demo_result| = result
```

The example function returns 42 by adding base and offset. A registration can declare one input and result schema for both DCode backends. The ordinary handler takes one JSON-compatible payload and returns one JSON-compatible result. Arrays, objects and null retain their kinds through that call. A single-output function can return a scalar; multiple outputs can use named object fields. The engine validates declared types, required fields, list lengths and nested fields at the call boundary.

A plugin can also register a typed prepared handler for native C++ DCode. The example plugin accepts three numeric samples and returns a dictionary with `sum` and `maximum`:

```dcode
local samples = [|sensor.one|, |sensor.two|, |sensor.three|]
local result = example_device_plugin.analyze_samples({samples: samples})
|sample_sum| = result.sum
|sample_maximum| = result.maximum
```

Native C++ prepares a retained binding and call-scoped value views for this fixed numeric shape; the plugin fills caller-owned result fields. The plugin must not retain input views or result writers after its handler returns. Native C++ lists keep their length and dictionaries keep their keys; Lua can resize its lists. An unsupported prepared shape fails activation with a diagnostic. The plugin's own allocations, locks, I/O and execution time still belong to the calling DCode path.

The call runs in the calling DCode execution path. A blocking native function also blocks that path, so avoid slow I/O inside channel calculations and event reactions. Use an [engine module or loop](../Plugins/Engine%20Plugin.md) to acquire data and publish channel values when the work needs independent scheduling.

## Expose a DCode callback

Use a [callback](Callbacks.md) declaration to expose an ordinary DCode function to schematic controls and other callers. It keeps ordinary function scope; activation registers it without executing its body.
