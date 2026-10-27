---
summary: Install drivers and Interface tools, and understand their update status.
created: 2026-08-03T15:41
updated: 2026-10-26T21:52
---

Plugins add drivers, task types, editors, schematic nodes, and other tools. Open **Settings → Plugins** to inspect installed extensions or browse new ones.

![Settings lists the installed engine and interface sides separately.](../_attachments/plugins.jpg)

A plugin can have an **Engine side**, an **Interface side**, or both. A driver needs its Engine code loaded; a custom editor needs its Interface bundle in the current host.

# Install a plugin

1. Connect to the Engine you intend to extend.
2. Browse or search for a plugin and read its README, release version, and minimum host versions.
3. Choose **Install** and inspect the result for each side.
4. Restart the selected Engine when offered to load native code. The Interface side loads immediately.

The browser selects compatible published releases. A source repository or platform badge alone does not establish that a compatible package is available. **Open plugin from GitHub** previews an unlisted repository through the same checks.

# Installation status

| Status | What to do |
| --- | --- |
| Installed · Loaded | Use the contributions registered by that host. |
| Installed · Not loaded · Restart required | Restart the selected Engine when ready. |
| Update or removal queued | The existing Engine code continues running until restart applies the change. |
| Installation incomplete | Read the missing-file error and reinstall that side. |
| Load failed | Read the runtime error and check manifest/dependencies. |
| Status unavailable | Retry the status request; unavailable evidence does not establish missing files. |
| Unmanaged | Installed outside the browser; inspect its version and layout before changing it. |

Installed, loaded, and queued versions can differ. Plugin settings that call Engine operations become available after that Engine side loads. Catalog availability warnings are separate from installation errors.

# Plugin updates and removal

Engine installations share their plugin directory across workspaces. Updates and removals queue while native code is running, then apply when the selected Engine restarts. If another Engine holds a native file, the selected Engine returns with its previous plugin and reports the locked path. Stop the Engine holding it and explicitly retry.

Interface changes apply immediately. Replacements are staged and validated before swapping files; a failed replacement retains or restores the previous version. Interface-only changes do not request an Engine restart. Cancelling a queued Engine replacement keeps the existing installation.

Workspace setup retains installed versions by default. Recorded dependency versions do not force a downgrade or block startup; installation still checks host compatibility.

# Plugin contributions

| Contribution | Next step |
| --- | --- |
| Module or task type | Configure it in [Modules and Tasks](Modules%20and%20Tasks.md). |
| Resource or editor | Open it from resource navigation. |
| Schematic node | Add it from the [node palette](Schematics.md). |
| Settings | Open that plugin's settings page. |

Installing a driver does not configure or connect every device. Follow its documentation for parameters, mappings, and timing. Contribution badges describe registered features, not device readiness.

For manual installation paths and package layout, see [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md#install-locally-during-development). To build an extension, start with [Plugin Development](../Plugins/Overview.md).
