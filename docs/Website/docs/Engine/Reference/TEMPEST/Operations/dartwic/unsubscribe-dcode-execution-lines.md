---
title: dartwic/unsubscribe-dcode-execution-lines
summary: Stops a client's live execution-line feed for one script.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `subscription_id` | `string` | Required | Previously subscribed editor view ID. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `unsubscribed` | `boolean` | Subscription was removed if present. |
