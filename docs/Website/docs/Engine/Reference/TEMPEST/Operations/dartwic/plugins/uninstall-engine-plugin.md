---
title: "dartwic/plugins/uninstall-engine-plugin"
summary: "Queues removal of an Engine plugin package. Installed files and loaded code remain until restart."
---

- **Category:** Plugins

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Required | Stable plugin package ID to remove. |

## Response payload

**PluginUninstallResult:** Removal result containing `plugin_id`, `removed`, queue/restart flags, `removed_plugins`, `installed_inventory` observed after queuing, and a human-readable `message`.

## Errors

- The plugin ID is missing or removal fails.
