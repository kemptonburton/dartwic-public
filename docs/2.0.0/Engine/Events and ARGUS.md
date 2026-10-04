---
updated: 2026-06-23T04:35
created: 2026-06-23
---

ARGUS is the engine event system. It records operator-visible events such as errors, warnings, messages, prompts, holds, aborts, process output, and TEMPEST operation observations.

Use ARGUS when a runtime condition should be visible, actionable, queryable, or tied back to a channel, task, file, subsystem, or client action.

# Event Fields

| Field | Meaning |
| --- | --- |
| `event_id` | Stable id for the event. |
| `type` | Event kind, such as `message`, `warning`, `error`, `prompt`, `hold`, or `abort`. |
| `severity` | Display severity, such as `info`, `warning`, or `error`. |
| `status` | Current event state, such as `new`, `acknowledged`, `silenced`, `deleted`, `responded`, or `released`. |
| `title` | Short event title. |
| `description` | Human-readable details. |
| `resolution` | Suggested operator resolution. |
| `system` | High-level grouping, such as `SOFTWARE`. |
| `subsystem` | More specific grouping, such as `DCODE`, `TEMPEST`, or a plugin subsystem. |
| `node` | DARTWIC node that recorded the event. |
| `source` | Runtime source that produced the event. |
| `loop` | CAESAR loop name when available. |
| `file` / `line` | Source file or script location when available. |
| `channels` | Related channel paths. |
| `actions` | Operator actions the interface can offer. |
| `payload` | Event-specific JSON. |
| `correlation_key` | Key used to group repeated observations into one event record. |
| `auto_acknowledge_seconds` | Optional automatic acknowledgement timing. |
| `created_at_ns`, `updated_at_ns`, `first_seen_at_ns`, `last_seen_at_ns` | Event timestamps in epoch nanoseconds. |

# Where Events Come From

- engine console helpers record messages, warnings, errors, aborts, holds, and prompts
- DCode helpers such as `print`, `message`, `warning`, `hold`, `abort`, and prompt functions create ARGUS-visible records
- TEMPEST observations record operation timing and errors
- process and terminal output can be captured as events
- plugins and modules can raise events through SDK or console paths

# Event Queries

ARGUS queries can filter by:

- system
- subsystem
- type
- status
- node
- channel
- text
- session
- time range
- active-only state

The interface uses these queries for the ARGUS events board, pinned events, prompts, holds, aborts, and terminal/event views.

# Operator Workflow

1. Notice a pinned event, event board row, prompt, hold, warning, or abort.
2. Open the event details.
3. Check title, description, related channels, source, file, task loop, and resolution.
4. Respond, acknowledge, release, silence, or delete depending on the event actions.
5. Use related channels or source information to inspect the underlying runtime state.

# Read More

- [Interface ARGUS Events](../Interface/ARGUS%20Events.md)
- [DCode and Scripting](DCode%20and%20Scripting.md)
- [DCode Functions](../DCode/Reference/Functions.md)
- [Communications and Clients](Communications%20and%20Clients.md)
