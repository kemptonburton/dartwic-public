---
title: argus/logs/streams-changed
summary: Publishes summaries of log streams changed by this batch.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Logs
- **Direction:** Server → clients

## Delivery

Published for each incoming batch with changed streams.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `streams` | `array` | Always | Changed stream summaries and unread levels. |
