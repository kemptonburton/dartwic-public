---
updated: 2026-06-21T01:48
created: 2026-06-21
---

DCode can share helpers through imported `.lua` and `.dcode` files, and it can call native functions registered by the runtime.

# Export Helpers From DCode

Bare assignments and bare functions become visible on the imported module table. Use `local` for private helper values.

In `scripts/helpers/filter.dcode`:

```dcode
local previous = 0

gain = 0.2

function low_pass(value):
    previous = previous + ((value - previous) * gain)
    return previous

function reset(value):
    previous = value
```

`previous` stays private to `helpers/filter`. `gain`, `low_pass`, and `reset` are visible to scripts that import the module.

# Import Helpers

In `scripts/filter_demo.dcode`:

```dcode
import "./helpers/filter"

task_periodic tasks/filter_demo:
    start:
        filter.reset(|demo/raw.value|)

    task elapsed_seconds:
        |demo/filtered.value| = filter.low_pass(|demo/raw.value|)
```

Imports resolve inside the project's `scripts` directory. Relative imports use the current script's folder; dotted imports map to folders.

# Native DCode Functions

Native functions can be called by their dotted name when the runtime has registered them:

```dcode
local reading = example_device.test_value({ channel = "temperature" })
|demo/temperature.value| = reading
```

Native functions receive one JSON-like payload and return one JSON-like value. A single-output function should return the scalar value; a multi-output function should return an object with named fields.
