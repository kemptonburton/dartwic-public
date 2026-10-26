---
summary: Use if statements, for and while loops, once, waits, and common functions in DCode.
created: 2026-10-26
updated: 2026-10-26T14:23
---

This page explains common DCode statements, loops, and functions, with examples you can use inside a task, loop, callback, or function.

The examples are independent. To try a body snippet in a test project, replace the body of this sequence, keep its indentation, activate the file, and start the task:

```dcode
task_sequence docs_demo_syntax:
    print("Syntax demo")
```

Examples that declare a whole task, loop, or function belong at file scope. [Values and Scope](Values%20and%20Scope.md) explains variable ownership; [Tasks](Tasks.md) explains activation and task controls.

# If statements

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

This prints **High**. Change `pressure` to try the other conditions. End each `if`, `elif`, and `else` line with a colon and indent the code underneath it.

Compare with `==`, `!=`, `<`, `<=`, `>`, and `>=`; combine conditions with `and`, `or`, and `not`. Numeric zero is false in both backends. For example, `pressure >= 20 and pressure <= 40` tests the normal band.

# For loops

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

Here, 1 is the starting value and 3 is the ending value. The loop counts by 1, so it prints 1, then 2, then 3, each on its own line.

Array indexing still starts at zero. Keep a collection's length unchanged during native iteration; collection mutation rules belong in [Values and Scope](Values%20and%20Scope.md#use-arrays-and-objects).

# While loops

A `while` loop repeats while its condition is true. `break` exits the nearest loop:

```dcode
attempt = 0
while attempt < 5:
    attempt = attempt + 1
    if attempt == 3:
        break
print(attempt)
```

This prints 3. Make sure the body can reach an exit. A `while` does not pause between iterations; use `wait_until` when a procedure needs to wait for equipment. Keep long iterations out of calculations and fixed-rate control callbacks because they delay the calling execution path.

# Once and when blocks

| Code | When it runs |
| --- | --- |
| `when condition:` | Each time execution reaches it and the condition is true, like `if`. |
| `once when condition:` | The first time the condition is true for that runtime instance. |
| `when(condition, time=0.5):` | Every evaluation after the condition qualifies for half a second; false resets timing. |
| `once when(condition, time=0.5):` | The first qualifying evaluation for that runtime instance. |
| `once:` | Once whenever its containing state is entered. Valid inside state handlers. |

This complete loop prints 1 and 2, then logs one message when the count reaches 3:

```dcode
loop docs_demo_once 2:
    once when true:
        count = 0
    count = count + 1
    when count < 3:
        print(count)
    once when count >= 3:
        log("Docs demo", "Count reached three")
```

Making the condition false and true again does not reset `once when`. It remembers that it has already run. Reactivating this loop resets that memory; for a task, starting a new run resets its working state.

Plain `once:` is useful for state-entry actions:

```dcode
task_state_machine docs_demo_entry:
    states:
        idle
    state idle:
        once:
            print("Entered idle")
```

The idle handler repeats while current, but its message runs only on entry. Entering that state again runs the entry action again. These task and loop examples check their conditions each time they run. Use a channel calculation or event for a reaction driven by an input write.

## Require a sustained condition

Use a timed block to filter brief spikes without pausing a task or loop. For example, with a `pressure_abort` event declared elsewhere:

```dcode
task_periodic docs_demo_pressure_monitor 100:
    task:
        once when(|pressure| > 500, time=0.5):
            trigger pressure_abort
```

The first reading above 500 starts the timer. An evaluation at 500 or below resets it. The first evaluation at least half a second later fires the event, provided every intervening evaluation was true. The remaining task statements continue running while the condition qualifies. The event's shutdown actions must be configured explicitly.

A loop uses the same syntax. Use `when` for work that should repeat on each qualifying evaluation:

```dcode
loop docs_demo_pressure_filter 100:
    local confirmed = 0
    when(|pressure| > 500, time=0.5):
        confirmed = 1
    |pressure_high| = confirmed
```

