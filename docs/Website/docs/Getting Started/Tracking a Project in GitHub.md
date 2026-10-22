---
summary: Open and share Git workspaces using one engine installation and separately installed interfaces.
updated: 2026-10-21T15:54
created: 2026-09-08T14:04
---

Track the **whole workspace folder** in Git. Each computer selects a default engine installation and shared set of engine plugins in Interface settings. New local nodes use that installation, with an optional installed engine override per workspace. Local instances point to cloned workspaces and keep separate configurations and history. Desktop and webserver interfaces are installed separately, with their own interface plugins.

## Directory example

```text
DARTWIC Engine/
  engine/
    bin/                           # one executable and libraries
    plugins/                       # shared engine plugins
    .dartwic/                      # plugin ledger and installation lock
    instances/
      default/config.json          # default for directly launching the binary
      <instance-id>/
        config.json                # local workspace path, project, IP, port, password
        license.json
        runtime/<project-name>/
          rapid/                   # recordings, exports, live channel state
          argus/                   # events, logs, sessions, database sidecars
        settings/<project-name>/
          tempest_peers/           # local peer secret values
        cache/<project-name>/
          dcode/                   # generated native compiler cache

Projects/                          # any location outside the engine
  test-stand/                      # Git repository / workspace
    workspace.json                 # node name and shared dependencies
    .gitignore
    .gitattributes
    global_data/                   # recording policy, profiles, mute choices
    default/
      project.json                 # project dependencies
      edge_node_connections.json   # peer endpoints and secret references
      scripts/
      rapid/channel_snapshot.json
      schematics/
      schematic_nodes/
      modules/
      tasks/
      checklists/
      sequences/
    flight/
      project.json
      scripts/
  another-repo/
    workspace.json
    global_data/
    default/project.json

DARTWIC Desktop/                   # installed separately
  plugins/                         # desktop interface plugins
DARTWIC Webserver/                 # installed separately
  config.json                      # interface HTTP listener
  plugins/                         # webserver interface plugins
```

The interface hosts share a local engine registry at `%LOCALAPPDATA%/DARTWIC/local-engines.json` on Windows or `~/.local/share/DARTWIC/local-engines.json` on Linux. `DARTWIC_LOCAL_ENGINE_REGISTRY_PATH` overrides it. It remembers local credentials; keep it out of Git.

## Install the interface and open a clone

1. Download **Desktop Interface** from [DARTWIC downloads](/areas/dartwic/downloads), extract its package, and launch its executable. Install **Webserver Interface** separately for browser access: extract its package, launch its executable, and open its configured HTTP address. Its `config.json` controls the interface listener separately from the engine endpoint.
2. Install **DARTWIC Engine**, then open **Settings → Interface** and select its directory. This saved default fills new workspace nodes; existing nodes keep their selected installation.
3. Clone a workspace with your usual Git client. On the landing page choose **Add workspace**, then browse to the cloned folder or enter its path. Select the container holding the project folders.
4. If the selected engine installation already has an instance whose `config.json` points to this workspace, the dialog loads its saved project, TEMPEST IP, port and masked password. If several instances point to the same workspace, choose the intended **Engine instance**. For a new instance, select a project. The node name comes from `workspace.json`. Choose TEMPEST IP and port, or leave the port blank for an available range. Leave the password blank to generate and remember one locally. Enter a license key if needed for project capacity. Turn off **Use default** to choose another installed engine for this node.
5. Choose **Add node** to register a stopped node without launching it. If the existing engine is running and responds to the interface, choose **Add and connect** to use it.
6. Click the node's **Start** control to open its setup console centered in the interface. Review the dependency checks. **Install required plugins before start** installs missing dependencies; **Prepare workspace** runs setup separately. Engine plugins go into that node's engine installation, and interface plugins go into the current interface host. Shared-version replacements require review, and incompatible workspace requirements block installation.
7. Choose **Start engine**. The console shows setup progress and the engine's actual startup output. **Stop engine** also works during startup. Each preparation, start, stop, or restart action clears the console for its own progress and output. When TEMPEST is ready, choose **Open workspace** to connect; starting and connecting are separate actions.

Webserver workspace management is available from the webserver computer's loopback address. Paths refer to that computer. Browser clients on other computers use **New Connection** to connect to engines.

