---
title: dartwic/get-dcode-api-autocomplete
summary: Returns DCode API autocomplete.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** DCode

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `catalogVersion` | `integer` | Schema version for the completion catalog. |
| `features` | `array<DCodeFeature>` | Complete static feature catalog plus dynamically registered plugin functions. |
| `symbols` | `array<DCodeFeature>` | Autocomplete-visible subset, including category, contexts, snippet, signature, and documentation metadata. |
