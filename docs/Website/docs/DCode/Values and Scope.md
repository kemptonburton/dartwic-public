---
summary: DCode variables, scopes, value lifetime, collections, and JSON.
updated: 2026-10-27T00:41
created: 2026-09-29T02:39
---

DCode values hold your script's working data: numbers, strings, booleans, `null`, arrays, and objects. **Scope** determines which code can use a variable; **lifetime** determines how long its value is kept.

Both Lua and Native C++ use the same basic syntax. Channel values remain numeric; keep structured intermediate data in script variables.

# Values

## Variables

A variable gives a name to a value so your script can use or change it later. Assign it with `=`:

```dcode
target_pressure = 20
target_pressure = target_pressure + 5
```

`target_pressure` now holds 25. A bare assignment creates or updates a variable in the current scope. You can also write `local target_pressure = 20`; `local` is optional for ordinary variables. Initialize a variable before reading it.

## Arrays and objects

An **array** stores an ordered list of values, accessed by index starting at zero, such as `sample.limits[0]`. An **object** stores named fields, accessed by name, such as `sample.label` or `sample["label"]`.

**Collection** is the general term for an array or an object, rather than a separate value type. Both can contain other arrays or objects.

The examples below use this object. Put the snippets in the same runtime block or function so they can access `sample`:

```dcode
sample = {
    label: "tank A",
    limits: [10, 20, null],
    metadata: {enabled: true}
}
```

### Read values

Use brackets for an array index and either dots or brackets for an object field:

```dcode
first = sample.limits[0]
enabled = sample["metadata"].enabled
```

`first` is 10 and `enabled` is true. `sample.limits` and `sample["limits"]` access the same field. Object keys can be identifiers or quoted strings; bracket access also accepts a variable containing the key.

Missing keys and out-of-range indexes raise errors. Use `has` to check for a key or `lookup` to supply a fallback:

| Operation | Example | Result |
| --- | --- | --- |
| Count array items or object fields | `len(sample.limits)` | `3`, including the `null` item. |
| Check for an object key | `has(sample.metadata, "enabled")` | `true`. |
| Read a key with a fallback | `lookup(sample.metadata, "units", "bar")` | `"bar"`, because `units` is absent. |

`null` is a stored value, distinct from a missing key or an uninitialized variable. `has` returns true for a key whose value is `null`; `lookup` returns that `null` rather than the fallback.

### Change values

**Mutation** means changing an existing array or object:

```dcode
sample.limits[0] = 12
sample.metadata.enabled = false
```

The first limit is now 12, and `enabled` is false. Both backends support replacing existing items and fields. You can also assign a newly constructed array or object to a variable.

Native C++ keeps array lengths and object keys fixed. Keep the collection's length unchanged during native iteration.

### Add and remove items

In **Lua**, `push` adds an item to the end of an array, and `pop` removes its last item:

```dcode
new_length = sample.limits.push(25)
last = sample.limits.pop()
sample.metadata.units = "bar"
```

`new_length` is 4, `last` is 25, and the array is back to three items. `pop()` raises an error on an empty array. Assigning `units` adds a new object field. These resizing and field-addition operations require Lua.

Assigning `null` to a field keeps the field present; it does not delete it.

### Share or copy

Within one runtime block, assigning an array or object to another variable shares the same mutable value. Use `copy` for an independent deep copy, including nested arrays and objects:

```dcode
shared = sample
shared.label = "tank B"

independent = copy(sample)
independent.limits[0] = 99
```

