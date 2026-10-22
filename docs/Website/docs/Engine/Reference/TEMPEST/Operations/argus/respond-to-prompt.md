---
title: argus/respond-to-prompt
summary: Responds to prompt.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable prompt event ID. When omitted, a title lookup is used. |
| `prompt_title` | `string` | Optional | In-memory prompt title. `title` is accepted as an alias. |
| `title` | `string` | Optional | Alias used for prompt/event lookup. |
| `message_title` | `string` | Optional | Compatibility event-title lookup used when resolving `event_id`. |
| `prompt_type` | `string` | Optional | Response conversion type; defaults to `string`. |
| `prompt_response` | `string` | Optional | Response text. `response` is accepted as an alias. |
| `response` | `string` | Optional | Alias for `prompt_response`. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `event_id` | `string` | Resolved event ID, or an empty string for an in-memory prompt without an ARGUS event. |
| `prompt_found` | `boolean` | Whether a live in-memory prompt received the response. |

## Errors

- Neither a live prompt nor an event can be resolved.
