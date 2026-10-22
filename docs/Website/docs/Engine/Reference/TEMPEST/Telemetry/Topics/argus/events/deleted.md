---
title: argus/events/deleted
summary: Publishes an ARGUS deletion mutation after an event status changes to `deleted`.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Queued after ARGUS accepts a delete status update and flushed by the event publisher.

## Payload

**`ArgusEvent | DeletedEvent`:** Normally the complete deleted ARGUS record; if the in-memory record is unavailable, contains `event_id` and `status: "deleted"`.
