---
title: dartwic/plugins/list-installed-engine-plugin-groups
summary: Lists installed engine plugin groups.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Plugins

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `plugins` | `array<EnginePluginGroup>` | Installed plugins grouped by package, including contained engine plugins and their statuses. |
