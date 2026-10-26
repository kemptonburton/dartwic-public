---
summary: Choose where settings, private device configuration, runtime files, and shared assets belong.
updated: 2026-10-26T14:16
created: 2026-10-05T15:38
---

Plugins often need to remember settings, read device configuration, or save files such as calibration data and operator layouts. This page explains **where that data belongs** and which SDK helpers to use.

**Settings** are named options, such as a discovery interval or display precision. **Files and assets** hold documents or reusable content. Their location determines whether they travel with the workspace, stay private to one Engine, or are replaced when the plugin updates.

| You want to save… | Start with… |
| --- | --- |
| A plugin-wide default or project override | [Layered settings](#defaults-and-overrides). |
| A device connection or task mapping | [Module/task configuration](#module-configuration-and-private-values). |
| Private credentials, recordings, or generated data | [Instance folders](#instance-folders). |
| A shared calibration file, layout, or model | [Workspace assets](#shared-and-bundled-assets). |
| Files shipped with your plugin | [Bundled assets](#bundled-files). |

Interface examples use the connected Engine through `createStorageClient(operation)`; `operation` comes from `useDartwic()`. C++ examples use an `SDK_API& api`. `my_driver` is the example plugin ID; replace it with your manifest ID. The [Interface storage reference](Reference/Interface/Storage/Overview.md) and [Engine storage reference](Reference/Engine/Storage/Overview.md) contain the full APIs.

# Choose where data belongs

A workspace is the portable folder you commit and share. Keep machine-specific state outside it. In this guide, the installation is `engine/`, the workspace is `workspace/`, and the example project is `default`.

| Location | What belongs there |
| --- | --- |
| Installation | Executables, installed plugins, SDKs, and bundled assets. |
| Instance | One Engine's local credentials, operational data, and caches. |
| Workspace | Shared defaults in `settings.json` and reusable files under `assets/`. |
| Project | Modules, tasks, scripts, schematics, and that project's `settings.json` overrides. |
| Interface | Personal theme/layout preferences in desktop `.dartwic/` or browser storage. |

## Instance folders

Under `engine/instances/<instance>/`, project data uses three directories:

| Directory | Purpose |
| --- | --- |
| `settings/<project>/` | Durable private configuration, such as credentials. |
| `runtime/<project>/` | Recordings, logs, resume values, and dataframe state. |
| `cache/<project>/` | Regenerable files, such as native builds and temporary export parts. |

Only cache data should be disposable. Keep needed recordings and private settings when clearing generated files. [Configuration and Storage](../Engine/Configuration%20and%20Storage.md#file-ownership) has the Engine paths; [Tracking a Workspace in GitHub](../Getting%20Started/Tracking%20a%20Workspace%20in%20GitHub.md) covers sharing the complete workspace.

# Defaults and overrides

A plugin can provide defaults in code, share a workspace-wide choice, and let one project override it:

```text
Code defaults → workspace/settings.json → workspace/<project>/settings.json
                  Shared choice             Project exception
```

Store plugin settings under `plugins.<plugin-id>`. Save only intentional changes, so later workspace/default changes can still reach projects that inherit them.

| Rule | Effect |
| --- | --- |
| Objects merge recursively | A patch can change one field without replacing its neighbors. |
| Arrays replace | Saving an array replaces that entire array. |
| `false`, `0`, `""`, and `null` are values | Use reset to inherit again. |
| Notification mutes combine | A mute at either workspace or project scope still suppresses the notification. |

## Read and change a setting

A read returns the **effective** values and a **revision**, an opaque token identifying the settings you read. Supply that revision when saving so a stale panel cannot silently overwrite another edit. `sources` identifies which layer supplied each leaf setting.

This example changes a plugin's discovery interval for one project:

```js
import {createStorageClient} from '@dartwic/interface-sdk/storage';

const storage = createStorageClient(operation);
const project = 'default'; // Capture the intended project before asynchronous work.
const defaults = {plugins: {my_driver: {discovery_interval_ms: 1000}}};
const snapshot = await storage.readEffectiveSettings(defaults, project);
const interval = snapshot.effective.plugins.my_driver.discovery_interval_ms;

await storage.writeSettingsOverride('project', {
    plugins: {my_driver: {discovery_interval_ms: 2000}},
}, {project, revision: snapshot.revision});
```

Use `'workspace'` instead for a choice shared by all projects. Capture the selected project once before a load or delayed save; a project switch must not redirect work already in progress. Validate your plugin's fields before applying them.

To remove an override, reset its JSON pointer:

```js
const saved = await storage.readEffectiveSettings(defaults, project);
await storage.resetSettingsOverride('project', [
    '/plugins/my_driver/discovery_interval_ms',
], {project, revision: saved.revision});
```

Resetting at project scope reveals the workspace value; resetting at workspace scope reveals the code default unless a project still overrides it. Resetting a section removes that scope's whole section. In pointer tokens, escape `/` as `~1` and `~` as `~0`.

Read back with your defaults after saving. Write responses do not retain defaults supplied to an earlier read. On a revision conflict, reload and reconcile the edit instead of silently retrying it with a newer token.

Engine plugins use the same model:

```cpp
using Json = nlohmann::json;
const std::string project = "default";
const Json defaults = {{"plugins", {{"my_driver", {{"discovery_interval_ms", 1000}}}}}};
const auto snapshot = api.readEffectiveSettings(defaults, project);
api.writeSettingsOverride("project", {
    {"plugins", {{"my_driver", {{"discovery_interval_ms", 2000}}}}}
}, Json::array(), project, snapshot.at("revision").get<std::string>());
```

## Apply settings to running code

Saving configuration and applying it are separate steps. The Engine merges plugin settings into the configuration passed to the factory at load time; it does not rewrite the installed `plugin.json`. A running plugin must reread and safely apply changes, or require a restart. Keep file reads and JSON parsing outside high-frequency task loops.

Core policies have their own application timing. For example, [recording configuration](../Engine/Advanced/Recording%20and%20Delivery%20Tuning.md#recording-queues) requires an Engine restart; do not assume every settings write takes effect immediately.

## Autosaved settings panels

Autosave keeps a local draft responsive while saving changed fields in the background. The [example plugin](https://github.com/kemptonburton/dartwic-example-plugin) uses it for display precision and unit labels. Its implementation is split into:

| Example file | Responsibility |
| --- | --- |
| `interface/src/settings.mjs` | Defaults, validation, project capture, and storage calls. |
| `interface/src/settingsAutosave.mjs` | Debounce and serialize changed-field patches. |
| `interface/src/useDisplaySettings.jsx` | Connect saving state and errors to React and notifications. |

Reuse that pattern rather than adding another settings file or localStorage copy:

- Validate drafts before queuing; an empty numeric input is not automatically zero.
- Queue only changed fields and save them sequentially, using each returned revision.
- Keep newer user edits when an older save response arrives.
- Flush on blur/cleanup and show pending, saved, or failed state. Failed changes stay pending; revision conflicts require deliberate reload/reconciliation.

The example uses a 500 ms debounce. Its queue helper is example-plugin code, not an SDK export. Device commands belong to command APIs rather than delayed settings writes; personal Interface preferences belong to Interface storage.

# Module configuration and private values

A module's connection parameters normally live in the project's `modules/<instance>.json`, under `parameters`. Task scheduling and mappings belong to task configuration. Edit those existing resources instead of storing a second copy in plugin settings; [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md#configs) shows both.

Private values can stay in the Engine instance while the module remains portable:

```cpp
const auto privateConfig = api.readStorageJson(
    "settings", "my_driver/device_credentials.json", Json::object(), "default");
const auto token = privateConfig.value("token", std::string{});
if (token.empty()) throw std::runtime_error("Configure this Engine's device token.");
```

Save with `writeStorageJson("settings", path, value, project)`. This is local JSON, not an encrypted credential vault. These helpers do not detect secrets placed in arbitrary workspace files.

# Save ordinary files

Use scoped file helpers for documents that are not layered settings. They choose a root and validate the relative path:

| Helper | Root |
| --- | --- |
| `installationPath` / `instancePath` | Installed software / current Engine instance. |
| `workspacePath` / `projectPath` | Portable workspace / selected project. |
| `projectSettingsPath` | Instance `settings/<project>/`. |
| `projectRuntimePath` | Instance `runtime/<project>/`. |
| `projectCachePath` | Instance `cache/<project>/`. |

For example, save project-specific calibration and a disposable preview separately:

```js
import {createStorageClient, projectPath, projectCachePath} from '@dartwic/interface-sdk/storage';
const storage = createStorageClient(operation);
await storage.writeJson(projectPath('my_driver/calibration.json', 'default'), {
    version: 1, offset: 0.12,
});
const calibration = await storage.readJson(projectPath('my_driver/calibration.json', 'default'));
await storage.writeJson(projectCachePath('my_driver/preview.json', 'default'), {
    generated_from: 'my_driver/calibration.json',
});
```

Interface helpers return Engine file references, not paths on the browser's computer. C++ path helpers return `std::filesystem::path`. Pass an explicit project for delayed operations; Interface instance-subdirectory helpers require it.

Engine code uses `readStorageJson` / `writeStorageJson` with scopes `installation`, `instance`, `workspace`, `project`, `settings`, `runtime`, or `cache`. Writes replace one file atomically; they do not form a multi-file transaction or migrate its schema. Host permissions still apply, and general storage/settings calls are admin-only unless explicitly allowed. Path checks are not a sandbox around native plugin code.

# Shared and bundled assets

An **asset** is a reusable file referenced by a project, such as a layout or model. Keep user-authored assets separate from files distributed with the plugin:

| Kind | Location and lifetime |
| --- | --- |
| Shared plugin-authored file | `workspace/assets/plugins/<plugin-id>/`; travels with the workspace. |
| Other shared asset | `workspace/assets/<namespace>/`; reusable across projects. |
| Bundled file | Installed plugin's `assets/`; replaced by updates and removed on uninstall. |

## Shared plugin files

Use the manifest ID when creating the helper. Save its returned reference in your schematic or resource, instead of an absolute machine path:

```js
import {createPluginWorkspaceAssetClient} from '@dartwic/interface-sdk/assets';
const authored = createPluginWorkspaceAssetClient(operation, 'my_driver');
const reference = await authored.saveJson('layouts/operator.json', {version: 1});
const layout = await authored.readJson('layouts/operator.json');
// reference: assets/plugins/my_driver/layouts/operator.json
```

Subdirectories are supported and filenames need an extension. Use `createWorkspaceAssetClient` for other shared namespaces. For example, the [3D model node](../Interface/Schematics.md#show-equipment-in-3d) stores a shared model package and keeps `asset_path` in its node data.

Asset helpers read/write UTF-8 or JSON, not raw binary. Package binary content in a validated text format before saving. JSON parsing does not validate your plugin's schema. Reads cache per operation callback; invalidate after external edits, or use a new filename. Failed reads are evicted. One project's reference does not establish that an asset is unused elsewhere.

## Bundled files

Put distributed files in your plugin repository's `assets/`. The build copies them into each installed side. Keep descriptors such as `plugin.json` at their required package locations and renderer code in the compiled bundle.

```js
import {createBundledPluginAssetClient} from '@dartwic/interface-sdk/assets';
// Use after the Interface plugin runtime has registered its host adapter.
const bundled = createBundledPluginAssetClient('my_driver');
const labels = await bundled.readJson('labels.json');
```

Bundled readers are read-only. Installation does not copy these files into a workspace; save user-authored changes through workspace helpers.

Engine plugins have matching asset APIs. Here `node_name` is the target Engine node and `layout` is your JSON document:

```cpp
const auto bundled_labels = api.pluginAssetPath("my_driver", "labels.json");
const auto reference = api.savePluginWorkspaceAsset(
    node_name, "my_driver", "layouts/operator.json", layout.dump());
const auto text = api.readPluginWorkspaceAsset(
    node_name, "my_driver", "layouts/operator.json");
```

C++ file/asset calls are synchronous and can block or throw. Interface helpers return Promises; awaiting a write establishes file-operation completion. Keep file/network work outside timing-sensitive callbacks. Generic storage APIs remain available when a workflow needs another scope.

# Check the saved result

Read back through the same helper and captured project. Check that only intended overrides were saved, reset restores inheritance, and a stale revision or disconnect leaves the UI reporting an unsaved change.

Follow [Config Map](Interface%20Plugin.md#share-configuration-with-config-map) when settings are part of a module/task editor rather than a standalone panel.
