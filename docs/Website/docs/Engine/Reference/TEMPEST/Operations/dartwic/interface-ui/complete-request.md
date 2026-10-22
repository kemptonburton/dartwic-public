---
title: dartwic/interface-ui/complete-request
summary: Completes, dismisses, or cancels an interface UI request.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `request_id` | `string` | Required | Existing interface UI request identity. |
| `status` | `string` | Optional | Terminal status: completed, dismissed, or cancelled. Defaults to completed. |
| `result` | `object \| array \| string \| number \| boolean \| null` | Optional | UI-specific completion result; defaults to null. |

## Response payload

**object:** Updated request record with the terminal status, supplied result, and updated_unix_ms.

## Errors

- Interface UI request was not found or the terminal status is invalid.
