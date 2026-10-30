---
summary: Understand the Engine folder, local instances, portable workspaces, and projects.
created: 2026-10-24
updated: 2026-10-27T19:33
---

DARTWIC keeps the setup you author separate from the software that runs it and the data produced while it runs. This lets you share a workspace without copying installed binaries, large recordings, or another computer's private credentials.

# Usual DARTWIC Setup

The usual layout puts the Interface, Engine, and workspaces beside one another. Instances live inside the Engine folder; projects live inside a workspace:

```text
dartwic/
  interface/                 # Interface software and its local preferences
  engine/                    # Engine software, plugins, and instances
    instances/<instance>/    # Local configuration, recordings, and caches
  workspaces/<workspace>/    # Portable projects, settings, and shared assets
```

| Location | What is saved there | Why it lives there |
| --- | --- | --- |
| `interface/` | Interface software and desktop preferences. | Display preferences belong to the Interface using them. |
| `engine/` | Engine binaries, libraries, stock assets, and installed plugins. | Instances can share the same installed software. |
| `engine/instances/<instance>/` | Engine configuration, credentials, recordings, live-state checkpoints, and caches. | Each local setup keeps its own access settings and generated data. |
| `workspaces/<workspace>/` | Shared settings, assets, and project folders. | The entire authored setup can be committed, cloned, and moved to another computer. |
| `<workspace>/<project>/` | That project's modules, tasks, scripts, schematics, and channel configuration. | Related resources stay together as one setup within the workspace. |

The instance's `config.json` connects these parts: it selects the workspace and startup project and holds local Engine settings. For example, a project saves its channel configuration in the workspace, while measurements recorded during a run go into the instance.

Share the **entire workspace folder** to share the setup. Back up the **instance folder** as well when you need its recordings and private configuration. Another computer uses its own installed software and local instance with the shared workspace.

These folder names are examples, not required paths. Workspaces can live elsewhere; the instance configuration tells the Engine where to find them. Web Interface preferences live in the browser rather than the desktop Interface folder.

# Engine Folder

The Engine folder holds the executable, libraries, stock assets, installed plugins, and local instances. Multiple instances can use the same installed Engine software.

| Engine folder | Contents |
| --- | --- |
| `bin/` | Engine executable, updater, and runtime libraries. |
| `assets/` | Installed stock content. |
| `plugins/` | Installed Engine plugins shared by instances using this installation. |
| `instances/` | Each instance's configuration, recordings, private settings, and caches. |

## Software Updates

