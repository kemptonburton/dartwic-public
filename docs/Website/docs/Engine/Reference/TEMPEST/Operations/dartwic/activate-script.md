---
title: "dartwic/activate-script"
summary: "Activates script."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | Required | Project-script-relative path to activate. Parent-directory traversal is rejected. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result.status` is `success`.

## Errors

- The path is invalid, the server is shutting down, or compilation/activation fails.
