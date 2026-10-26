---
title: project/actions/cancel
summary: Cancels queued actions immediately or requests cancellation at the next safe running step. Current work finishes before stopping; rename recovery restores prior state and completed deletions are retained and saved.
created: 2026-10-20T18:59
updated: 2026-10-24T21:02
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Running project action identifier. |

## Response payload

**object:** Action with cancellation requested, or its terminal result if already stopped.
