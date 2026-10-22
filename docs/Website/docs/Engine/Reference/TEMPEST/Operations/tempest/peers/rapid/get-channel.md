---
title: tempest/peers/rapid/get-channel
summary: Returns a channel from a remote RAPID runtime.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel` | `string` | Required | Native flat RAPID channel name. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `node_name` | `string` | Name of this RAPID node. |
| `channel` | `string` | Requested channel. |
| `channel_data` | `object` | Current RAPID channel fields. |
