---
title: "dartwic/updates/status"
summary: "Returns the persistent engine update state, including any staged release."
---

- **Category:** Engine Updates

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `state` | `string` | Update lifecycle state. |
| `error` | `string` | Failure details; rollback means the selected Engine reconnected with its previous files. |
| `locked` | `boolean` | A replacement target was still locked after the selected Engine stopped. |
| `failedPath` | `string` | The file that could not be replaced, when known. |
| `recovered` | `boolean` | Whether the previous Engine passed its reconnect health check. |
