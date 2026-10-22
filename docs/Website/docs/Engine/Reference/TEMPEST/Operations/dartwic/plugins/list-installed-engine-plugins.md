---
title: dartwic/plugins/list-installed-engine-plugins
summary: Lists installed engine plugins.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Plugins

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `plugins` | `array<EnginePlugin>` | Installed engine-plugin records, including manifest and load-status information. |
