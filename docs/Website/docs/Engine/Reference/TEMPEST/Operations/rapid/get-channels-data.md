---
title: rapid/get-channels-data
summary: Returns channels data.
created: 2026-09-04T17:13
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_names` | `array<string>` | Required | Local channel keys to read. Invalid/non-string entries are skipped. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channels` | `object<string, ChannelLookup>` | Results keyed by requested name. Cached offline peer channels have `exists: true`, `available: false`, and their last `channel_data`. |
