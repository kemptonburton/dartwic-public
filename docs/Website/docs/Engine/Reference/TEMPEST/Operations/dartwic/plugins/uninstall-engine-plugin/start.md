---
title: "dartwic/plugins/uninstall-engine-plugin/start"
summary: "Starts a detached engine plugin removal job."
---

- **Category:** Plugins

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Required | Stable plugin package ID to remove. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result` is a `PluginUninstallResult`.
