---
title: "rapid/dataframes/channels"
summary: "Lists recorded channels overlapping one saved view. Counts are loaded only for the requested page."
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Saved dataframe identifier. |
| `query` | `string` | Optional | Channel name filter. |
| `offset` | `integer` | Optional | First matching channel. |
| `limit` | `integer` | Optional | Page size, up to 200. |
| `load_counts` | `boolean` | Optional | Count samples in the requested page. |

## Response payload

**object:** Channel entries and total catalog count.
