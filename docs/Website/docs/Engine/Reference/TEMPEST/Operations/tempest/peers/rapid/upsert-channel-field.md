---
title: tempest/peers/rapid/upsert-channel-field
summary: Creates or updates a channel field on a remote RAPID runtime.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Required | Flat RAPID channel name (`channel` or `NODE:channel`). |
| `field` | `string` | Optional | Channel field to update; defaults to `value`. |
| `value` | `any JSON value` | Required | Typed JSON value to write. |
| `command_source` | `string` | Optional | Complete structured command origin forwarded with the command; defaults to the peer engine service. |
| `allow_manual_override` | `boolean` | Optional | Permit the write to take manual control; defaults to false. |
| `release_manual_override` | `boolean` | Optional | Release an existing manual override as part of the write; defaults to false. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channel_name` | `string` | Channel that was updated. |
| `field` | `string` | Field that was updated. |
| `command_source` | `string` | Effective command source. |
