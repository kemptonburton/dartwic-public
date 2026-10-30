---
summary: Create several controllers or warnings from one DCode definition and a YAML file.
updated: 2026-10-28T19:07
created: 2026-10-14T15:04
---

A template creates several runtime definitions from one DCode block and a YAML list. Keep shared behavior in DCode and each device's or signal's names and settings in YAML.

![](_attachments/Pasted%20image%2020261027044224.png)

# Template Configuration

Load YAML rows with `params = yaml`, then use `template(params)` to repeat a declaration for each row. Each generated name must be unique. Templates support tasks, task groups, loops, calculations, events, and callbacks, subject to each block's backend support.

For example, create `sensor_limits.yaml` beside a new `sensor_limits.dcode` file:

```yaml
sensors:
  - name: pressure
    channel: docs_demo_pressure
    high: 80
  - name: temperature
    channel: docs_demo_temperature
    high: 350
```

Create the two demo channels, then put this in `sensor_limits.dcode`. The `#sensors` suffix selects the YAML list:

```dcode
params = yaml "./sensor_limits.yaml#sensors"

template(params) event docs_limit_{params.name}:
    title: "{params.name} above limit"
    type: warning
    firing_timeout_seconds: 0
    channels: |{params.channel}|
    trigger:
        if |{params.channel}| > {params.high}:
            return 1
        return 0
```

Activate the file to create `docs_limit_pressure` and `docs_limit_temperature`. Raise `docs_demo_pressure` above 80: only the pressure warning fires. Lower it to clear the condition; the board record can remain until resolved. Restore the demo values when finished.

# Template Expansion

Placeholders such as `{params.channel}` are replaced before compilation. Static channel reads produced by templates are therefore detected automatically as calculation dependencies.

Quote placeholders inside strings, as in the title above. Numeric fields go directly into expressions; arrays, objects, and null become DCode values. [Values and Scope](Values%20and%20Scope.md#values-from-templates) covers these substitutions.

Use **Expand template** in the editor gutter to inspect generated declarations and **Collapse template** to return to the source. Previewing does not activate code.

![](_attachments/Pasted%20image%2020261027044137.png)

# Template Lifecycle

Each generated definition belongs to its consuming `.dcode` file and follows that runtime block's lifecycle. Expanding a template does not create a separate runtime owner.

Stop the relevant procedure before changing controller definitions. Edit the YAML, then Run the consuming DCode file and inspect the activation result. The YAML editor's Run action also saves the YAML and reactivates its consumers.

Reactivation replaces all runtime definitions in each consuming file, including unchanged ones. Surviving running tasks restart with fresh state. Removing a row removes its generated definition after successful reactivation.

![](_attachments/Pasted%20image%2020261026140141.png)

In the photo above, the YAML that drives the templated loops has been changed, which requires the script to be ran again.

Generated definitions follow the [shared artifact cleanup rules](../Engine/Modules%20and%20Tasks.md#removal-and-replacement). [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) covers file replacement and backend limits.

# Example workspace templates

In the [example workspace](../Getting%20Started/First%20Session.md), open `scripts/valves/valves.yaml` and `double_acting_valves.dcode`. Its four rows generate the fuel, oxidizer, fill, and vent valve controllers.

Each loop independently remembers its last request. A changed request pulses the selected coil for half a second, then records completion in `rocket_sim_<valve>_state`: 1 for open, 0 for closed. This retained command state is not measured position feedback.

The templates in `scripts/warnings/` generate sensor warnings with low/high limits, device-validity checks, and sample-age checks. A retained value can remain within limits after acquisition fails.

# Reference

- [Template directive](Reference/Directives/directive-template.md) — Supported declarations and substitution rules.
- [YAML parameters](Reference/Directives/directive-params_yaml.md) — Load a list from a YAML file.
- [Runtime Blocks and Activation](Runtime%20Blocks%20and%20Activation.md) — Replacement, state resets, and retained channels.
