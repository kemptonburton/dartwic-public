---
summary: Create several controllers or warnings from one DCode definition and a YAML file.
updated: 2026-10-26T14:16
created: 2026-10-14T15:04
---

A template repeats one DCode definition for several devices or signals. Keep the behavior in DCode and list each instance's names and settings in YAML. This avoids maintaining a separate copy of the same controller or warning.

The example workspace uses templates for valve controllers and sensor warnings. Each generated declaration has its own name and runtime state.

# Start with two warnings

Create `sensor_limits.yaml` beside a new `sensor_limits.dcode` file:

```yaml
sensors:
  - name: pressure
    channel: docs_demo_pressure
    high: 80
  - name: temperature
    channel: docs_demo_temperature
    high: 350
```

Create those two demo channels before activating this script:

```dcode
params = yaml "./sensor_limits.yaml#sensors"

template(params) event docs_limit_{params.name}:
    title: "{params.name} above limit"
    type: warning
    separation_seconds: 0
    channels: |{params.channel}|
    trigger:
        if |{params.channel}| > {params.high}:
            return 1
        return 0
```

The `#sensors` suffix selects the YAML list. For each row, the template inserts its fields into the declaration before compilation. It creates `docs_limit_pressure` and `docs_limit_temperature`. Names must stay unique.

Raise `docs_demo_pressure` above 80 and check that only the pressure warning fires. Lower it and check the firing condition clears. The occurrence can remain on the board until the operator resolves it. Restore both demo values when finished.

# Use the valve and warning examples

In the [example workspace](../Getting%20Started/Example%20Workspace.md), open `scripts/valves/valves.yaml` and `double_acting_valves.dcode`. The four `valve` rows create `rocket_valve_fuel`, `rocket_valve_oxidizer`, `rocket_valve_fill`, and `rocket_valve_vent`.

Each loop remembers its last request independently. When the request changes, it pulses the selected coil for half a second, then records the completed command. Each valve has one last-known state channel, `rocket_sim_<valve>_state`: `1` is open and `0` is closed. It retains that value after the pulse; it is not measured position feedback.

The files under `scripts/warnings/` use the same pattern for names, channels, titles, and low/high limits. They also check device validity and sample age, because a retained value can still sit inside its normal limits after acquisition fails.

# Change the configuration

Stop the relevant example procedure before changing controller definitions. Edit the YAML, then Run the consuming DCode file and inspect the activation result. The YAML editor's Run action saves the YAML and reactivates its consumers too.

Activation replaces all runtime definitions from each consuming file. Surviving running tasks restart with fresh local state. Removing a row removes its generated runtime after successful reactivation, but can leave channels and recorded history behind. Use [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) when changing a live project.

A YAML string is inserted as text. Quote a placeholder when it belongs inside a DCode string, as in the event title above. Numeric fields can appear directly in expressions; arrays and objects expand into DCode collections. Templates work with both backends, subject to the chosen runtime block's normal backend support.

# Inspect the expansion

Use **Expand template** in the editor gutter to see the generated declarations. **Collapse template** returns to the source. This preview does not activate code.

Templates can produce tasks, task groups, loops, calculations, events, and callbacks. The selected block's backend and lifecycle rules still apply.

# Reference

- [Template directive](Reference/Directives/directive-template.md) — Supported declarations and substitution rules.
- [YAML parameters](Reference/Directives/directive-params_yaml.md) — Load a list from a YAML file.
- [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) — Replacement, state resets, and retained channels.
