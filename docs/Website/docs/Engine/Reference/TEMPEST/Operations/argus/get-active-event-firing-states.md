---
title: argus/get-active-event-firing-states
summary: Returns the authoritative firing state for active events.
created: 2026-09-04T17:13
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `events` | `array<ArgusEventFiringState>` | Active event IDs and their current runtime firing state. |
