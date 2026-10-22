---
title: dartwic/get-dcode-callbacks
summary: Lists externally callable DCode declarations.
created: 2026-10-20T18:59
updated: 2026-10-20T18:59
---

- **Category:** DCode

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `callbacks` | `array<object>` | Active callbacks with name, arguments, script_path, line_number, source_hash and execution_mode. |
