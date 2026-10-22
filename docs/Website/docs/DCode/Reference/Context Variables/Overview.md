---
title: "Context Variables"
summary: "Values supplied by the engine only in the runtime blocks and handlers where they are meaningful."
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [current_state](variable-current_state.md) | State Machine | `current_state` | State handlers |
| [current_value](variable-current_value.md) | Calculation | `current_value` | Channel calculations |
| [elapsed_seconds](variable-elapsed_seconds.md) | Timing | `elapsed_seconds` | Timed handlers |
| [lateness_ms](variable-lateness_ms.md) | Timing | `lateness_ms` | Missed-release handlers |
| [missed_count](variable-missed_count.md) | Timing | `missed_count` | Missed-release handlers |
| [new_value](variable-new_value.md) | Calculation | `new_value` | Channel calculations |
| [state](variable-state.md) | Runtime State | `state.<name>` | Runtime block bodies, Shared helper functions |
| [states](variable-states.md) | State Machine | `states.<declared_name>` | State-machine bodies |
| [target_state](variable-target_state.md) | State Machine | `target_state` | State handlers |
| [value](variable-value.md) | Calculation | `value` | Channel calculations |
