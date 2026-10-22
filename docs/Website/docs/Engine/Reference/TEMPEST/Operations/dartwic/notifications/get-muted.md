---
title: dartwic/notifications/get-muted
summary: Lists persistent global and active-project notification mute choices from the workspace.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `mutes` | `array<object>` | Effective records with id, muted, mute_scope, mute_scopes, muted_at_unix_ms, and optional source/title/description metadata. |
| `expires_after_days` | `null` | Choices remain until explicitly unmuted. |
| `maximum_mutes` | `integer` | Maximum choices per scope. |
