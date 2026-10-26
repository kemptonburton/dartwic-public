---
title: dartwic/engine/get-config
summary: Reads running and saved engine settings without exposing credential values.
created: 2026-10-04T18:31
updated: 2026-10-26T13:19
---

- **Category:** Engine Runtime

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `running` | `object` | Settings in use by this process. |
| `saved` | `object` | Next-start settings with password_configured and license_configured presence flags; no credential values. |
| `restart_required` | `array` | Fields awaiting restart. |
| `revision` | `string` | Revision required when saving changes. |
