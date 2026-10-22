---
title: "rapid/get-fixed-configuration"
summary: "Returns RAPID fixed-channel configuration and protection state."
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `sealed` | `boolean` | Whether fixed-channel configuration is protected. |
| `state` | `string` | `protected` when sealed or `preparing` when open. |
| `automatic_updates` | `boolean` | Whether fixed-channel layout updates are automatic. |
| `fixed_channel_count` | `integer` | Number of configured fixed channels. |
| `fixed_channel_capacity` | `integer` | Allocated fixed-channel capacity. |
