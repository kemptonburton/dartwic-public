---
summary: Navigate projects, resource tabs, and the context panel.
updated: 2026-10-23T17:49
status: coming-soon
created: 2026-09-06T14:39
---

A project is the engine's collection of scripts, schematics, module configurations, and other files. The project selector in the top bar shows which one is active. Switching projects changes engine context, so choose the project before opening or editing its resources.

Set your username in **Settings > User**. All administrator connections use that profile name on desktop and web; connection forms only save the engine address and credentials. If no username is configured, connecting opens User settings.

## Add a local workspace

The installation keeps the app in `interface/`, engine binaries and shared plugins in `engine/`, and authored workspaces in `workspaces/`. Each workspace contains `workspace.json`, optional shared `assets/`, and project folders containing `project.json`.

Workspaces placed directly inside the configured **Workspace folder** appear under **Local workspaces** on the connection screen. Use the refresh button after adding a folder. Select **Set up**, or use **Add workspace** to browse to a workspace elsewhere. Discovery does not create configuration or launch an engine.

Choose a project and enter an administrator password, or leave it blank to generate one locally. **Engine settings** contains the optional node name, address, port and license key, plus the read-only Engine folder selected in **Interface** settings. All local nodes launch with that configured Engine. Existing instances reuse their saved configuration and data. Add the workspace, then use its start control. The startup console shows Engine output and offers **Open workspace** when the engine is reachable.

**Start engine** launches directly without installing plugins or waiting for the registry. The workspace plugin list shows installed versions separately from the versions recorded in the workspace. Complete installed plugins are kept by default, including versions newer than published registry releases. Missing plugins offer the newest published release that supports the local host and platform; choose another listed version or **Skip installation**, then use **Install plugins** as a separate action. An unavailable release stays visible and does not block other selected installations or Engine startup. Missing plugins or project resources can leave workspace features unavailable; inspect the Engine's output. Plugin changes affect the shared installation, and locked files can prevent replacement.

Each plugin has one row showing whether its Engine and Interface components are installed. Its searchable version picker lists each version once: **v2.0.0 · Installed** keeps a complete installation, and **v2.0.0 · Patch** fills missing components at that version. Selecting a different version changes both components together. Only versions available for all required components are offered. Use **Install plugins** to apply the selections, or skip changes and start the Engine directly. Plugin names open their repositories.

The trash button on a registered local node deletes its instance folder, including local configuration, recordings and cache. The confirmation shows the folder when available. Stop the local engine first: Edit and Delete are disabled while it is running, and confirmation checks its status again. Workspace files and shared engine binaries/plugins are kept. Deletion removes the saved connection only after folder removal succeeds, so a status or file error leaves the node available for retry. A workspace that remains in the discovery folder can still appear under **Local workspaces** and be set up again with a fresh instance. Remote entries stay editable, and their trash button only forgets the saved connection.

Multiple workspace engines share the Engine installation selected in Interface settings. New configurations live under `engine/instances/<instance>/config.json`; each instance selects its workspace and uses a separate port range. Changing the configured Engine affects subsequent local starts, including existing nodes. Their instance folders and recordings stay at their original locations. Local node Restart controls switch a running older installation to the configured one. A workspace already running in another managed engine cannot be launched again through the Interface.

Local engine controls work from the connection screen before you connect. The Interface checks availability and uses saved administrator credentials to confirm the local instance and load its version, node and project details. Start is available when the instance is stopped; a verified running instance offers Stop and Restart. Checking these details leaves the Interface disconnected. If the saved credentials are invalid, it still shows online availability but cannot confirm authenticated controls.

