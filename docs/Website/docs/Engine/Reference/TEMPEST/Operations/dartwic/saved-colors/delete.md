---
title: "dartwic/saved-colors/delete"
summary: "Deletes a named color from the Engine palette. Requires administrator access."
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Saved color name, matched case-insensitively for ASCII names. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `colors` | `array<object>` | Updated palette after the atomic write. A missing color returns the current palette. |

## Errors

- The palette could not be read or saved, or the name is invalid.
