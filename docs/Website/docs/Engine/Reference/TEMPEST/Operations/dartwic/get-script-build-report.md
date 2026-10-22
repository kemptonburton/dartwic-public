---
title: "dartwic/get-script-build-report"
summary: "Returns the most recent compiler/build report for one DCode script."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | Required | Project-script-relative path. |

## Response payload

**DCodeBuildReport:** Latest build report directly in the payload: status, compiler output, artifact metadata, and timing. Library load success precedes final binding and activation checks.
