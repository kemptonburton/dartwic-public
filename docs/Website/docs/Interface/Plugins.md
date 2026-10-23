---
summary: Install compatible engine and interface extensions and inspect their status.
updated: 2026-10-23T02:15
status: coming-soon
created: 2026-08-03T15:41
---

Open **Settings → Plugins** to inspect installed plugins and browse available extensions. A plugin can contain an engine side, an interface side, or both. A driver needs its engine side loaded; a custom editor or resource needs its interface side available in the current interface host.

![Settings lists the installed engine and interface sides separately.](../_attachments/plugins.jpg)

## Install from the browser

1. Connect to the engine you intend to extend.
2. Open the plugin browser and search for a plugin.
3. Read its description, repository README, release version, and minimum host versions.
4. Choose **Install** while connected to the Engine. The Interface installs its files in the current host and loads its bundle immediately. The Engine downloads and verifies its native side, installs the files in its shared installation, and offers **Restart Engine** to load them.
5. Inspect each side's installed version and load status before creating a module or opening a new resource. You can decline the restart and do it later; refreshing Settings keeps the Engine side marked **Installed · Not loaded · Restart required**.

The browser resolves compatible releases from the public registry. A plugin without compatible release assets cannot be installed just because its source repository exists.

Search covers the full catalog. The browser renders rows near the viewport and
loads release versions, platform badges and download counts as cards come into
view. Opening a plugin loads its README. A loading label means the release check
is still pending; **Refresh plugins** checks the catalog and visible releases again.
Use the arrow keys to move between cards, or Home and End to reach the first and
last match.

Plugin cards show the published-package download count when available, including
zero. Windows and Linux badges identify the platform archives published for the
displayed release; they do not establish compatibility with the connected host.

For a public repository outside the registry, use **Open plugin from GitHub** and paste its repository link. The preview uses the same release and compatibility checks and marks the plugin **Unlisted**.

Workspaces using the same Engine installation share its plugin directory. A fresh plugin can be installed while the Engine runs; native code loads at the next restart. Updates and removals are queued while existing code continues running. Restart only the selected Engine to apply a queued change. If another Engine still holds a native file, the change fails, the selected Engine restarts with its previous plugin, and a popup names the locked path. Stop the Engine holding that file and explicitly retry. The Interface side updates or removes immediately. A pinned version conflict with another registered workspace must be resolved before replacing a shared plugin. See [Tracking a Project in GitHub](../Getting%20Started/Tracking%20a%20Project%20in%20GitHub.md) for manifest and directory examples.

## What installation adds

| Plugin contribution | Where to use it |
| --- | --- |
| Engine module type | Create an instance in **Modules** and enter its device parameters. |
| Task type and task UI | Create/configure the task and operate its card. |
| Interface resource | Open it from resource navigation. |
| Schematic node | Add it from the schematic palette. |
| Plugin settings | Open that plugin's settings page. |

Installing a driver does not automatically configure every device. Follow the plugin's README for connection parameters, channel names, acquisition timing, and outputs.

Contribution badges show the modules, tasks, TEMPEST peers, operations, telemetry topics, DCode functions, loops, resources, and schematic nodes registered by the loaded plugin. They describe what the host has registered; a badge does not mean a device instance is configured or connected.

## Installed and loaded states

Installed means the destination has a valid manifest and its required native binary or Interface entry script. Loaded means the connected Engine API or current Interface runtime reports it. Installed, loaded, and queued versions can differ. A newly installed Engine plugin is **Installed · Not loaded · Restart required** until restart. Queued updates and removals leave the current installed and loaded versions visible. Missing files are an incomplete installation; an unavailable status request is **Status unavailable**, not missing files. A load error leaves the files installed and reports **Load failed**. Plugin settings that call Engine-provided operations become available after that Engine plugin loads.

Interface updates stage and validate the replacement before swapping directories. If staging or replacement fails, the previous installed version is retained or restored. Interface-only actions do not install, update, or remove Engine components and do not request an Engine restart. Removing a queued Engine update cancels its replacement as well; a missing staged replacement cannot erase the previous installed files during startup.

## Manual installations

The settings view can also identify unmanaged plugins installed outside the browser. The folder still needs a valid manifest and correctly laid-out binaries or UI bundle. [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md#install-locally) gives the exact paths.

If only one side appears, check the other host's installation and minimum version. A folder with a missing manifest, native binary, or Interface entry script shows **Installation incomplete** and its file error; reinstall that side instead of restarting. A load error means the files are present but the runtime could not load them, so inspect its manifest and dependencies before recreating project resources.

To build your own extension, start at [Plugin Development](../Plugins/Overview.md).

The installed-plugin summary works without contacting the online catalog when no plugins are installed. If an update check cannot reach the catalog, Settings shows a catalog availability warning separately from installed-plugin errors. Browsing new plugins requires the online catalog.

Desktop and web-host plugin requests can use IPv4 when IPv6 is unavailable, including catalog, release, README and archive requests. A remaining timeout means the host could not finish the request within its deadline; it does not indicate that an installed plugin failed to load.
