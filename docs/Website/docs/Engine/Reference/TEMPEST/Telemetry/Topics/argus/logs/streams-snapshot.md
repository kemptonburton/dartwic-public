---
title: argus/logs/streams-snapshot
summary: Publishes the current log-stream summary after a viewed marker changes.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Logs
- **Direction:** Server → clients

## Delivery

Published after a viewed marker changes.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `streams` | `array` | Always | Current log streams and unread levels. |
