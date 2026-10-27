---
summary: Keep portable workspace content in Git, with software and recordings stored separately.
updated: 2026-10-26T21:52
created: 2026-09-08T14:04
---

Instructions for tracking and sharing a DARTWIC project in a content management program like GitHub.

# Workspace sharing

To share your DARTWIC project, it is best to commit the **entire workspace folder** to GitHub so others can clone it, open it in DARTWIC, and pull future updates.

The the workspace folders under `workspaces/` hold pretty much all the resources, assets, and configs for your DARTWIC project that are portable and designed to recreate and entire project from scratch on a new machine. 

Heavier assets, like binaries, recordings, and secret configurations are kept under `engine/`. 

Use your usual Git client to commit and push the workspace. On another computer, clone the repository into `workspaces/` and open it in DARTWIC. The video below shows how to open, configure, and launch a new workspace in the Interface.

![](_attachments/workspace-startup.mp4)

Once cloned, pull to receive updates and commit/push to share your own changes.

Save your work and stop its Engine before committing, pulling changes, or editing saved resources externally.

For more detailed instructions on how to install DARTWIC, setup the Interface and a local Engine, and open a workspace, check out [First Session](First%20Session.md).

# DARTWIC folder layout

The usual folder layout separates the applications from your workspaces:

```text
dartwic/
  interface/                     # Desktop Interface or Webserver Interface
  engine/                        # Engine binaries, instances, and recordings
  workspaces/
    experiment/                  # workspace and Git repository root
    another-workspace/           # a separate workspace
```

Create the repository inside `workspaces/experiment/`. The surrounding `dartwic/` folder holds your local installation.

# Local Engine files

The Engine folder holds its binaries and local data. For example, on Windows, using an instance and project both named `default`:

```text
engine/
  bin/
    DARTWIC Engine.exe
    updater.exe
    ...                          # runtime libraries
  assets/                        # installed stock content
  plugins/                       # installed Engine plugins
  instances/
    default/
      config.json                # main configuration for this instance
      settings/default/          # private settings for the default project
        tempest_peers/
          connections.json       # local peer credentials
      runtime/default/
        rapid/
          channel_state.json     # latest local values and timestamps
          rapidlog_shard_0.rlog4  # recorded channel samples
          rapidlog_index_0.bin   # history index
          ...
        argus/                   # recorded events, logs, and log files
      cache/default/
        dcode/                   # generated native code and build cache
```

Each local workspace setup has an **Engine instance**. Its `config.json` selects the workspace and startup project and holds local connection, access, license, and capacity settings. The packaged starter uses `instances/default/`; other setups can use different instance names. Startup configuration changes apply after restarting that instance.

The Interface keeps its local Engine registry and desktop preferences under `interface/.dartwic/`. Web Interface preferences live in the browser's storage for that site.

# Workspace contents

Commit the entire workspace folder and everything inside it:

```text
experiment/                      # Git repository root
  workspace.json                 # node identity and shared dependencies
  settings.json                  # workspace settings
  client_info.json               # operator display profiles
  assets/                        # shared media, models, and custom presets
  default/                       # project
    project.json                 # project dependencies
    settings.json                # project settings
    modules/                     # device and service configurations
    tasks/
    scripts/
    schematics/
    schematic_nodes/
    rapid/
      channel_snapshot.json      # channel definitions and startup values
```

All of these files are part of the portable workspace. Recordings, binaries, caches, and private instance settings live in the separate Engine and Interface folders shown above.

# Dependencies

`workspace.json` declares shared dependencies, and each project's `project.json` can add its own: minimum Engine and Interface versions, plugins, and required files.

Recorded plugin versions are references rather than an exact installation lock. Another computer installs compatible software into its own Engine and Interface folders. See [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md) for package details.

# Backups

Git restores the portable setup. To back up recordings and local configuration as well, stop the Engine and securely copy its instance folder. [Configuration and Storage](../Engine/Configuration%20and%20Storage.md) explains the storage scopes in more detail.
