---
title: "dartwic/builder/get-report"
summary: "Returns structured project build, fixed-layout, binding, activation, and startup events.\nContext filters match each record independently; query by session_id alone to include\nall events of a discovered session, including events without that script/task context."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `script_path` | `string` | Optional | Exact script path to match in a session or event context. |
| `task_name` | `string` | Optional | Exact task name to match in a session or event context. |
| `channel` | `string` | Optional | Exact channel name to match in a session or event context. |
| `session_id` | `string` | Optional | Exact builder session id to return. |
| `limit` | `integer` | Optional | Maximum matching sessions and events to return; defaults to 300 with a minimum of 1. |
| `root_session_id` | `string` | Optional | Return one Builder session and its nested sessions and events. |

## Response payload

**object:** Builder name, sessions, events, latest sequence, fixed-channel configuration, active task transactions, loaded scripts, and blocking execution lines when applicable.
