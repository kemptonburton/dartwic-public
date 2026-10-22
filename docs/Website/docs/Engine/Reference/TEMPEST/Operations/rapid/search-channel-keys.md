---
title: rapid/search-channel-keys
summary: Searches channel keys.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive channel search text; defaults to empty. |
| `limit` | `integer` | Optional | Maximum channel count; defaults to 1000. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `query_results` | `array<string>` | Matching channel keys. |
| `query` | `string` | Search text supplied by the client. |
