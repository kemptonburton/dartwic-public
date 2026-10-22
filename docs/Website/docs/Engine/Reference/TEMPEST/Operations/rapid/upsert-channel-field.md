---
title: rapid/upsert-channel-field
summary: Creates or updates a typed channel field.
created: 2026-09-04T17:13
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Required | Flat RAPID channel name (`channel` or `NODE:channel`). |
| `field` | `string` | Optional | Channel field to update; defaults to `value`. |
| `value` | `any JSON value` | Required | Typed value for the field. |
| `take_manual_control` | `boolean` | Optional | Allow the operator write to establish manual override; defaults to false. |
| `release_manual_override` | `boolean` | Optional | Release manual override; defaults to false. |

## Response payload

This operation returns an empty payload (`{}`).

## Errors

- The field is read-only, a required value is missing, an option value is invalid, or the channel name is invalid.
