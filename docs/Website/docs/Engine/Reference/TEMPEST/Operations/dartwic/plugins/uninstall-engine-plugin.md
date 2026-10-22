---
title: "dartwic/plugins/uninstall-engine-plugin"
summary: "Uninstalls an engine plugin package."
---

- **Category:** Plugins

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Required | Stable plugin package ID to remove. |

## Response payload

**PluginUninstallResult:** Removal result containing `plugin_id`, `removed`, queue/restart flags, `removed_plugins`, and a human-readable `message`.

## Errors

- The plugin ID is missing or removal fails.
