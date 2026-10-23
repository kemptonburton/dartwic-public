---
title: "dartwic/plugins/install-engine-plugin"
summary: "Installs an Engine plugin package's files without loading native code into the running Engine. A replacement is staged for restart."
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

**PluginInstallResult:** Installation result containing `plugin_id`, `plugins_dir`, installed `plugins`, `platform_key`, restart/queue flags, `installed_inventory` reread from the destination and runtime, and a human-readable `message`. Completion establishes files or a queued replacement, not loaded code.

## Errors

- The plugin ID or a usable download is missing, licensing rejects the install, the archive is invalid, or installation fails.
