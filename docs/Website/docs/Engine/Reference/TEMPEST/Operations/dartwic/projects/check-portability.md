---
title: dartwic/projects/check-portability
summary: Checks declared dependencies and JSON resources in the active project.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Projects and Files

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `ready` | `boolean` | Whether the static portability checks found no issues. |
| `issues` | `array<object>` | Findings containing code, file, and message; values and credentials are not included. |
| `native_toolchain_required` | `boolean` | Whether a script requests native compilation. |
| `scope` | `string` | Limits of these static checks. |
