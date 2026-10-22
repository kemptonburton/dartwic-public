---
title: dartwic/diagnostics/get
summary: Returns the engine's current diagnostics snapshot.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Diagnostics

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

**object:** Stable channel catalog, availability, formulas, recorded evidence, runtime diagnostics, and effective configuration. Disabled sampler diagnostics remain configurable with null values and no live RAPID channel; task-owned channels remain intact.
