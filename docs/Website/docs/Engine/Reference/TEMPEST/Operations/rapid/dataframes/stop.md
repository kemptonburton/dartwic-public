---
title: rapid/dataframes/stop
summary: Closes a saved dataframe view at the engine clock.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Dataframe identifier. |

## Response payload

**object:** Dataframe with its stopped state and end time.
