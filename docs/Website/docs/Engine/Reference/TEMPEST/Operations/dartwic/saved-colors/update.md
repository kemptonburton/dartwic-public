---
title: "dartwic/saved-colors/update"
summary: "Edits or renames a saved color in the Engine palette. Requires administrator access."
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `original_name` | `string` | Required | Current saved color name, matched case-insensitively for ASCII names. |
| `name` | `string` | Required | Display name up to 80 UTF-8 bytes. |
| `light` | `string` | Required | Six-digit hex color for light mode. |
| `dark` | `string` | Required | Six-digit hex color for dark mode. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `colors` | `array<object>` | Updated palette after the atomic write. |

## Errors

- The original color is missing, the new name is in use, validation fails, or the write fails.
