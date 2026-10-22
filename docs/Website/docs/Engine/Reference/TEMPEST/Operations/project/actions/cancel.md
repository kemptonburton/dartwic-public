---
title: "project/actions/cancel"
summary: "Requests cancellation at the next safe action step. Current work finishes before stopping; rename recovery restores prior state and completed deletions are retained and saved."
---

- **Category:** Projects and Files

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Running project action identifier. |

## Response payload

**object:** Action with cancellation requested, or its terminal result if already stopped.
