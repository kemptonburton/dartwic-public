---
summary: Create several controllers or warnings from one DCode definition and a YAML file.
updated: 2026-10-15T19:40
created: 2026-10-14T15:04
---

Use a template when several pieces of equipment follow the same logic but have different names or settings. Write the behavior once in DCode and list the instances in YAML.

The example workspace uses this for four valve controllers and a set of sensor warnings. Each generated task or event has its own name; changing one definition updates all its instances when you activate the file.

The editor shows **Expand template** in the gutter for every supported templated declaration: periodic, sequence, state-machine, timeline and grouped tasks, loops, channel calculations, events, and callbacks. The inline preview shows the generated declarations; **Collapse template** returns to the source without activating the file.

## Start with two warnings

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
```

The `#sensors` suffix selects the YAML list. For each row, the template inserts its fields into the declaration before compilation. It creates `docs_limit_pressure` and `docs_limit_temperature`. Names must stay unique.

Raise `docs_demo_pressure` above 80 and check that only the pressure warning fires. Lower it and check the firing condition clears. The occurrence can remain on the board until the operator resolves it. Restore both demo values when finished.

## Use the valve and warning examples

In the [example workspace](../Getting%20Started/Example%20Workspace.md), open `scripts/valves/valves.yaml` and `double_acting_valves.dcode`. The four `valve` rows create `rocket_valve_fuel`, `rocket_valve_oxidizer`, `rocket_valve_fill`, and `rocket_valve_vent`.

Each loop remembers its last request independently. When the request changes, it pulses the selected coil for half a second, then records the completed command. The device's position channel remains the source of measured feedback. Compare the request, applied coils, and position in the [example workspace](../Getting%20Started/Example%20Workspace.md).

The files under `scripts/warnings/` use the same pattern for names, channels, titles, and low/high limits. They also check device validity and sample age, because a retained value can still sit inside its normal limits after acquisition fails.

## Change the configuration

Stop the relevant example procedure before changing controller definitions. Edit the YAML, then Run the consuming DCode file and inspect the activation result. The YAML editor's Run action saves the YAML and reactivates its consumers too.

Activation replaces all runtime definitions from each consuming file. Surviving running tasks restart with fresh local state. Removing a row removes its generated runtime after successful reactivation, but can leave channels and recorded history behind. Use [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) when changing a live project.

A YAML string is inserted as text. Quote a placeholder when it belongs inside a DCode string, as in the event title above. Numeric fields can appear directly in expressions; arrays and objects expand into DCode collections. Templates work with both backends, subject to the chosen runtime block's normal backend support.
