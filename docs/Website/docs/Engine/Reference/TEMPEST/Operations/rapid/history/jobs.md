---
title: rapid/history/jobs
summary: Lists stored cleanup operations and maintenance status.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `operations` | `array<object>` | Cleanup operation records. |
| `maintenance_running` | `boolean` | Whether maintenance is active. |
