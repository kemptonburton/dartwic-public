---
summary: Shared DCode arrays, objects, expressions, JSON and variable lifetime.
updated: 2026-10-22T17:41
created: 2026-09-29T02:39
---

DCode has the same collection syntax in the Lua and Native C++ backends. Use `[]` for an ordered array and `{}` for an object with string keys. You can nest either inside the other:

```dcode
sample = {
    label: "tank A",
    limits: [10, 20, null],
    metadata: {enabled: true}
}
sample.limits[0] = 12
first = sample.limits[0]
enabled = sample["metadata"].enabled
```

In Lua mode, a file-scope pipe write can configure channel value labels when the script activates. `value_options` takes an array of objects with unique finite numeric values and nonempty text labels:

```dcode
|rocket_sim_phase|:value_options = [
    {value: 0, label: "idle"},
    {value: 1, label: "tank fill"},
    {value: 2, label: "ignition"},
    {value: 3, label: "firing"}
]
```

Array indexes start at **zero**. Reading an absent object key or an out-of-range array index raises an error. `null` is a value and survives collection storage and JSON conversion; an uninitialized variable or missing key is different. Object keys are identifier names or quoted strings. `sample.limits` and `sample["limits"]` read the same member. Arrays and objects are mutable references within a runtime block. Use `copy(value)` for an independent deep copy. Cyclic collections are rejected.

Native C++ keeps each array's length and object's keys fixed: replace existing items or fields, or assign a newly constructed collection. Lua additionally supports adding object keys and resizing arrays. In Lua, `sample.limits.push(25)` appends and returns the new length; `pop()` removes and returns the final item, and fails for an empty array. Those methods are rejected by Native C++.

The collection helpers are `len(value)`, `keys(object)`, `values(object)`, `items(object)`, `has(object, key)`, `lookup(object, key, fallback)` and `copy(value)`. `keys`, `values` and `items` preserve object insertion order. `json.parse(text)` returns DCode values; `json.stringify(value)` produces JSON text. A registered plugin function receives and returns these values through JSON, including nested arrays, empty arrays, empty objects and null. A fixed RAPID channel value remains numeric; store structured intermediate data in DCode memory.

```dcode
settings = json.parse('{"gain":2,"stages":[1,3]}')
if has(settings, "gain"):
    output = settings.gain * settings.stages[0]
```

## Variables and lifetime

`for item in array:` visits array values in order. `for key in object:` visits object keys in insertion order. The collection length must stay unchanged during native iteration. Numeric `for` remains available. `if`, `for`, `while` and `do` do not introduce a DCode variable scope. Names assigned in a runtime block persist across its `start:`, `task:`, `missed:`, `end:` and other lifecycle sections; initialize a name before reading it. `local` may still be written but is unnecessary for an ordinary assignment.

A `loop` has no `start:` section, so use `once when true:` to initialize a variable on the first iteration before reading it. For example, `last_value = null` makes a later comparison with a channel value well-defined.

| Owner | Working-state lifetime |
| --- | --- |
| Periodic, state-machine, or sequence task | Shared across lifecycle sections during one run; recreated at the next start. Initialize in `start:` or before the first read. |
| Loop or channel calculation | Retained between invocations until the file is reactivated. |
| Callback | A fresh function scope for each call. |
| File globals | Shared by that file's blocks until reactivation, including across task restarts. |

Timeline reset/replay has its own clock and bucket recovery rules; see [Sequences and Task Lifecycle](Sequences%20and%20Task%20Lifecycle.md#schedule-a-timeline).

Assignments in a file prelude create file globals shared by every runtime block in that file. `local` remains an optional spelling there; it does not turn the value into a separate copy per block. A runtime block has its own variables, and each explicit function has its own scope. Declare `global name` before reading or writing a file global from a runtime block or outer data from a function. A bare assignment declares or updates a name in the current scope. An inner name cannot shadow an outer name; choose another name or declare `global`. Imported and registered functions can be called without `global`.

```dcode
gain = 2

function scale(input):
    global gain
    adjusted = input * gain
    return adjusted

channel_calculation scaled_pressure:
    global gain
    return scale(|pressure|)
```

The file-global store belongs to one `.dcode` file and resets when that file is activated again. Scalars and nested arrays/objects are available to all of its runtime blocks in Lua and Native C++. Individual store reads and replacements are synchronized. A compound expression such as `count = count + 1`, or a collection read followed by mutation, can lose another callback's concurrent update. Use a RAPID channel or another explicit coordination mechanism for concurrent control state. Native access to file globals uses the host bridge, so keep repeated global reads and writes out of a fixed-rate control loop when the prepared fixed-channel path matters. Imported helper modules keep their own module state. Both backends import helper-only `.dcode` modules; `.lua` helpers require Lua. [Modules and Native Functions](Modules%20and%20Native%20Functions.md) describes the import behavior.

For portable collection updates, mutate an existing member through the file-global name, such as `record.items[0] = value`. If you copy a nested member into a block variable and mutate that variable, assign it back to the file global to publish the change in both backends. The following example keeps a single shared sample without resizing:

```dcode
sample = {latest: 0}

channel_calculation sample_input:
    global sample
    sample.latest = value
    return value

channel_calculation sample_output:
    global sample
    return sample.latest
```

## Conditions and operators

Truthiness is shared: `false`, `null`, `0`, `""`, `[]` and `{}` are false; other values are true. `and` and `or` short-circuit and return the selected operand. `/` performs floating division, `//` floors division, `%` uses divisor-signed remainder, and `**` or `^` exponentiates. `nil` remains a compatibility spelling for `null`; use `null` in new scripts.

## Configuration values

YAML templates expand before backend compilation. A YAML array or object field becomes a DCode collection literal, and a YAML null becomes `null`. A plain string field is inserted as text for names and identifiers. When inserting a string as a DCode expression, place quotes around its placeholder in the template.

See [Templates and Configuration](Templates%20and%20Configuration.md) to create reusable controllers and warnings from YAML.
