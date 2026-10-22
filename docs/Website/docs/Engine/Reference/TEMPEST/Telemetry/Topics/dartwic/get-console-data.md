---
title: dartwic/get-console-data
summary: Publishes the legacy console view derived from active ARGUS events.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Published periodically by the console telemetry loop.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `nodes` | `array<object>` | Always | Console messages grouped by node. |
| `others` | `array<object>` | Always | Active prompts, holds, and abort messages. |
| `tag_linked_messages` | `object<string, array<object>>` | Always | Message summaries keyed by related channel path. |
