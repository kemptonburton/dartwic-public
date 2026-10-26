---
summary: Run lightweight repeated work on activation and inspect its state and timing.
created: 2026-10-26
updated: 2026-10-26T14:16
---

A loop is lightweight work that repeats at a requested frequency and starts when its file is activated. Use it for simple background automation. Use a [task](Tasks.md) when an operator needs explicit start, hold, and stop controls.

# Copy a channel

Create `docs_demo_count_value` at 0 in a test project, then activate this file:

```dcode
loop docs_demo_copy 2:
    |docs_demo_copy_value| = |docs_demo_count_value|
```

The loop requests two iterations per second. Change the input and inspect `docs_demo_copy_value`; it follows on a later iteration. This is scheduled work. A [channel calculation](Channel%20Calculations.md) instead runs in response to accepted input writes.

# Keep state between iterations

A loop has no `start:` section. Initialize working variables on its first iteration with `once when true:`:

```dcode
loop docs_demo_loop_count 2:
    once when true:
        count = 0
    count = count + 1
    |docs_demo_loop_count_value| = count
```

Variables remain available between iterations until reactivation. Running the file again rebuilds the loop and resets its working state. File globals have a different owner; see [Values and Scope](Values%20and%20Scope.md).

# Inspect timing and lifecycle

Check `<name>_actual_frequency`, `_execution_time`, `_missed_cycles`, and `_failed_cycles` to see how the loop is performing. Slow functions or waits add to the iteration's duration and can cause skipped releases. They do not become timing guarantees merely because they are inside a loop.

The optional `disable_warnings` flag suppresses timing warnings while retaining measurements and callback failures. Use it deliberately for intentional blocking work.

Closing the editor does not stop the loop. Edit its declaration and reactivate the file to replace it; [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) covers removal, failures, and the last-declaration limit in Native C++. Loop cleanup releases automatic ownership without resetting stored output values or sending a physical stop command.

# Reference

- [Loop declaration](Reference/Runtime%20Blocks/runtime-loop.md) — Frequency, diagnostics, and backend behavior.
- [Runtime blocks](Reference/Runtime%20Blocks/Overview.md) — Other kinds of Engine-managed work.
- [Values and Scope](Values%20and%20Scope.md) — Variable ownership and initialization.
