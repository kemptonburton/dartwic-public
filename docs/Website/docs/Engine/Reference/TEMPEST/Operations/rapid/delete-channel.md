---
title: rapid/delete-channel
summary: Deletes channel.
created: 2026-08-03T16:00
updated: 2026-10-15T18:58
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Required | Flat local channel name. |
| `confirmed_impact_revision` | `string` | Optional | Required for reviewed references or uncertain ownership. |
| `take_manual_control` | `boolean` | Optional | Override ownership/control using operator authority after revision review, retiring fixed bindings through normal generation checks. |

## Response payload

This operation returns an empty payload (`{}`).

## Errors

- The channel name is invalid or the channel does not exist.
