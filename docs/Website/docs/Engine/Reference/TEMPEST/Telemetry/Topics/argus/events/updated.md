---
title: argus/events/updated
summary: Publishes the complete ARGUS record after an event is created or its correlated record is updated.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

- **Category:** Events
- **Direction:** Server → clients

## Delivery

Offered to the bounded publisher after ARGUS accepts a non-resolved event mutation. Overflow is counted and requests a history refresh; event recording has a separate outcome.

## Payload

**`ArgusEvent`:** Complete logical event record containing identity and first/latest timestamps; detection and occurrence counts; latest firing start/end and history-completeness state; node, system, subsystem, type, severity, status, presentation, source, channels, actions, payload, correlation key, and auto-acknowledge interval.
