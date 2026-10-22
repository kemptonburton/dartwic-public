---
title: dartwic/notifications/set-muted
summary: Changes one workspace notification mute choice by its stable identity.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Interface UI and Notifications

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `notification_id` | `string` | Required | Nonempty stable notification identity. |
| `muted` | `boolean` | Optional | Whether to retain a mute; defaults to true. |
| `scope` | `string` | Optional | workspace (default) or project (active project). |
| `metadata` | `object` | Optional | Optional source, title, and description strings, each truncated to 1024 characters. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | Notification identity. |
| `muted` | `boolean` | Effective mute state after changing the requested scope. |
| `mute_scope` | `string` | Storage scope changed: workspace or project. |
| `record` | `object` | Retained metadata and the time of the deliberate mute choice. |
