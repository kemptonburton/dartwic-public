---
summary: Navigate projects, resource tabs, and the context panel.
updated: 2026-10-21T22:19
status: coming-soon
created: 2026-09-06T14:39
---

A project is the engine's collection of scripts, schematics, module configurations, and other files. The project selector in the top bar shows which one is active. Switching projects changes engine context, so choose the project before opening or editing its resources.

Set your username in **Settings > User**. All administrator connections use that profile name on desktop and web; connection forms only save the engine address and credentials. If no username is configured, connecting opens User settings.

## Add a local workspace

The installation keeps the app in `interface/`, engine binaries and shared plugins in `engine/`, and authored workspaces in `workspaces/`. Each workspace contains `workspace.json`, optional `global_data/`, and project folders containing `project.json`.

Workspaces placed directly inside the configured **Workspace folder** appear under **Local workspaces** on the connection screen. Use the refresh button after adding a folder. Select **Set up**, or use **Add workspace** to browse to a workspace elsewhere. Discovery does not create configuration or launch an engine.

Choose a project and enter an administrator password, or leave it blank to generate one locally. **Engine settings** contains the optional node name, address, port, license key, and engine installation override. Existing instances reuse their saved configuration. Add the workspace, then use its start control. The startup console installs missing declared plugins when enabled, shows engine output, and offers **Open workspace** when the engine is reachable.

The trash button on a registered local node deletes its instance folder, including local configuration, recordings and cache. The confirmation shows the folder when available. A running engine is stopped first; deletion waits for its process to exit. Workspace files and shared engine binaries/plugins are kept. Deletion removes the saved connection only after folder removal succeeds, so a failed stop or file operation leaves the node available for retry. A workspace that remains in the discovery folder can still appear under **Local workspaces** and be set up again with a fresh instance. Remote nodes only forget the saved connection.

Multiple workspace engines can share one installation. Their configurations live under `engine/instances/<instance>/config.json`; each instance selects its workspace and uses a separate port range. Different workspaces can select different engine installations. A workspace already running in another managed engine cannot be launched again through the Interface.

After registering an engine, its login-page edit icon opens **Edit engine**. The **Connection settings** tab edits the saved endpoint and credentials. Registered local engines also have an **Engine config settings** tab for local startup configuration. Save changes for the next start; a running engine shows a restart-needed notice and keeps its current connection until restarted. [Settings](Settings.md#local-startup-configuration) describes the available fields.

Start the engine in a terminal; on Windows, double-clicking its console executable opens one. The engine itself prints a numbered list of instances and their paired workspace/node names. Enter a number to continue startup in that same process, or `Q` to quit. Entries with unreadable configuration/workspace metadata or missing workspace directories are marked in the list and cannot be selected. The engine validates the remaining startup settings after selection. Interface launches set `DARTWIC_CONFIG_DIR` explicitly and skip the menu. Unattended launches without that override retain `engine/instances/default/config.json` as their default.

## Open a resource

Choose a type in the left navigation, then select a resource in its list. Channels, Data, Telemetry, Tasks, Network Map, and Events provide runtime views. **Data** contains dataframes and the recorded channel, event, and log databases. Schematics, scripts, and module configuration also have project files behind them. Plugins can add more types.

Use the resource list's search and folders to find a file. **Ctrl+Space** opens global search. Resources open in tabs, and the workspace can show multiple panels side by side. Closing a resource tab closes that view; it does not stop the task or remove the underlying file.

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

Track the complete workspace, including `global_data`, to carry client profiles, notification preferences, recording policy, and authored assets alongside the individual projects. Engine settings remain in the selected local instance's `engine/instances/<instance-id>/config.json`. Project TEMPEST peer endpoints travel with configuration; secret values are supplied locally.

## Viewer access

Choose **Connect as viewer** on the connection dialog to inspect an engine without a username or administrator password. The engine must have viewer access enabled. Viewers can search channels, inspect tasks and callback declarations, open schematics, and read permitted history. Callback invocation remains restricted to administrator connections. Command, edit, and engine-management controls are disabled; the server also rejects those operations.
