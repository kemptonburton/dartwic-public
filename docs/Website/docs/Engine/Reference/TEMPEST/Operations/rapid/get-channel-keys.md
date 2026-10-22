---
title: rapid/get-channel-keys
summary: Returns channel keys.
created: 2026-09-04T17:13
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `channel_keys` | `array<string>` | Flat channel names (`channel` or `NODE:channel`). |
