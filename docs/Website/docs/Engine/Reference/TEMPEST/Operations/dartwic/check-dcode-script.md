---
title: dartwic/check-dcode-script
summary: Checks DCode script.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `filePath` | `string` | Optional | Display path used in diagnostics; defaults to `<string>` and cannot contain `..`. |
| `content` | `string` | Optional | DCode source to validate; defaults to an empty string. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `diagnostics` | `array<DCodeDiagnostic>` | Shared parser and placement diagnostics, then Lua/import or Native C++ code-generation diagnostics according to the file's configured execution_mode. Does not invoke the C++ compiler. Each diagnostic includes its source location, severity, message, and diagnostic source. |
