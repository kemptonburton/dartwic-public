---
title: tempest/peers/rapid/list-channels
summary: Lists channels exposed by a remote RAPID runtime.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `query` | `string` | Optional | Case-insensitive channel filter; defaults to empty. |
| `limit` | `integer` | Optional | Maximum channel count; defaults to 5000 and is clamped between 1 and 50000. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `node_name` | `string` | Name of this RAPID node. |
| `snapshot_revision` | `integer` | TEMPEST peers revision captured for this snapshot. |
| `channels` | `array<RemoteChannelSummary>` | Matching native channels with their identity and current channel data. |
