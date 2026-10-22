---
title: project/actions/updated
summary: Publishes current project-action progress after a persisted step changes.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Projects and Files
- **Direction:** Server → clients

## Delivery

Published only when a project-action revision changes.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `revision` | `integer` | Always | Monotonic action revision. |
| `actions` | `array<object>` | Always | Current project actions and step statuses. |
