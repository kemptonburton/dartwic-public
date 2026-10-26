---
title: dartwic/engine/save-config
summary: Saves administrator settings for the next restart. Node identity stays in workspace.json.
created: 2026-10-04T18:31
updated: 2026-10-26T13:07
---

- **Category:** Engine Runtime

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `settings` | `object` | Required | Changed node_name, server_ip, server_port, server_admin_password, license_key, allow_viewers, enable_network_discovery or network_discovery_port. Changes apply after restart; an empty license_key removes the key. Credentials are write-only. |
| `revision` | `string` | Required | Revision from get-config, for concurrent edit protection. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `saved` | `object` | Sanitized saved configuration. |
| `restart_required` | `array` | Fields awaiting restart. |
| `revision` | `string` | Updated configuration revision. |
