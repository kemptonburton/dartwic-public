---
title: dartwic/plugins/get-discovered-devices
summary: Lists devices announced by engine plugins.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Plugins and Modules

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `devices` | `array<object>` | Candidates with plugin_id, discovery_id, device_type, display_name, endpoint, schema_version, last_seen_unix_ms, and UI request/notification identity when available. |
