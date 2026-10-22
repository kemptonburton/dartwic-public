---
title: "dartwic/subscribe-dcode-execution-lines"
summary: "Begins a live execution-line feed for one script and returns its initial snapshot."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `script_path` | `string` | Required | Script path to track. |
| `subscription_id` | `string` | Required | Unique ID for this editor view. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `script_path` | `string` | Tracked script path. |
| `subscription_id` | `string` | Active subscription ID. |
| `execution_lines` | `object` | Initial execution-line snapshot. |
| `revision` | `integer` | Subscription revision used to discard late snapshots. |
