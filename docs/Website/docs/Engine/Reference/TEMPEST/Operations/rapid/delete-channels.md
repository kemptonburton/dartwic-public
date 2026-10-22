---
title: rapid/delete-channels
summary: Deletes multiple local channels in one protected RAPID configuration transaction.
created: 2026-10-04T18:31
updated: 2026-10-15T18:58
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_names` | `array<string>` | Required | Flat local channel names to delete; duplicates are ignored. |
| `confirmed_impact_revision` | `string` | Optional | Required for reviewed references or uncertain ownership. |
| `take_manual_control` | `boolean` | Optional | Override ownership/control using operator authority after revision review, retiring fixed bindings through normal generation checks. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `deleted` | `array<string>` | Channels removed from RAPID. |
| `not_found` | `array<string>` | Requested channels that no longer existed. |
| `requested_count` | `integer` | Number of unique validated channel names. |
| `deleted_count` | `integer` | Number of channels removed. |
