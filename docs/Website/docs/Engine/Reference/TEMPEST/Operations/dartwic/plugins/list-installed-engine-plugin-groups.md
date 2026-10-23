---
title: "dartwic/plugins/list-installed-engine-plugin-groups"
summary: "Reads installed Engine plugin files and the current Engine's loaded-plugin registry separately.\nA complete destination manifest and native binary establish installation; loading is observed only in this process.\nQueued updates/removals keep the current installed and loaded versions until restart."
---

- **Category:** Plugins

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `plugins` | `array<EnginePluginGroup>` | Installed packages with engine_installed, engine_files_exist, engine_loaded_in_process, installed version, loaded_version, pending_version, queue flags, and restart requirement. |
| `change_failures` | `array<object>` | Durable failed restart changes, including operation, error, failed_path, locked, and restored when known. A failed status request is an error, not an empty inventory. |
