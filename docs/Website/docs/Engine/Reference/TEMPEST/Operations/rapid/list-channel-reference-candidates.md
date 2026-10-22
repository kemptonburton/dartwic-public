---
title: rapid/list-channel-reference-candidates
summary: |-
  Lists literal channel names used by project resources and live task
  configuration, including references to channels that no longer exist.
created: 2026-10-04T18:31
updated: 2026-10-04T21:19
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channel_names` | `array<string>` | Literal channel names found in project resources and live tasks. |