After registering an engine, its login-page edit icon opens **Edit engine**. Stop a local instance before opening this editor. The **Connection settings** tab edits the saved endpoint and credentials. Registered local engines also have an **Engine config settings** tab for local startup configuration. Startup settings save automatically for the next start. Connected settings mark fields that need a restart and retain the running connection until restarted. [Settings](Settings.md#local-startup-configuration) describes the available fields.

Start the engine in a terminal; on Windows, double-clicking its console executable opens one. The engine itself prints a numbered list of instances and their paired workspace/node names. Enter a number to continue startup in that same process, or `Q` to quit. Entries with unreadable configuration/workspace metadata or missing workspace directories are marked in the list and cannot be selected. The engine validates the remaining startup settings after selection. Interface launches set `DARTWIC_CONFIG_DIR` explicitly and skip the menu. Unattended launches without that override retain `engine/instances/default/config.json` as their default.

## Open a resource

Choose a type in the left navigation, then select a resource in its list. Channels, Data, Telemetry, Tasks, Network Map, and Events provide runtime views. **Data** contains dataframes and the recorded channel, event, and log databases. Schematics, scripts, and module configuration also have project files behind them. Plugins can add more types.

Use the resource list's search and folders to find a file. **Ctrl+Space** opens global search. Resources open in tabs, and the workspace can show multiple panels side by side. Closing a resource tab closes that view; it does not stop the task or remove the underlying file.

The combined resource browser keeps its rows and counts visible during routine
refreshes. Channel additions and removals update in place. If one section cannot
refresh, its last successful contents remain visible alongside the refresh error.

Resource links label the opened tab with the selected resource's name. The tab tooltip and **Copy full path** use the complete resource path, such as `modules/devices/device.json`, without adding the title as another directory. A task's module button opens that module's saved configuration, including nested paths. An existing file tab is reused only for that same file; opening another module, script, or schematic keeps the first file open. Reopening a script declaration also moves an already-open editor to that line.

## Project actions and references

The Project panel lists the steps for channel cleanup, renaming, and task or module deletion. Select a step to inspect its resources and channel checks. Each resource pane has its own **Open resource** button, including a separate button for an adjacent DCode or configuration file.

The action button starts the listed steps directly, including manual authority overrides shown in the checks. There is no separate review checkbox. Unresolved blockers keep the button disabled and appear beside it; viewer access cannot start actions. Channel cleanup still uses row checkboxes to select which channels to delete.

## Inspect the selection

Open the **context panel** to see properties for a selected channel, schematic node, resource, or other supported item. The available controls follow the selection. For example, a channel exposes metadata and authority, while a schematic node exposes its channel bindings, appearance, and behavior.

| You want to change… | Use… |
| --- | --- |
| A live task's running, hold, or frequency state | [Task controls](Managing%20Tasks.md). |
| A device connection or driver parameters | Its [module configuration](../Engine/Modules.md). |
| A layout or live dashboard | The [schematic editor](Schematics.md). |
| Interface appearance | [Settings](Settings.md). |
| Reusable runtime logic | A [DCode script](../DCode/Getting%20Started.md). |

## Sharing a workspace

Track the complete workspace so its projects retain their shared settings and assets when cloned to another computer. [Tracking a Project in GitHub](../Getting%20Started/Tracking%20a%20Project%20in%20GitHub.md) explains which configuration files travel with it and where the engine stores recordings and local settings.

Engine-backed resources can synchronize between connected interfaces. Local tab arrangement and interface preferences belong to the interface host. When editing a shared file, check the resource's save or synchronization state before leaving it. A remote view or presence indicator is separate from [TEMPEST peer channel transport](../Engine/TEMPEST%20Peers.md).

Track the complete workspace, including shared `assets/`, `settings.json`, and `client_info.json`, to carry client profiles, notification preferences, recording policy, and authored assets alongside the individual projects. Engine settings remain in the selected local instance's `engine/instances/<instance-id>/config.json`. Project TEMPEST peer endpoints travel with configuration; secret values are supplied locally.

## Viewer access

Choose **Connect as viewer** on the connection dialog to inspect an engine without a username or administrator password. The engine must have viewer access enabled. Viewers can search channels, inspect tasks and callback declarations, open schematics, and read permitted history. Callback invocation remains restricted to administrator connections. Command, edit, and engine-management controls are disabled; the server also rejects those operations.
