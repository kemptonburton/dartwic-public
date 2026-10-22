---
title: rapid/set-fixed-configuration-sealed
summary: Opens or protects RAPID's fixed-channel configuration after active task transactions finish.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `sealed` | `boolean` | Optional | Whether fixed-channel configuration should be protected; defaults to false. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `sealed` | `boolean` | Current fixed-configuration lock state. |
| `state` | `string` | `protected` when sealed or `preparing` when open. |
| `automatic_updates` | `boolean` | Whether fixed-channel layout updates are automatic. |
| `fixed_channel_count` | `integer` | Number of configured fixed channels. |
| `fixed_channel_capacity` | `integer` | Allocated fixed-channel capacity. |
| `builder_session_id` | `string` | Builder session that records the lock transition. |
