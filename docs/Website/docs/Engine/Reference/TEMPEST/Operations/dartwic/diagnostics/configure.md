---
title: dartwic/diagnostics/configure
summary: Updates engine diagnostics thresholds and event emission settings.
created: 2026-10-04T18:31
updated: 2026-11-13T00:56
---

- **Category:** Diagnostics

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `caesar_cadence_tolerance_percent` | `number` | Optional | Legacy default deviation on either side of a task's target frequency, from 0 up to but excluding 100. Defaults to 10. Used only for cadence channels without an explicit measurement_warnings rule; saved cadence limits follow the configured target automatically. |

## Response payload

**object:** Updated diagnostics configuration, with saved cadence limits resolved to current Hz and the current target reference.
