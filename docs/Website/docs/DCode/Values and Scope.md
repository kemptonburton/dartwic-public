---
summary: Shared DCode arrays, objects, expressions, JSON and variable lifetime.
updated: 2026-10-26T14:17
created: 2026-09-29T02:39
---

DCode values hold your script's working data: numbers, strings, booleans, `null`, arrays, and objects. **Scope** determines which code can use a variable; **lifetime** determines how long its value is kept.

Both Lua and Native C++ use the same basic syntax. Channel values remain numeric; keep structured intermediate data in script variables.

# Variables and lifetime

A variable **assigned inside a runtime block belongs to that block**. `if`, `for`, `while`, and `do` do not create a separate variable scope.

Task variables persist across lifecycle sections and iterations within one run:

```dcode
task_periodic docs_demo_counter:
    start:
        count = 0

    task elapsed_seconds:
        count = count + 1
        |docs_demo_count| = count
```

`start:` initializes `count`; the task increments it on each iteration. Starting another run recreates the task's variables.

The table below describes the lifetime of variables that have their own scope. As stated above, variables have scope within File globals (global variables), functions, and runtime blocks.

| Owner                                     | Working-state lifetime                                                           |
| ----------------------------------------- | -------------------------------------------------------------------------------- |
| Periodic, state-machine, or sequence task | One run, shared across its lifecycle sections.                                   |
| Loop or channel calculation               | Between invocations until the file is reactivated.                               |
| Callback or ordinary function             | Its own function scope; callbacks get fresh working variables per call.          |
| File globals                              | Shared by that file's blocks until reactivation, including across task restarts. |

# Use arrays and objects

Arrays hold ordered items; objects give related fields names. Collections can nest, and array indexing starts at zero:

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

`sample.limits` and `sample["limits"]` access the same member. Missing keys and out-of-range indexes raise errors; explicit `null` is a stored value, distinct from an uninitialized name. Object keys can be identifiers or quoted strings.

Collections are mutable references within a runtime block. Use `copy(value)` for an independent deep copy; cyclic collections are rejected. In Lua, `sample.limits.push(25)` appends and returns the new length, while `pop()` removes and returns the last item and fails on an empty array.

Native C++ keeps array lengths and object keys fixed. You can replace existing items/fields or assign a newly constructed collection; resizing and adding keys require Lua. Keep collection length unchanged during native iteration.

`for item in array:` visits values, and `for key in object:` visits keys in insertion order. Helpers such as `len`, `keys`, `values`, `items`, `has`, `lookup`, and `copy` cover common operations. `keys`, `values`, and `items` preserve object order.

# Read JSON

Use JSON when exchanging structured values with a helper or plugin:

```dcode
settings = json.parse('{"gain":2,"stages":[1,3]}')
if has(settings, "gain"):
    output = settings.gain * settings.stages[0]
```

`json.parse` reads JSON into DCode values; `json.stringify` produces JSON text. Plugin calls preserve nested arrays, objects, empty collections, and null.

# Share data deliberately

Assignments before runtime block or function declarations create file globals. A block or function declares `global name` before accessing outer data:

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

A bare assignment declares or updates a name in its current scope. An inner name cannot shadow an outer name; choose another name or declare `global`. Imported and registered functions can be called without `global`.

File globals reset on activation. Reads and replacements are synchronized, but compound changes such as `count = count + 1` can lose another callback's update. Use a RAPID channel or explicit coordination for concurrent control state. Native access to file globals uses the host bridge and adds work to a control path.

For portable collection changes, mutate through the file-global name:

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

If you first copy a nested member into a block variable and mutate it there, assign it back to publish the change in both backends. Imported helpers have their own module state; [Modules and Native Functions](Modules%20and%20Native%20Functions.md) explains that ownership.

# Conditions and operators

Truthiness is shared: `false`, `null`, `0`, `""`, `[]` and `{}` are false; other values are true. `and` and `or` short-circuit and return the selected operand. `/` performs floating division, `//` floors division, `%` uses divisor-signed remainder, and `**` or `^` exponentiates. `nil` remains a compatibility spelling for `null`; use `null` in new scripts.

[Common Syntax and Functions](Common%20Syntax%20and%20Functions.md) shows these conditions inside branches, iteration, one-time actions, and waits.

# Configuration values

YAML templates expand before compilation. Numeric values can be inserted in expressions; arrays and objects become DCode collections, and YAML null becomes `null`. String fields are inserted as text, so quote a placeholder when it is part of a DCode string. See [Templates and Configuration](Templates%20and%20Configuration.md).

In Lua, a file-scope pipe write can configure channel value labels at activation:

```dcode
|rocket_sim_phase|:value_options = [
    {value: 0, label: "idle"},
    {value: 1, label: "tank fill"},
    {value: 2, label: "ignition"},
    {value: 3, label: "firing"}
]
```

Each option needs a unique finite numeric value and a nonempty label. Metadata pipe writes such as `value_options` require Lua.

# Reference

- [Expressions and values](Reference/Syntax/syntax-lua_expressions.md) — Operators, collections, and truthiness.
- [Global variables](Reference/Syntax/syntax-global.md) — Access to outer scope.
- [DCode functions](Reference/DCode%20Functions/Overview.md) — Collection, copy, and JSON helpers.
- [Runtime blocks](Reference/Runtime%20Blocks/Overview.md) — Working-state ownership and lifecycle.
