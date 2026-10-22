---
title: dartwic/interface-ui/get-request
summary: Returns one interface UI request, including its completion result.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `request_id` | `string` | Required | Existing interface UI request identity. |

## Response payload

**object:** Request record with request_id, plugin_id, ui_id, payload, status, result, timestamps, and current mute state.

## Errors

- Interface UI request was not found.
