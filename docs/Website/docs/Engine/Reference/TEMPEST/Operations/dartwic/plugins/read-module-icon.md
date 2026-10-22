---
title: dartwic/plugins/read-module-icon
summary: Reads an installed plugin module icon as a data URL.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Plugins

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Required | Installed plugin that owns the module configuration. |
| `config_path` | `string` | Required | Plugin-relative module configuration path used to authorize the lookup. |
| `icon_path` | `string` | Required | Engine-configuration-relative icon path. Absolute paths and paths escaping the configuration root are rejected. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `data_url` | `string` | Base64 data URL using the icon's supported image MIME type. |

## Errors

- Required fields are missing, the plugin is not installed, a path escapes its allowed root, the icon is missing, or its format is unsupported.
