---
title: dartwic/interface-ui/get-requests
summary: Lists interface UI requests, optionally filtered by UI ID and status.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `ui_id` | `string` | Optional | UI contribution ID; empty matches all contributions. |
| `status` | `string` | Optional | Request status; defaults to pending. Empty matches all statuses. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `requests` | `array<object>` | Request records containing identity, plugin/UI IDs, payload, status, timestamps, result, mute state, and severity (message, warning, or error). Severity does not change workflow actions or ownership. |
