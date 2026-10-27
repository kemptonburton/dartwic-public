---
summary: Know which files are portable, which belong to an instance, and when changes apply.
created: 2026-10-24
updated: 2026-10-26T21:52
---

A DARTWIC setup has software to run, workspace content to share, and local data to keep on its machine. Knowing which folder owns each part makes it easier to move a workspace, run another setup, or back up recordings.

| Term | What it means |
| --- | --- |
| Installation | The Engine executable, libraries, stock assets, and installed plugins. |
| Instance | The local configuration and data for running a workspace with that installation. |
| Workspace | Your portable collection of projects, settings, and shared assets. |
| Project | One setup within the workspace, containing its scripts, modules, tasks, and schematics. |

# File ownership

The workspace is the portable folder to commit and share. The installation and instance hold software and local state alongside it.

A typical installation keeps these folders beside one another:

```text
dartwic/
  interface/                 # Interface software and its local preferences
  engine/                    # Engine software, plugins, and instances
    instances/<instance>/    # Local configuration, recordings, and caches
  workspaces/<workspace>/    # Portable projects, settings, and shared assets
```

These are example folder names, not required absolute paths. Cloning the workspace brings its authored content; it does not bring an Engine instance's recordings or credentials.

| Location | Contents |
| --- | --- |
| `engine/bin/`, `engine/assets/` | Engine software and stock content. |
| `engine/plugins/` | Plugins shared by instances using that installation. |
| `engine/instances/<instance>/config.json` | Workspace path, startup project, connection/access settings, and runtime capacity. |
| `<workspace>/` | All portable workspace content, including projects and shared settings/assets. |
| `<project>/rapid/channel_snapshot.json` | Channel configuration, startup values, and cached remote records within the workspace. |
| `<instance>/runtime/<project>/` | Live-state checkpoints, recordings, indexes, and exports. |
| `<instance>/cache/<project>/` | Generated build files and other caches. |
| `<instance>/settings/<project>/tempest_peers/connections.json` | Saved peer connections and credentials. |

RAPID keeps local values and timestamps in `runtime/<project>/rapid/channel_state.json`, with channel recordings in the same directory. ARGUS stores events and logs under `runtime/<project>/argus/`. Back up needed instance data separately from workspace Git.

# Instance selection

For a packaged setup, follow [First Session](../Getting%20Started/First%20Session.md). Its starter workspace uses `instances/default/`; other workspaces usually receive a workspace-named instance.

| Launch | Instance selection |
| --- | --- |
| Interactive Release executable | Workspace/instance selector; **Q** exits. |
| Noninteractive Release launch | Defaults to `instances/default/`. |
| Debug executable | Source checkout's `tests/engine/instances/primary/`. |
| `DARTWIC_CONFIG_DIR` set | Uses that explicit instance directory, bypassing the selector. |

Check the startup log for the resolved configuration directory before changing files. For example, two instances can share one Engine installation while using different workspaces, server ports, credentials, and recording directories.

# Configuration and restart

Engine startup settings come from the instance configuration. In the connected Interface, inputs save on Enter or blur and credentials are masked. The local login startup editor shows the values and uses its footer **Save** action. Fields distinguish unsaved edits from saved changes that need a restart.

New workspace instances default to the admin password `admin`. For manual file edits, stop the instance, edit its configuration, and restart it. Check the startup log and reconnect using the resulting address and credentials.

| Setting | Owning scope |
| --- | --- |
| Node name | Workspace identity. |
| Server address/base port, access credentials, fixed-channel capacity | Local Engine instance. |
| Device parameters | Project module/task configuration. |
| History defaults and overrides | Workspace/project settings, applied to this instance's recordings. |
| Interface appearance and saved local-node registry | The Interface installation or browser, separately from Engine data. |

The Interface keeps its saved local-node list at `<interface>/.dartwic/local-engines.json`; `DARTWIC_LOCAL_ENGINE_REGISTRY_PATH` overrides that path. Desktop preferences belong to the Interface installation, while web preferences belong to the browser site. These are separate from Engine instance data.

# Updates, removal, and sharing

An Engine update replaces managed software and restarts the selected instance. Other instances can still hold installation files; read a reported lock/retry result before assuming an update applied. Plugin file installation and runtime loading have their own [status](../Interface/Plugins.md#installation-status).

Removing a registered local node deletes its instance storage, including recordings and credentials. The Interface shows the target folder and requires its Engine stopped. Removing a remote entry only forgets the connection.

Use [Tracking a Workspace in GitHub](../Getting%20Started/Tracking%20a%20Workspace%20in%20GitHub.md) for the portable file set. Back up needed runtime history separately and protect credentials when sharing files.