An Engine update replaces managed software and restarts the selected instance. Other instances can still hold installation files; read a reported lock/retry result before assuming an update applied. Plugin file installation and runtime loading have their own [status](../Interface/Plugins.md#installation-status).

The interrace can update the Engine or Interface from releases on [GitHub Releases](https://github.com/kemptonburton/dartwic-public/releases). Visit the [DARTWIC Downloads page](https://kemptonburton.com/areas/dartwic/downloads) for the latest Engine, Interface, and client releases.

Select a release in the **Interface** or **Engine** version selector. The document icon beside a release opens its notes. 

![](_attachments/Pasted%20image%2020261027191957.png)

# Instances

An **instance** is the local configuration and data for one Engine setup. Its `engine/instances/<instance>/config.json` selects the workspace and startup project and stores local connection, access, license, and capacity settings.

For example, two instances can share one Engine installation while using different workspaces, server ports, credentials, and recording directories.

![](_attachments/Pasted%20image%2020261027192336.png)

## Instance Selection

For a packaged setup, follow [First Session](../Getting%20Started/First%20Session.md). Its starter workspace uses `instances/default/`; other workspaces usually receive a workspace-named instance.

| Launch | Instance selection |
| --- | --- |
| Interactive Release executable | Workspace/instance selector; **Q** exits. |
| Noninteractive Release launch | Defaults to `instances/default/`. |
| Debug executable | Source checkout's `tests/engine/instances/primary/`. |
| `DARTWIC_CONFIG_DIR` set | Uses that explicit instance directory, bypassing the selector. |

Check the startup log for the resolved configuration directory before changing files.

## Instance Configuration

Engine startup settings come from the instance configuration. Anyone connected to the interface as an admin can edit the engine settings, which will apply after an engine restart, shown below.

![](../Getting%20Started/_attachments/Pasted%20image%2020261024193411.png)

If your engine is a local engine and binded to the interface, you also can access an engine config tab in the edit popup on the engine connection button to change the config as well.

![](../Getting%20Started/_attachments/Pasted%20image%2020261024194313.png)

New workspace instances default to the admin password `admin`. For manual file edits, stop the instance, edit its configuration, and restart it. Check the startup log and reconnect using the resulting address and credentials.

## Instance Data

Each instance keeps local project data in three folders. Paths below are relative to `engine/instances/<instance>/`:

| Location | Contents |
| --- | --- |
| `settings/<project>/` | Private project settings, including peer connections and credentials in `tempest_peers/connections.json`. |
| `runtime/<project>/` | Live-state checkpoints, recordings, indexes, and exports. |
| `cache/<project>/` | Generated build files and other caches. |

For example, `runtime/default/rapid/channel_state.json` remembers local channel values and timestamps for the `default` project. Channel recordings live beside it; event and log history lives under `runtime/default/argus/`.

Back up needed recordings and private configuration separately from workspace Git. Stop the Engine before copying its instance folder. Cache files can be regenerated.

## Instance Removal

Removing a registered local node deletes its instance storage, including recordings and credentials. The Interface shows the target folder and requires its Engine stopped. Removing a remote entry only forgets the connection.

A locally binded instance can be deleted through the login page on the Interface.

![](_attachments/Pasted%20image%2020261024194524.png)


# Workspaces

A **workspace** is the portable folder containing your projects, shared settings, and assets. Commit the entire workspace folder so another computer can recreate the authored setup with its own Engine installation and instance.

| Workspace content | Purpose |
| --- | --- |
| `workspace.json` | Node identity and shared dependencies. |
| `settings.json` | Shared workspace settings. |
| `client_info.json` | Operator display profiles. |
| `assets/` | Shared media, models, and custom presets. |
| Project folders, such as `default/` | Each project's configuration and resources. |

The workspace owns the node name; the instance owns its server address/base port, access credentials, and runtime capacity. History defaults and overrides belong to workspace/project settings and apply to that instance's recordings.

The Workspace is the main folder the Engine reads from to get its resources, such as channels, schematics, modules, tasks, etc. It is what the Interface "opens up" when you connect to a running engine.

![](_attachments/Pasted%20image%2020261027192601.png)

## Workspace Sharing

Cloning the workspace brings all its authored content. Each computer supplies its installed software, local credentials, and recordings through its own installation and instance.

[Tracking a Workspace in GitHub](../Getting%20Started/Tracking%20a%20Workspace%20in%20GitHub.md) shows the complete layout and sharing workflow. [First Session](../Getting%20Started/First%20Session.md) covers opening a workspace and connecting for the first time.

# Projects

A **project** groups the resources for one setup within a workspace: device modules, tasks, scripts, schematics, and channels. For example, a workspace for a test facility could contain separate projects for different test stands.

| Project content | Purpose |
| --- | --- |
| `project.json` | Project dependencies. |
| `settings.json` | Project settings and overrides. |
| `modules/` and `tasks/` | Device/service parameters and task configuration. |
| `scripts/` | DCode automation. |
| `schematics/` and `schematic_nodes/` | Saved visualizations and node resources. |
| `rapid/channel_snapshot.json` | Channel configuration, startup values, and cached remote records. |

All of this belongs to the workspace and travels with it. The project's live values, recordings, private settings, and generated builds stay in the instance folders described above.

Projects can be switched, created, renamed, or deleted through the Interface. 

![](_attachments/Pasted%20image%2020261027192747.png)

Switching a project requires an Engine restart.

# Interface Preferences

The Interface keeps its saved local-node list at `<interface>/.dartwic/local-engines.json`; `DARTWIC_LOCAL_ENGINE_REGISTRY_PATH` overrides that path. Desktop preferences belong to the Interface installation, while web preferences belong to the browser site. These are separate from Engine instance data.
