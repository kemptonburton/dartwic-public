---
summary: Common DCode syntax, control-flow blocks, and functions, with practical examples.
created: 2026-10-26
updated: 2026-10-27T02:13
---

Common DCode syntax, blocks, and functions, grouped by the type labels in the [overview](Overview.md#parts-of-a-dcode-script). Keywords such as `return` and `break` are explained beside the code they affect.

# Syntax

Syntax describes how code is written: indentation, comments, expressions, and channel references. See the [Syntax reference](Reference/Syntax/Overview.md) for all forms.

## Indentation and comments

End a block header with `:` and indent its body by four spaces or one tab level. Unindent to leave the block. `#` and `--` start line comments; `--[[ ... ]]` encloses a block comment.

```dcode
# A complete task definition
task_sequence docs_demo_syntax:
    sample = 42  # This line belongs to the task
    print(sample)
```

To try the independent body snippets below, replace this task's body, activate the file, and start the task. Complete task, loop, and function definitions belong at file scope. [Tasks](Tasks.md) covers activation and controls.

## Expressions and operators

An expression produces a value. Use `=` to assign it and `==` to compare values:

```dcode
pressure = 20 + 5
within_limits = pressure >= 20 and pressure <= 40
```

Here, `pressure` is 25 and `within_limits` is true. Comparisons include `==`, `!=`, `<`, `<=`, `>`, and `>=`; combine conditions with `and`, `or`, and `not`. Parentheses group expressions. [Values and Scope](Values%20and%20Scope.md#conditions-and-operators) covers truthiness and the remaining operators.

## Channel pipes

A name between pipes reads a RAPID channel. Add `:field` to read its metadata. With a test channel `docs_demo_pressure` created at 42:

```dcode
pressure = |docs_demo_pressure|
units = |docs_demo_pressure|:units
```

`pressure` receives 42; `units` receives the channel's configured units. [Channels and Control](../Engine/Channels%20and%20Control.md) covers writes, fields, and authority; the [dynamic reference syntax](Reference/Syntax/syntax-dynamic_pipe.md) covers names built from expressions.

## Dynamic Channel Names

`{expression}` inside a pipe reference builds a name at runtime:

```dcode
task_periodic tasks_state_copy:
    task elapsed_seconds:
        for name in ["alpha", "beta", "gamma"]:
            |demo_{name}_state| = |demo_{name}_command|
```

With `name` equal to `alpha`, the target is `demo_alpha_state`. Dynamic names work in calculations too, but require explicit trigger dependencies there. See [Channel Calculations](Channel%20Calculations.md).

This syntax works in both backends. [Native C++](Native%20C%2B%2B%20Execution.md) resolves interpolated names through the host at runtime, so these accesses are outside the prepared fixed-binding path.

# Blocks

Blocks group indented code to choose actions, repeat work, or define a function. See the [Blocks reference](Reference/Blocks/Overview.md) for the complete list.

## If statements

Use `if`, `elif`, and `else` to run different code depending on a condition:

```dcode
pressure = 42
if pressure > 40:
    print("High")
elif pressure < 20:
    print("Low")
else:
    print("Within the normal band")
```

This prints **High**. Change `pressure` to try the other conditions.

## For loops

Use `for ... in ...` to visit each array value:

```dcode
readings = [10, 20, 30]
total = 0
for reading in readings:
    total = total + reading
print(total)
```

This prints 60. Iterating an object visits its keys, in insertion order. For a numeric range, use a start and inclusive end:

```dcode
for index = 1, 3:
    print(index)
```

The range includes both endpoints, so this prints 1, 2, and 3 on separate lines.

Array indexing still starts at zero. Keep a collection's length unchanged during native iteration; collection mutation rules belong in [Values and Scope](Values%20and%20Scope.md#arrays-and-objects).

## While loops

A `while` loop repeats while its condition is true. `break` exits the nearest loop:

```dcode
attempt = 0
while attempt < 5:
    attempt = attempt + 1
    if attempt == 3:
        break
print(attempt)
```

This prints 3. A `while` does not pause between iterations, so make sure it can reach an exit. Use `wait_until` to wait for equipment; long iterations delay the calling task or calculation.

## When blocks

Use `when(condition, time=seconds):` to require a condition for a duration before running its body. Use `if condition:` for an immediate check. `when` can appear wherever executable code is allowed and does not pause execution.

For example, create a test channel `pressure` at 0, then activate this calculation:

```dcode
channel_calculation pressure_high_confirmed:
    when(|pressure| > 500, time=0.5):
        return 1
    return 0
```

The first true check starts the timer; a false check resets it. After half a second of qualifying checks, the next evaluation returns 1. Further qualifying evaluations also return 1; a false check returns 0. This calculation still needs another input or target write to evaluate; the timer does not schedule a check.

`time` is required and must be a finite, positive number of seconds. Missing or zero duration is invalid; use `if` for an untimed condition. Elapsed time includes holds and skipped enclosing blocks. For blocking operations, see [managed waits](#wait-and-wait_until).

## Once blocks

`once:` runs its body the first time it is reached during the current **Runtime Section** execution. It is allowed in runtime sections and ordinary blocks nested inside them. The containing section, such as a loop body, `task:`, or `state idle:`, owns its memory.

A section execution can span many iterations; `once` stays done across those iterations. Functions, callbacks, calculations, and event handlers do not provide a runtime section and cannot contain `once`. Use an explicit flag with `if` when those contexts need one-time behavior.

Starting the task again, switching away from a state section and back, or reactivating a loop starts a new section execution. Entering an ordinary `if`, `for`, or `while` block does not reset the one-time blocks.

This loop initializes its counter once, prints 1 and 2, then logs once when the count reaches 3:

```dcode
loop docs_demo_once 2:
    once:
        count = 0
    count = count + 1
    if count < 3:
        print(count)
    if count >= 3:
        once:
            log("Docs demo", "Count reached three")
```

The loop is the Runtime Block; its body is the Runtime Section. `if` checks the condition each iteration; its nested `once` logs only on the first true check. Activating the file again creates a fresh loop and resets both `once` blocks.

The same rule applies to state sections:

```dcode
task_state_machine docs_demo_entry:
    states:
        idle
    state idle:
        once:
            print("Entered idle")
```

`state idle:` repeats while the task remains in `idle`. Its message prints once per entry into that runtime section. Switching away and back would print it again. In a `start:` section, `once:` would be allowed but usually unnecessary because startup already runs once per task execution.

The same nesting works with [timed conditions](#when-blocks). Inside a runtime section, this logs once after the pressure qualifies for half a second:

```dcode
when(|pressure| > 500, time=0.5):
    once:
        log("Pressure", "High pressure")
```

A false condition resets the pending timer. After the nested `once` runs, making the condition false and true again does not reset it; only a new execution of the containing runtime section does. A timeline bucket owns its handlers' `once` memory through waits and repeated hold/resume calls. Replaying the bucket resets it. The latch is set before the body begins, so an error or early return does not retry the block.

## Functions and return

A `function ...:` definition is a Block in the editor. It groups reusable code that you can call by name. Use a helper when several places need the same calculation; `return` ends the call and sends its result back:

```dcode
function percentage(sample, capacity):
    if capacity <= 0:
        return 0
    return clamp(sample / capacity * 100, 0, 100)

task_sequence docs_demo_percentage:
    result = percentage(25, 100)
    print(result)
```

This prints 25. The zero-capacity return is an explicit fallback for this demo; choose an appropriate fault policy for real measurements. Functions have their own scope. Use `global` for outer data, or pass it as an argument as above.

[Modules and Native Functions](Modules%20and%20Native%20Functions.md) covers sharing helpers between files. Use a [callback](Callbacks.md) when a schematic or external caller needs to invoke the function.

# Functions

Call a function with parentheses, such as `clamp(120, 0, 100)`. Functions can return values or perform work such as waiting and logging. The [DCode Functions reference](Reference/DCode%20Functions/Overview.md) lists host functions; [Lua Base](Reference/Lua%20Base/Overview.md) covers standard helpers and their backend support.

## Wait and wait_until

`wait(seconds)` delays subsequent statements for a duration; `wait_until(condition, ...)` waits for a condition. These shared functions are available wherever executable DCode is allowed, in either backend. Create `docs_demo_ready` at 0 in a test project, then try this body:

```dcode
wait(1)
wait_until(|docs_demo_ready| == 1, time=0.5, timeout=10)
print("Ready")
```

The first call waits one second. The second requires ready to stay at 1 for half a second; false resets that interval. Set it to 1 before the ten-second timeout to continue. A positive timeout raises an execution error; zero disables expiry.

A task hold pauses wait duration and timeout accounting. Stop cancels a managed wait before later statements run. [Timelines](Timelines.md) explains bucket waits and clock checkpoints.

Outside a timeline bucket, waits block their invoking execution path. Inside a bucket's `execute:`, they suspend only that bucket so other due buckets can progress. Avoid waits in calculations or repeated control callbacks when that work needs to keep running.

For a nonblocking sustained-condition check, use the [timed when blocks](#when-blocks). Unlike managed waits, their elapsed interval includes holds.

## Print, log, and assert

```dcode
sample = 42
assert(sample >= 0)
print("Sample: " + tostring(sample))
log("Docs demo", "Sample: " + tostring(sample))
```

`print` writes diagnostic output. `log` adds a line to a named stream you can open in Logs. Use one constructed string and a literal log-stream name as above for both backends; native `print` accepts one expression.

`assert` raises an error when its condition is false. The one-argument form works in both backends; Lua also accepts a message. A failure does not roll back earlier channel writes or guarantee equipment cleanup. Logging and formatting can allocate and add work, so avoid printing every iteration of a high-rate control task.

# Reference

- [Lua base constructs](Reference/Lua%20Base/Overview.md) — `break`, `return`, `assert`, and backend notes.
- [Channel statements](Reference/Statements/Overview.md) — Channel writes, authority, transitions, and event triggers.
