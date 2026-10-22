---
title: dartwic/diagnostics/configure
summary: Updates engine diagnostics thresholds and event emission settings.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Diagnostics

## Request payload

**object:** Partial configuration patch with optional scope (workspace or project). measurement_warnings maps channel names to enabled and above/below/outside_range rules. Disabling an engine diagnostic stops publication and its warnings; shared inputs remain while needed. internal_caesar_warnings maps task|name or loop|name to enable flags (engine internals default off). Task switches suppress warnings without deleting task-owned channels. warnings_enabled globally disables sampler diagnostics. Legacy condition_warnings switches migrate to canonical channel/runtime controls.

## Response payload

**object:** Updated diagnostics configuration.
