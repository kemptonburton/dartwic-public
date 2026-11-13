---
title: dartwic/diagnostics/get
summary: Returns the engine's current diagnostics snapshot.
created: 2026-10-04T18:31
updated: 2026-11-12T18:18
---

- **Category:** Diagnostics

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

**object:** Stable channel catalog, availability, formulas, recorded evidence, runtime diagnostics, and effective configuration. Task cycle-to-cycle frequency rows include their effective warning_rule and shared warning_condition identity. Cadence warning rules in config and metric metadata resolve to current Hz limits with reference_frequency_hz equal to the configured task target. Disabled sampler diagnostics remain configurable with null values and no live RAPID channel; task-owned channels remain intact.
