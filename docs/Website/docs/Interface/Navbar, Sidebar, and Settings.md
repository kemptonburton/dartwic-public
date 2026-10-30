---
summary: Navigate resources and configure your Interface, connections, and Engine settings.
created: 2026-08-03T15:41
updated: 2026-10-29T18:27
---

The top bar identifies your Engine node and active project. The left sidebar opens resource lists and views; Settings controls the Interface and connected Engine.

# Workspaces and Projects

You might keep separate projects for two test stands, each with its own scripts, device configuration, and displays. A workspace is the folder that keeps those projects and their shared resources together. Choosing the project tells the Interface which setup you want to work on.

Check the node at the top left, then choose the project beside it. The project's Scripts, Modules, and Schematics appear in their sidebar sections.

![The project selector beside the connected node.](../Engine/_attachments/Pasted%20image%2020261027192747.png)

Click a resource to open it, or use **Ctrl+Space** to search. Right-click a resource list and choose **Create Resource** to add one. Drag tabs to arrange related views; closing a tab does not stop tasks or delete files.

For workspace, project, and instance relationships, see [Configuration and Storage](../Engine/Configuration%20and%20Storage.md).

# Interface Preferences

Open the gear icon for Settings. **Interface** contains appearance, local Engine/workspace folders, and network discovery; **User** contains your username and display profile. A profile describes the operator; it does not grant administrator access.

![The Settings gear at the bottom of the sidebar.](../Getting%20Started/_attachments/Pasted%20image%2020261024191820.png)

Discovery helps find Engines on the local network. If it cannot find yours, enter its host and base port manually. See [Discovery](../Engine/Networking%20and%20Peers.md#discovery) for ports and network setup.

# Instance Configuration

An Engine needs settings such as its node name, network address, and who may connect. These belong to its **instance**, the saved setup used to launch that Engine. Edit them here when you need to change how the Engine starts or accepts connections.

While connected, open **Settings → Engine**. Text saves on Enter or when you leave a field; switches save immediately. Check errors and **Restart required** indicators before continuing.

![Connected Engine configuration, including identity and access settings.](../Getting%20Started/_attachments/Pasted%20image%2020261024193411.png)

For a managed local Engine before connection, use **Edit engine → Engine config settings**. This editor keeps a draft until you click its footer **Save**. Changes apply on the next Engine start. [Instance Configuration](../Engine/Configuration%20and%20Storage.md#instance-configuration) explains the settings and restart behavior.

# Software Updates

Click the version number at the top right or open **Settings → General**. Select an Interface or Engine release, read its notes, and review the update confirmation. A yellow download icon marks an available update.

![Version selectors and available releases.](../Getting%20Started/_attachments/Pasted%20image%2020261027191957.png)

An Engine update interrupts running work. Follow [Updating the Interface and Engine](../Getting%20Started/Overview.md#updating-the-interface-and-engine) for the full workflow. The version menu and General settings also open Docs, bug reports, and feedback.

# Diagnostics

If a graph stops receiving measurements or a task seems slow, diagnostics help you investigate the cause. They show measurements of the software itself, such as CPU use, task timing, and recording progress, with warnings for conditions that need attention.

Open **Settings → Diagnostics** and expand a row for measurements, graphs, and warning settings. Engine warnings link here from event details; the top-right bell opens Interface notifications and device-discovery suggestions.

![Diagnostic groups with measurements and history graphs.](../Engine/_attachments/Pasted%20image%2020261028190944.png)

See [Diagnostic Rows and Warnings](../Engine/Diagnostics%20and%20Troubleshooting.md#diagnostic-rows-and-warnings) for interpretation. To export recorded diagnostic channels, use [Telemetry](Telemetry%20Graphs.md#saved-ranges-and-exports).

# Disconnect or Remove a Saved Node

Use **Disconnect** in the node menu to stop reconnection. Removing a remote login entry only forgets it; deleting a managed local node removes its instance configuration and recordings. Stop the local Engine and review the path first. See [Instance Removal](../Engine/Configuration%20and%20Storage.md#instance-removal).
