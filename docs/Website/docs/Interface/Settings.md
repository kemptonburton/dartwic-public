---
summary: Configure the interface, engine connection, history retention, diagnostics, and plugins.
updated: 2026-10-23T00:24
status: coming-soon
created: 2026-08-03T15:41
---

Open the gear icon in the left navigation to open **Settings**. The available pages depend on whether the interface is connected and which plugins are installed.

| Page | What it controls |
| --- | --- |
| General | Runtime metadata, versions, license information, and application information. |
| Interface | Appearance, the default engine installation, and the workspace discovery folder, and TEMPEST network discovery. |
| User | Username for all engine connections and profile presentation defaults. |
| Engine | Workspace node name, TEMPEST connection and discovery, access settings, and history cleanup limits. |
| Diagnostics | Live engine measurements, warning rules, and local interface clock checks. |
| Plugins | Installation status and settings panels supplied by plugins. |

Select a plugin to inspect its installation, version, and contributed settings. A manually installed plugin can appear as unmanaged. See [Plugins](Plugins.md).

## User profile

If your profile has no username, connecting opens **Choose a username**. Enter a name and choose **Continue** to save it locally and resume that connection; **Cancel** leaves you disconnected. You can also set it in **User** settings. Every administrator connection uses this name, including saved connections and startup reconnect. Changing it applies to your next connection; it does not rename an active session. Other profile fields are optional presentation defaults. Viewer connections remain anonymous.

The engine retains profiles by username so names and avatars remain available after disconnecting. If its saved profile differs from this interface at login, compare them and choose **USE ENGINE PROFILE** to update this interface, or **USE INTERFACE PROFILE** to replace the engine's saved presentation. **CANCEL** disconnects without changing either profile. Matching profiles connect normally; a new username saves the interface profile. This comparison covers display name, avatar, category, and role label, and does not change authentication permissions.

## Save and apply changes

In **Interface**, choose **Default engine** and **Workspace folder** using the folder buttons, or enter a path and press Enter. The default discovery folder is `workspaces/` beside the selected `engine/` folder. An explicitly selected workspace folder stays selected when you change the default engine. Existing workspace associations retain their engine installation.

Engine text fields save when you leave the field or press Enter; switches save immediately. Saved connection settings can differ from the running engine. The field's warning identifies a change awaiting restart; **Restart now** applies it and reconnects the interface. Node name changes belong to the workspace; connection settings belong to the local engine instance.

Under **Engine → History and recording**, choose workspace defaults or project overrides, then enable **Automatic cleanup** and set maximum age in days and maximum size in GB for each database. Settings save automatically after editing and flush pending changes when closed. Zero leaves that limit unrestricted. The reset button removes overrides for the selected scope. These limits apply to this engine's local recordings, not the remote node's original history. See [Recorded Data](Recorded%20Data.md) for browsing and deletion.

Engine-dependent pages stay disabled while disconnected. Viewer connections can read engine diagnostics but cannot change engine configuration, retention, or engine warning rules, including enabling or disabling diagnostics. Local appearance and clock-warning preferences belong to the interface.

## Investigate a warning

Warning and error icons on Settings and its pages identify where attention is needed. Open the affected page to read the error or pending change. Local interface issues also appear in Notifications; engine diagnostic conditions appear in ARGUS. [Diagnostics](Diagnostics.md) explains the measurements and their limits.

Use the right configuration surface for runtime changes: a device address belongs in its [module configuration](../Engine/Modules.md); task parameters belong in the task editor; live running/hold controls belong on the task card. Interface appearance settings do not alter engine acquisition or automation rates.

For host/client compatibility and runtime capacity, see [Compatibility, Licensing, and Tiers](../Getting%20Started/Compatibility%2C%20Licensing%2C%20and%20Tiers.md).

## TEMPEST network discovery

Under **Interface > TEMPEST network discovery**, use **Enable network discovery** to control automatic searches on the login page. **Network discovery ports** accepts up to 16 UDP ports separated by commas; the default is `47600`. Include each discovery port used by engines you want to find. These are query destination ports: replies arrive on temporary local sockets. Changes save locally and apply immediately.

Under **Engine**, **Enable network discovery** controls whether that engine answers, and **Network discovery port** chooses its UDP port (1–65535, default `47600`). These settings save for the next engine restart. They are also available in the local startup configuration editor before connecting. The normal TEMPEST connection port remains independent. Multiple engines can share a discovery port.

Discovery uses active IPv4 adapters and localhost without scanning IP ranges or every port. It does not replace passwords, viewer permissions or connection compatibility checks. If multicast is blocked or discovery is disabled, use a saved connection or enter the address manually.

## Local startup configuration

On the login page, choose **Edit engine** for a configured local engine and select **Engine config settings**. It edits the node identity, TEMPEST bind address and base port, administrator password, viewer access, startup project, runtime persistence interval, fixed-channel capacity, and license key. Passwords and license keys are write-only; leaving them blank keeps the saved values. The license removal switch clears the saved key.

Edits save automatically after a short pause or when you leave a field; switches and project selection save immediately. Closing the editor flushes pending edits. A warning icon beside each affected field indicates **Engine restart needed**. Save failures use the normal settings error indicators. Saving does not stop or restart a running engine, and changed connection credentials apply after restart.

The connected **Engine** settings tab shows the same local startup section for a registered local engine. Its existing connection settings remain above that section. Workspace and installation paths are shown for reference; use the workspace and engine setup selectors to change their association. Web access to host-side startup editing requires a browser on the interface host, as with other local engine management controls.
