---
title: Navbar, Resources, and Settings
summary: Navigate resources and configure your Interface, connections, and Engine settings.
created: 2026-08-03T15:41
updated: 2026-10-30T15:35
---

This guide covers the controls you use to navigate and configure the Interface:

- **Navbar:** manage the Engine connection and project, find resources, read notifications, and select software versions.
- **Resources:** open or create items from the left sidebar and arrange their tabs.
- **Settings:** change Interface preferences, your user profile, Engine configuration, diagnostics, and plugins.

![](_attachments/Pasted%20image%2020261030151603.png)

# Navbar

The navbar runs across the top of the Interface. Its controls identify the setup you are operating and provide search, notifications, and version information.

## Engine Connection

The node name and connection indicator at the top left identify the connected Engine. Click the name for **Disconnect**, **Restart**, or shutdown controls, where permitted. To connect or create a local workspace, follow [First Session](../Getting%20Started/First%20Session.md#starting-a-local-engine); for a running remote Engine, see [Connecting to an Existing Engine](../Getting%20Started/First%20Session.md#connecting-to-an-existing-engine).

![](_attachments/Pasted%20image%2020261030151649.png)
## Projects

Projects keep separate setups, such as two test stands, within a workspace. Open the selector beside the node to choose one, or use **Create Project** as an administrator. Switching the active project requires an Engine restart. See [Projects](../Engine/Configuration%20and%20Storage.md#projects) for what each setup contains.

![](_attachments/Pasted%20image%2020261030151715.png)

## Searchbar

Click the search box or press **Ctrl+Space** to find and open resources without browsing their sidebar lists.

![](_attachments/Pasted%20image%2020261030151739.png)

## Notifications

The bell opens Interface notifications, including errors and device-discovery suggestions. Read a notification and use its offered actions, or mark notifications read and clear dismissible history. For Engine conditions that need acknowledgement or a response, use [Events](Events%20and%20Logs.md#events).

![](_attachments/Pasted%20image%2020261030151811.png)

## Version Selector

Click the version number at the top right to inspect releases, read notes, and update the Interface or Engine. A yellow download icon marks an available update. See [Updating the Interface and Engine](../Getting%20Started/Overview.md#updating-the-interface-and-engine); Engine updates interrupt running work.

![Version selectors and available releases.](../Getting%20Started/_attachments/Pasted%20image%2020261027191957.png)

# Resources

Resource icons run down the left sidebar. Hover an icon to see its name.

Click a resource icon to open its view or list, then select an item. Right-click a list and choose **Create Resource** where supported. Drag tabs to arrange views; closing one does not stop its tasks or delete files. The [resource guides](Overview.md#resources) links to each resource walkthrough.

![](_attachments/Pasted%20image%2020261030151837.png)

You can also right click the sidebar to show or hide resources.

![](_attachments/Pasted%20image%2020261030151920.png)

And you can drag resource Components (CMP) and drop then in your interface view to arrange tabs. Most things can be dragged and dropped to rearrange the tabs. You need to have one resource view open to do so however.

![](_attachments/Pasted%20image%2020261030152054.png)

## Live Editing and Other Operators

When multiple operators open the same [DCode script](DCode%20Editor.md) or [schematic](Schematics.md), edits appear live in their Interfaces. Colored cursors show where other operators are working; the script editor also highlights their current lines and selections. This helps you coordinate changes while working on the same resource. Saving and activating a script are explained in [Activation and Replacement](DCode%20Editor.md#activation-and-replacement).

![](_attachments/Pasted%20image%2020261030152923.png)

Also works in DCode Scripts:

![](_attachments/Pasted%20image%2020261030153048.png)

Hover over the **people icon** at the bottom right of the editor to see who has the resource open. Click it to hide or show other operators' cursors and line markers across all shared resources in this Interface. The choice is remembered when you reopen the Interface. You can also change it under **Settings → Interface → Shared Resources**. Live edits continue to synchronize while the markers are hidden.

![](_attachments/Pasted%20image%2020261030152848.png)
# Settings

You can open Settings **before connecting** using the connection screen's top-right gear, or use the sidebar gear once connected. Select a category on the left; Engine-specific pages require a connection.

![](_attachments/Pasted%20image%2020261030153127.png)
## General

Check versions, Engine time, and license information, or open Docs, bug reports, and feedback. See [Updates](../Getting%20Started/Overview.md#updates) and [Licensing and Tiers](../Getting%20Started/Compatibility%2C%20Licensing%2C%20and%20Tiers.md#licensing-and-tiers).

![](_attachments/Pasted%20image%2020261030153321.png)
## Interface

Change appearance, shared-resource operator markers, local Engine/workspace folders, and network discovery. See [Interface Setup](../Getting%20Started/First%20Session.md#configuring-the-interface) and [Discovery](../Engine/Networking%20and%20Peers.md#discovery).

![](_attachments/Pasted%20image%2020261030153307.png)

## User

Edit your username, display name, role, and picture. This profile identifies the operator; it does not grant administrator access. See [User Profile Setup](../Getting%20Started/First%20Session.md#configuring-the-interface).

![](_attachments/Pasted%20image%2020261030153342.png)

## Engine

Configure the connected Engine's identity, access, startup, and recording settings. Fields save on Enter or when you leave them; switches save immediately. Check **Restart required** indicators. See [Instance Configuration](../Engine/Configuration%20and%20Storage.md#instance-configuration) and [Recording and Telemetry](../Engine/Recording%20and%20Telemetry.md).

![](_attachments/Pasted%20image%2020261030153417.png)

## Diagnostics

Inspect software health, timing, recording progress, and warning settings. Expand a row for measurements and graphs; follow [Diagnostics and Troubleshooting](../Engine/Diagnostics%20and%20Troubleshooting.md) to interpret them.

![](_attachments/Pasted%20image%2020261030153438.png)
## Plugins

Browse, install, update, remove, and configure extensions. Follow the [Plugins walkthrough](Plugins.md) for installation and status details.

![](_attachments/Pasted%20image%2020261030153501.png)