In a channel calculation, a numeric return supplies the filtered output:

```dcode
channel_calculation pressure_high_confirmed:
    when(|pressure| > 500, time=0.5):
        return 1
    return 0
```

The calculation evaluates on accepted input writes, including equal-valued writes, and direct writes to its target. It does not wake itself when the duration expires: the next evaluation can qualify it. No new writes means no output update. See [Channel Calculations](Channel%20Calculations.md).

`time` is finite, nonnegative seconds. A positional duration, such as `when(condition, 0.5):`, is also accepted. Omitting it or using zero is immediate; the original `when condition:` and `once when condition:` forms still work. 

Timing uses monotonic elapsed time. Gaps between evaluations count, including task holds and skipped enclosing branches. Task starts reset its working state; loop and calculation state resets on replacement.

# Wait and wait_until

Use waits in a sequence when later steps must pause. Create a demo channel `docs_demo_ready` at 0, then try this body:

```dcode
wait(1)
wait_until(|docs_demo_ready| == 1, time=0.5, timeout=10)
print("Ready")
```

The first call waits one second. The second requires ready to stay at 1 for half a second; false resets that interval. Set it to 1 before the ten-second timeout to continue. A positive timeout raises an execution error; zero disables expiry.

A task hold pauses wait duration and timeout accounting. Stop cancels a managed wait before later statements run. In a timeline bucket, supported waits suspend that bucket while mission time and other buckets continue; use a clock checkpoint when later times must wait too. See [Scheduling Timelines](Scheduling%20Timelines.md).

These calls can block their execution path, including in Native C++. Keep them outside calculations and repeated control callbacks. A wait returning does not establish a hardware timing guarantee.

For a nonblocking sustained-condition check, use the [timed when blocks](#require-a-sustained-condition) above. Unlike managed waits, their elapsed interval includes holds.

# Functions and return

Use a helper when several places need the same calculation. `return` ends the call and sends its result back:

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

# Common functions

| Helper | Example and purpose |
| --- | --- |
| `clamp` | `clamp(120, 0, 100)` returns 100; constrain a number to a range. |
| `len` | `len([10, 20, 30])` returns 3. |
| `has` | `has({gain: 2}, "gain")` tests whether an object key exists. |
| `lookup` | `lookup({gain: 2}, "offset", 0)` returns the fallback 0 for a missing key. |
| `copy` | `copy(settings)` creates an independent deep copy of a collection. |
| `tostring` | `tostring(42)` produces text for a message. |
| `json.parse`, `json.stringify` | Convert between JSON text and DCode values. |

Use [Values and Scope](Values%20and%20Scope.md) for arrays, objects, copying, and shared state. The function reference gives exact inputs and backend limits.

# Print, log, and assert

```dcode
sample = 42
assert(sample >= 0)
print("Sample: " + tostring(sample))
log("Docs demo", "Sample: " + tostring(sample))
```

`print` writes diagnostic output. `log` adds a line to a named stream you can open in Logs. Use one constructed string and a literal log-stream name as above for both backends; native `print` accepts one expression.

`assert` raises an error when its condition is false. The one-argument form works in both backends; Lua also accepts a message. A failure does not roll back earlier channel writes or guarantee equipment cleanup. Logging and formatting can allocate and add work, so avoid printing every iteration of a high-rate control task.

# Reference

- [Control-flow blocks](Reference/Blocks/Overview.md) — Conditions, iteration, functions, and one-time work.
- [DCode functions](Reference/DCode%20Functions/Overview.md) — Waits, helpers, logging, and host calls.
- [Expressions](Reference/Syntax/syntax-lua_expressions.md) — Values, operators, and truthiness.
- [Lua base constructs](Reference/Lua%20Base/Overview.md) — `break`, `return`, `assert`, and backend notes.
- [Channel statements](Reference/Statements/Overview.md) — Channel writes, authority, transitions, and event triggers.
