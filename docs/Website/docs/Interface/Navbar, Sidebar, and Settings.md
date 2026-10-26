---
summary: Navigate resources and configure your Interface, connections, and Engine settings.
created: 2026-08-03T15:41
updated: 2026-10-26T13:19
---

The top bar identifies your connected node and active project. The sidebar opens resource types and supporting panels. Resources open in tabs that you can arrange for your work.

# Navigate your workspace

Select the project before opening or editing its resources. Use **Ctrl+Space** for global search, or use the resource list's search and folders. Source links open the saved file and declaration line when available. Closing a tab does not stop its task or delete its file.

Right-click a folder in the resource tree to delete it when it is empty. A resource group can be deleted when it contains only its own resource file and empty subfolders. Folders and resource groups delete directly from the tree; module files keep their separate Project Actions deletion flow. The Engine refuses deletion if any other file or link is present, including one hidden by the current resource filter.

For panels beside your tabs, see [Node, Context, and Project Board](Node%2C%20Context%2C%20and%20Project%20Board.md). For installation, workspace creation, and the first connection, use [First Session](../Getting%20Started/First%20Session.md).

# Open settings

Choose the gear icon. Available settings depend on your connection and installed plugins.

| Page | Purpose |
| --- | --- |
| General | Versions, license information, runtime metadata, and application information. |
| Interface | Appearance, local Engine/workspace folders, and network discovery. |
| User | Your preferred username and display profile. |
| Engine | Node identity, access/connection settings, and history cleanup. |
| Diagnostics | Measurements, warning controls, and local clock checks. |
| Plugins | Installed extensions and their contributed settings. |

Warnings identify a failed save, unavailable information, or a change awaiting restart. Open the affected field for its explanation. The version menu uses a yellow download icon when an Interface or Engine update is available.

# User profile and viewer access

Set your username and optional display name, avatar, category, and role label under **User**. Profile labels describe you; they do not grant permissions. Local changes save immediately, with Engine synchronization reported separately.

If an administrator connection needs a username, **Choose a username** saves it and resumes connecting. A different profile on the Engine opens a comparison: choose **USE ENGINE PROFILE** or **USE INTERFACE PROFILE**, or cancel the connection. Changing the preferred username applies on your next connection.

**Connect as viewer** permits supported read-only views when the Engine allows it. Viewers cannot command equipment, invoke callbacks, edit resources, or manage Engine settings. Local appearance and clock-warning preferences remain available.

# Save and apply changes

| Change | When it applies |
| --- | --- |
| Interface preferences | Saved locally as you edit. Desktop uses this installation's `.dartwic` data; web preferences use the browser's storage for the site. |
| Default engine / Workspace folder | Choose folders with their buttons; displayed paths are read-only. The Engine selection is used for subsequent local starts. |
| Connected Engine settings | Text inputs save on Enter or when you leave the field; switches save immediately. Fields identify saved changes requiring restart. After a local port, bind IP, or admin password change, restarting returns to the login screen so you can connect to the updated endpoint. Other local restarts reconnect normally. |
| History cleanup | Saved workspace defaults or project overrides; zero leaves an age/size limit unrestricted. |

The selected local executable's version and the connected Engine's version can differ. **Version unavailable** means the selected executable has no readable verified version evidence; hover for the cause. It does not prevent starting it.

Local node **Edit engine → Engine config settings** also edits startup settings before connection. Password and license fields are write-only: leaving them blank retains saved values; the license removal switch clears the key. Closing flushes pending edits, without restarting the Engine automatically. Host-side web controls require a browser on the Interface host.

Use a module editor for device parameters and task controls for running state. See [Configuration and Storage](../Engine/Configuration%20and%20Storage.md) for ownership, instance paths, and restart behavior.

# TEMPEST network discovery

Under **Interface**, enable automatic discovery and choose up to 16 comma-separated UDP query ports; the default is `47600`. Changes apply locally and immediately. Under **Engine**, discovery enable/port changes apply after restart. The normal connection base port is separate.

Discovery searches active IPv4 adapters and localhost. It can be blocked by network policy; enter the host and base port manually when needed. Authentication and compatibility checks still apply.

# Diagnostics and warnings

Open **Diagnostics** and expand a measurement for its graph and supporting evidence. Configure warnings with **Above**, **Below**, or **Outside range**; boundary values remain within the allowed range. Switches save immediately, numeric limits after editing pauses or the popup closes. Invalid limits stay unsaved.

Condition rows distinguish **Firing**, **Not firing**, **Unavailable**, and **Recorded event**. Their **Events** switch controls new warnings without removing measurements or history. Acknowledgement records that you saw a warning; recovery follows its condition. Internal CAESAR warnings default off, custom DCode/plugin runtime warnings on.

**Local Interface** estimates Engine-minus-Interface clock offset, with round-trip time and uncertainty. It cannot identify which clock is correct. Local issues appear in Notifications; Engine conditions appear in Events. See [Diagnostics and Troubleshooting](../Engine/Diagnostics%20and%20Troubleshooting.md) to interpret the evidence.

# Disconnect or remove a saved node

Disconnect returns to the chooser and stops reconnection. A network interruption in an open session attempts recovery; reloading attempts that active connection once. Closing and reopening starts disconnected.

Deleting a saved **local** node removes its Engine instance folder, including configuration, recordings, and caches. Review the displayed folder and stop its Engine first. Workspace files and shared binaries/plugins are kept. A failed removal remains available for retry. Removing a **remote** entry only forgets the saved connection.
