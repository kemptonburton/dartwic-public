---
title: dartwic/engine/get-config
summary: Reads running and saved engine settings without exposing passwords.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Engine Runtime

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `running` | `object` | Settings in use by this process. |
| `saved` | `object` | Settings that apply on the next restart. |
| `restart_required` | `array` | Fields awaiting restart. |
| `revision` | `string` | Revision required when saving changes. |