Different workspaces can run simultaneously with one binary and plugin set, using separate port ranges and runtime directories. A workspace can be open in only one engine process at a time. Selecting another project changes that instance's selected project.

## Node identity and local settings

The node identity travels with the workspace:

```json
{
  "schema_version": 1,
  "node_name": "MY_NODE",
  "plugins": [],
  "interface_plugins": []
}
```

**Settings → Engine** shows running and saved settings for the connected engine. Administrators can change node name, TEMPEST IP, TEMPEST port, password and viewer access. Text fields save automatically when you leave them or press Enter; the viewer switch saves immediately. **Restart now** applies the saved changes and reconnects. Changing the node name edits `workspace.json`; endpoint settings stay local. Remote connections keep their existing hostname, and local connections follow changes to their TEMPEST IP.

These same APIs work for directly connected remote engines. TEMPEST peers have their own connection configuration. Update any node-qualified references as needed when deliberately renaming a node.

You can also author an instance config while the engine is stopped:

```json
{
  "engine_installation_directory": "../..",
  "workspace_root_directory": "D:/Projects/test-stand",
  "active_project_name": "default",
  "server_ip": "127.0.0.1",
  "server_port": 7000,
  "server_admin_password": "SET-LOCALLY",
  "allow_viewers": true,
  "license_key": ""
}
```

Relative paths resolve from the folder containing `config.json`. Set `DARTWIC_CONFIG_DIR` to that folder when directly launching the executable. Without an override, a release binary uses `engine/instances/default`. Native transports use the base port and base + 1; web transports use base + 2.

## Dependency manifests and sharing

Projects declare dependencies in `project.json`. Common dependencies can live in `workspace.json`; both scopes are combined for the selected project.

```json
{
  "schema_version": 1,
  "min_engine_version": "2.0.0",
  "min_interface_version": "2.0.0",
  "plugins": [{"id": "your_driver", "version": "1.0.0", "repo": "YOUR-ACCOUNT/your-driver"}],
  "interface_plugins": [{"id": "your_driver", "version": "1.0.0", "repo": "YOUR-ACCOUNT/your-driver"}],
  "required_files": ["assets/process-diagram.svg"]
}
```

Versions are exact. Omit `version` to accept an installed version or resolve a compatible release. Engine start, graceful shutdown, and restart automatically record loaded engine-plugin versions in both manifests. Local interface-managed lifecycle actions also record declared interface-plugin versions from that interface host. Missing plugins keep their declarations until they are installed. Setup mode does not pin engine versions. A declared repository supports plugins outside the public registry; releases need `plugin.json` and `plugin.zip` for an Interface-only plugin, or a matching platform ZIP for a native plugin; see [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md#github-release-contract) for the exact filenames and layout.

The checklist checks versions, required files, project and `global_data` JSON, machine paths, common credential fields, local connection secret references, and native execution requirements. For native DCode it compiles a fresh C++20 library. Hardware reachability, licensing, plugin drivers and dependencies hidden in arbitrary code require engine-host configuration. See [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md).

Peer credentials stay in `settings/<project>/tempest_peers/connections.json` under the local instance. Project connections retain endpoints and JSON pointer `secret_fields`, such as `/password`. A receiver supplies local secrets before connecting to those peers. Missing receiver secrets are expected; embedded secrets and absolute resource paths need fixing before publishing.

## Publish and update through GitHub

1. Save authored resources and stop the engine.
2. Review the automatically recorded plugin versions, authored changes, and credentials with Git.
3. Initialize Git in the workspace root if needed, commit authored files, add a GitHub remote, and push through your usual Git client.

The interface leaves Git operations to your Git client. Stop the engine before pulling or externally editing persisted resources, then reopen it. On another computer, clone and repeat **Open workspace**; its configured engine installation is reused.

Track scripts, channel definitions and explicit startup values, tasks, modules, schematics, assets, profiles, peer endpoints and mute preferences. Keep `rapid/channel_snapshot.json` in Git. Live values, timestamps and runtime provenance stay in the local instance's `rapid/channel_state.json`. Do not ignore every `rapid/` folder, because that hides authored definitions.

Git restores configuration and preferences. A fresh instance creates its own recordings and database history. For a full backup, stop the engine and copy its local runtime and credential files securely. Use managed project rename to keep its workspace folder, selected project and runtime key together. Project names must be unique within a workspace, ignoring case.
