---
title: tempest/peers/argus/respond-to-prompt
summary: Responds to a prompt on a remote ARGUS runtime.
created: 2026-10-04T18:31
updated: 2026-10-14T21:18
---

- **Category:** Events

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `event_id` | `string` | Optional | Stable prompt event ID. A title lookup is used when omitted. |
| `prompt_title` | `string` | Optional | In-memory prompt title. `title` is accepted as an alias. |
| `title` | `string` | Optional | Alias used for prompt/event lookup. |
| `message_title` | `string` | Optional | Compatibility event-title lookup used when resolving `event_id`. |
| `prompt_type` | `string` | Optional | Response conversion type; defaults to `string`. |
| `prompt_response` | `string` | Optional | Response text. `response` is accepted as an alias. |
| `response` | `string` | Optional | Alias for `prompt_response`. |
| `operator_client_id` | `string` | Optional | Original requesting client ID; defaults to the authenticated caller. |
| `operator_username` | `string` | Optional | Original requesting client's username for the recorded prompt response. |
| `operator_origin` | `string` | Optional | Original requesting client's serialized command origin for the recorded prompt response. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `event_id` | `string` | Resolved event ID, or an empty string for an in-memory-only prompt. |
| `prompt_found` | `boolean` | Whether a live in-memory prompt received the response. |
