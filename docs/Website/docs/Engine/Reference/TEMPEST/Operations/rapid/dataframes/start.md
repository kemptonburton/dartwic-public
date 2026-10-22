---
title: rapid/dataframes/start
summary: Starts a saved dataframe view at the engine clock.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | Requested test name; collisions receive a numeric suffix. |
| `channels` | `array<string>` | Optional | Channels to show; omitted means all recorded channels. |
| `events` | `string` | Optional | all, related, or off; defaults to all. |
| `logs` | `string` | Optional | all, related, or off; defaults to all. |

## Response payload

**object:** Allocated dataframe with its name, channels, selection rules, timestamps, and active state.
