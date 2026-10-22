---
title: dartwic/unwatch-runtime-loops
summary: Stops a runtime-loop feed for the requesting view.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** Tasks

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `watch_id` | `string` | Required | Previously registered view ID. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `watching` | `boolean` | False after removal. |
