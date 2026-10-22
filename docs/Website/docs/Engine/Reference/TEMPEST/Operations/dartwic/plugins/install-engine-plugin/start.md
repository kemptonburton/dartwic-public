---
title: "dartwic/plugins/install-engine-plugin/start"
summary: "Starts a detached engine plugin installation job."
---

- **Category:** Plugins

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `plugin_id` | `string` | Required | Stable plugin package ID. |
| `plugin_url` | `string` | Optional | Native ZIP URL named plugin-win32-x64.zip or plugin-linux-x64.zip matching this Engine; plugin.zip is allowed only when plugin_manifest explicitly declares Interface-only. Required when `downloads` is omitted. |
| `downloads` | `object` | Optional | URLs keyed by win32-x64 and/or linux-x64, each ending in plugin-<platform>.zip. An any URL ending in plugin.zip is accepted only when plugin_manifest explicitly declares Interface-only. Native generic archives and cross-platform fallback are rejected. |
| `plugin_manifest` | `object` | Optional | Package manifest used to validate contents and licensing. |

## Response payload

**DetachedJob:** A detached-job descriptor. Its completed `result` is a `PluginInstallResult`.
