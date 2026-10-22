---
title: dartwic/call-dcode-callback
summary: Invokes a captured DCode callback and tracks its completion.
created: 2026-10-20T18:59
updated: 2026-10-20T18:59
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `callback_name` | `string` | Required | Active DCode callback name. |
| `arguments` | `object` | Required | Named JSON-compatible arguments matching the declaration. |

## Response payload

**DetachedJob:** The completed result is the callback return value.