`sample.label` is now `"tank B"`. Changing `independent.limits[0]` leaves `sample.limits[0]` unchanged. Collections cannot contain themselves, directly or through another collection; cyclic references raise an error. Sharing file-global collections has additional rules under [Access outer variables](#access-outer-variables).

### Iterate over values and fields

`for item in array:` visits array values. `for key in object:` visits object keys in insertion order. For example, add the numeric limits while skipping `null`:

```dcode
total = 0
for limit in sample.limits:
    if limit != null:
        total = total + limit
```

After the changes above, `total` is 32. To work with an object's fields, these helpers return arrays in insertion order:

| Helper | Returns |
| --- | --- |
| `keys(object)` | The field names. |
| `values(object)` | The field values. |
| `items(object)` | A `[key, value]` pair for each field; access each pair with `[0]` and `[1]`. |

[Common Syntax and Functions](Common%20Syntax%20and%20Functions.md#for-loops) covers the loop syntax. The [function reference](Reference/DCode%20Functions/Overview.md) gives the complete helper definitions.

## Read JSON

Use JSON when exchanging structured values with a helper or plugin:

```dcode
settings = json.parse('{"gain":2,"stages":[1,3]}')
if has(settings, "gain"):
    output = settings.gain * settings.stages[0]
```

`json.parse` reads JSON into DCode values; `json.stringify` produces JSON text. Plugin calls preserve nested arrays, objects, empty collections, and null.

## Conditions and operators

Truthiness is shared: `false`, `null`, `0`, `""`, `[]` and `{}` are false; other values are true. `and` and `or` short-circuit and return the selected operand. `/` performs floating division, `//` floors division, `%` uses divisor-signed remainder, and `**` or `^` exponentiates. `nil` remains a compatibility spelling for `null`; use `null` in new scripts.

[Common Syntax and Functions](Common%20Syntax%20and%20Functions.md) shows these conditions inside branches, iteration, one-time actions, and waits.

## Values from templates

Templates let you keep settings such as names, gains, and limits in YAML instead of repeating them in each DCode definition. A placeholder such as `{params.gain}` is replaced with the configured value before compilation. The result is an ordinary DCode value.

For example, a row in your template's YAML list might contain:

```yaml
- name: tank A
  gain: 2
  limits: [10, 20]
```

Inside a `template(params)` body using that row, these assignment excerpts insert its values:

```dcode
label = "{params.name}"
gain = {params.gain}
limits = {params.limits}
```

The expanded code assigns `"tank A"`, `2`, and `[10, 20]`. Strings are inserted as text, so the quotes around `"{params.name}"` make the result a DCode string. Numbers and booleans can go directly into expressions; YAML arrays and objects become DCode arrays and objects, and YAML null becomes `null`.

Edit the YAML and reactivate the consuming DCode file to apply changes. These are substitutions during activation, rather than live reads of the YAML. [Templates and Configuration](Templates%20and%20Configuration.md) shows how to load the file, select its rows, and create the template.

## Channel value labels

A channel's `value_options` metadata pairs numeric values with display labels. In Lua, put this pipe write at file scope to configure the labels when the file activates:

```dcode
|rocket_sim_phase|:value_options = [
    {value: 0, label: "idle"},
    {value: 1, label: "tank fill"},
    {value: 2, label: "ignition"},
    {value: 3, label: "firing"}
]
```

Each option needs a unique finite numeric value and a nonempty label. The channel still stores a number; these labels describe its choices. Metadata pipe writes such as `value_options` require Lua. See [Channels and Control](../Engine/Channels%20and%20Control.md) for channel fields and control behavior.

# Scope

A scope determines which code can access a variable. 

For example, in a `.dcode` file:

```dcode
function double(input):
    doubled = input * 2
    return doubled

answer = double(3)
```

`input` and `doubled` belong to the function's scope. Code outside the function cannot read them directly; `answer` receives the returned value, 6.

## Variable Scopes

DCode has three variable scopes:

| Scope                | Where the variable belongs                                               | How long its value is kept                                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| File                 | Outside runtime blocks and functions; shared with them through `global`. | Until the file is reactivated, including across task restarts.                                                                                              |
| Runtime block        | One task, loop, or calculation, shared across its lifecycle sections.    | Tasks keep variables across iterations and holds, but recreate them at each start. Loops and calculations keep variables until their definition is rebuilt. |
| Function or callback | Its parameters and working variables.                                    | One call; concurrent calls have separate working variables.                                                                                                 |

Non Runtime Blocks, such as `if`, `for`, `while`, and `do`, do not create another variable scope. A variable assigned inside one of these stays in its surrounding file, runtime block, or function scope. A function declared inside a runtime block still has its own function scope.

For example, put this task in a project `.dcode` file:

```dcode
task_periodic docs_demo_counter:
    start:
        count = 0

    task elapsed_seconds:
        count = count + 1
        |docs_demo_count| = count
```

`start:` sets `count` to 0 once when the task starts. Successive iterations then set it to 1, 2, 3, and so on. Holding and resuming keeps the count. Stopping the task and starting it again runs `start:` again, so the count begins from 0. A task run includes all those iterations and lifecycle sections; it is not a single iteration.

A loop also keeps its variables between iterations. A channel calculation keeps them between recalculations, such as those triggered by input updates. Each execution uses the existing working variables; assignments in its body can still overwrite their values.

Pressing **Run** on the DCode file reactivates it and rebuilds its definitions, even unchanged ones. Loops and calculations then get fresh working variables; surviving running tasks restart with fresh variables too. Replacing or removing a definition also discards its old working state. See [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) for replacement behavior.

## Access outer variables

Assigning a variable at file scope makes it a file global. Declare `global name` inside a runtime block or function before reading or changing that outer variable:

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

An inner variable cannot reuse an outer variable's name (shadowing); choose another name or declare `global` to use the existing variable. Functions, imports, and registered plugin functions can be called without `global`.

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

# Reference

- [Expressions and values](Reference/Syntax/syntax-lua_expressions.md) — Operators, collections, and truthiness.
- [Global variables](Reference/Statements/syntax-global.md) — Access to outer scope.
- [DCode functions](Reference/DCode%20Functions/Overview.md) — Collection, copy, and JSON helpers.
- [Runtime blocks](Reference/Runtime%20Blocks/Overview.md) — Working-state ownership and lifecycle.
