---
title: "dartwic/diagnostics/configure"
summary: "Updates engine diagnostics thresholds and event emission settings."
---

- **Category:** Diagnostics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `caesar_cadence_tolerance_percent` | `number` | Optional | Allowed deviation on either side of a task's target frequency, from 0 up to but excluding 100. Defaults to 10. |

## Response payload

**object:** Updated diagnostics configuration.
