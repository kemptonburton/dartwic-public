---
summary: Install drivers and Interface tools, and understand their update status.
created: 2026-08-03T15:41
updated: 2026-10-29T18:30
---

Plugins are packages that add capabilities to DARTWIC. For example, installing a device driver lets the Engine communicate with that hardware and can add forms for configuring it in the Interface. Other plugins add tools or display elements.

A plugin can have an **Engine side** that performs the work and an **Interface side** that provides its controls, or only one of those. Each side's installation and load status is shown separately.

# Install from the Plugin Browser

Connect to the Engine you want to extend, then open **Settings → Plugins → Browse plugins**.

![Opening the plugin browser from Settings.](../Plugins/_attachments/Pasted%20image%2020261025232743.png)

Search for the driver or tool and select its card. Read the README and minimum host versions, then choose **Install**. The browser selects compatible published packages.

![The selected plugin's README, requirements, and Install button.](../Plugins/_attachments/Pasted%20image%2020261025233048.png)

The Interface side loads immediately. Engine code requires a restart; accept the prompt when you are ready to interrupt running work. After reconnection, check that the sides you need show **Installed** and **Loaded**.

![Restarting the Engine after installing a native plugin.](../Plugins/_attachments/Pasted%20image%2020261025233703.png)

## Install an Unlisted GitHub Plugin

Your team may use a plugin that is published on GitHub but has not been added to the catalog. You can open its repository directly and still review its requirements before installation.

Choose **Open plugin from GitHub** in the catalog toolbar, enter its repository URL, and **Load plugin**. Review its details and install through the same workflow. For manual installation and package requirements, see [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md).

# Installation Status

After installing a driver, you might still be waiting for an Engine restart before its module types become available. The status badges distinguish files that have been installed from code that has loaded and is ready to use. Check each side before configuring its features.

![Installed Engine and Interface sides with load status and registered contributions.](../Getting%20Started/_attachments/Pasted%20image%2020261026225922.png)

| Status | Next step |
| --- | --- |
| Installed · Loaded | Use the registered features. |
| Restart required / queued | Restart the selected Engine to apply the change. |
| Installation incomplete / Load failed | Read the error and check the package or dependencies. |
| Status unavailable | Retry the status request. |

Registration badges identify module/task types, editors, settings, and schematic nodes. A driver still needs [module and task configuration](Modules%20and%20Tasks.md) before it can communicate with a device.

# Plugin Updates and Removal

You can update a plugin when its author publishes fixes or remove it when the installation no longer needs it. A device driver may be used by several projects, so check where it is used before removing it.

Use the update or remove control beside the installed side and read its result. Native changes queue until restart; Interface changes apply immediately. Check which version loaded afterward.

Engine installations share plugins across workspaces. If another Engine locks a file, stop the holder and retry. See [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md#install-from-the-plugin-browser) for installation details.
