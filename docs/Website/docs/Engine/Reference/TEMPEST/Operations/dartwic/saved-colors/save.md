---
title: "dartwic/saved-colors/save"
summary: "Saves one named palette entry in the Engine instance's global data. Requires administrator access."
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Display name up to 80 UTF-8 bytes, compared case-insensitively for ASCII names. |
| `light` | `string` | Required | Six-digit hex color for light mode. |
| `dark` | `string` | Required | Six-digit hex color for dark mode. |
| `replace` | `boolean` | Optional | Replace an entry with the same name; defaults to false. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `colors` | `array<object>` | Updated palette after the atomic write. |

## Errors

- Invalid name or hex color, name already exists without replacement, or the write fails.
