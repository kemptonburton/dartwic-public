---
title: tempest/job-list
summary: Lists detached jobs owned by the requesting client.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Jobs

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `jobs` | `array<DetachedJob>` | Retained detached jobs owned by the requesting client, with state, progress, result, error, timing, and cancellation metadata. |
