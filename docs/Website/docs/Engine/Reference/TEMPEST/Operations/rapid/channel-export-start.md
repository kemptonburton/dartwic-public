---
title: "rapid/channel-export-start"
summary: "Starts a client-owned background CSV export of raw channel samples."
---

- **Category:** Channels and Persistence

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `series` | `array<string>` | Required | Channel keys or channel-field paths to export; at least one non-empty string is required. |
| `from` | `integer` | Optional | Inclusive Unix-epoch start time. Millisecond, microsecond, and nanosecond values are normalized by magnitude; `x_from` is an alias. |
| `x_from` | `integer` | Optional | Alias for `from`. |
| `to` | `integer` | Optional | Inclusive Unix-epoch end time. Millisecond, microsecond, and nanosecond values are normalized by magnitude; `x_to` is an alias. |
| `x_to` | `integer` | Optional | Alias for `to`. |
| `columns` | `array<ExportColumn>` | Optional | Optional display labels. Each item uses `channelPath` and `columnLabel`. |

## Response payload

**DetachedJob:** A detached-job descriptor. On completion, `result` contains `row_count`, `file_name`, server-local `local_output_path`, and a client-facing `download_url`.

## Errors

- No series is supplied, a channel is invalid, export or temporary storage cannot be written, history is reclaimed during a RapidLog read, or the export is canceled.
