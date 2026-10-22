---
title: dartwic/interface-ui/set-request-muted
summary: Changes an engine-scoped mute associated with one pending interface UI request.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `request_id` | `string` | Required | Pending, silenceable request with engine mute scope. |
| `muted` | `boolean` | Optional | Whether to mute the request's notification; defaults to true. |

## Response payload

**object:** Updated request record with muted state and a mute result containing id, muted, and mute_scope.

## Errors

- The request does not exist, is no longer pending, or does not expose an engine-scoped mute.
