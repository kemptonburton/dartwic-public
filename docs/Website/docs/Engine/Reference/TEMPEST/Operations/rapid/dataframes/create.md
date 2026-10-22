---
title: rapid/dataframes/create
summary: Creates a historical dataframe from a recording selection.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Name of the dataframe. |
| `channels` | `array<string>` | Optional | Displayed channels; omitted means all recorded channels in the range. |
| `from_ns` | `integer` | Required | Start timestamp. |
| `to_ns` | `integer` | Required | End timestamp. |

## Response payload

**object:** Created dataframe.
