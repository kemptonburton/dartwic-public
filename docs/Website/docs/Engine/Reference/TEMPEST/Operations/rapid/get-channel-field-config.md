---
title: rapid/get-channel-field-config
summary: Returns channel field config.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `fields` | `array<ChannelFieldDefinition>` | Field definitions with `name`, data `type`, `editable`, authority `access`, and optional `{value, label}` options. |
