---
summary: Choose where settings, private device configuration, runtime files, and shared assets belong.
updated: 2026-10-28T18:11
created: 2026-10-05T15:38
---

Plugins often need to remember settings, read device configuration, or save files such as calibration data and operator layouts. This page explains **where that data belongs** and which SDK helpers to use.

The main choice is whether the data should travel with the workspace, stay private to one Engine, or ship with the plugin. The examples below cover each case.

| You want to save… | Start with… |
| --- | --- |
| A plugin-wide default or project override | [Layered settings](#defaults-and-overrides). |
| A device connection or task mapping | [Module/task configuration](#module-configuration-and-private-values). |
| Private credentials, recordings, or generated data | [Instance folders](#instance-folders). |
| A shared calibration file, layout, or model | [Workspace assets](#shared-and-bundled-assets). |
| Files shipped with your plugin | [Bundled assets](#bundled-files). |

The examples use `my_driver` as the manifest ID. Interface calls use `operation` from `useDartwic()`; C++ calls use an `SDK_API& api`. The [Interface](Reference/Interface/Storage/Overview.md) and [Engine](Reference/Engine/Storage/Overview.md) storage references cover the full APIs.

# Storage scopes

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

Only cache data should be disposable. Keep needed recordings and private settings when clearing generated files. [Configuration and Storage](../Engine/Configuration%20and%20Storage.md#instance-data) has the Engine paths; [Tracking a Workspace in GitHub](../Getting%20Started/Tracking%20a%20Workspace%20in%20GitHub.md) covers sharing the complete workspace.

# Module configuration and private values

Device connections and task mappings already have a home in the project. A module's connection parameters normally live in `modules/<instance>.json`, under `parameters`; task scheduling and mappings belong to task configuration. Use those resources so the plugin and its editors work with the same configuration. [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md#configs) shows both, and [Config Map](Interface%20Plugin.md#config-map-editors) explains how to edit them in the Interface.

If a device also needs credentials specific to one Engine, keep those in the instance's private settings folder:

```cpp
using Json = nlohmann::json;
const auto privateConfig = api.readStorageJson(
    "settings", "my_driver/device_credentials.json", Json::object(), "default");
const auto token = privateConfig.value("token", std::string{});
if (token.empty()) throw std::runtime_error("Configure this Engine's device token.");
```

Save with `writeStorageJson("settings", path, value, project)`. This stores local JSON without encryption. The helpers do not detect secrets placed in workspace files.

# Defaults and overrides

Plugin-wide options, such as a discovery interval or display precision, can have defaults in code, a shared workspace value, and an override for one project:

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

## Read and change a setting

A read returns the **effective** settings after merging the layers, plus a **revision** identifying the version you read. Supply that revision when saving to prevent an older edit from overwriting newer changes. `sources` identifies each setting's layer.

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

## Reset an override

Reset an override to inherit from the layer below it again. Identify the setting with its JSON pointer:

```js
const saved = await storage.readEffectiveSettings(defaults, project);
await storage.resetSettingsOverride('project', [
    '/plugins/my_driver/discovery_interval_ms',
], {project, revision: saved.revision});
```

Resetting a project override reveals the workspace value; resetting a workspace override reveals the code default unless a project overrides it. Resetting a section removes all its overrides at that scope. In pointer tokens, escape `/` as `~1` and `~` as `~0`.

Read back with your defaults after saving to check the effective value; the write response does not retain defaults from an earlier read. On a revision conflict, reload the settings and reconcile the edit before saving again.

## Apply settings to running code

Saving a setting makes it persistent, but does not automatically change running code. At load time, the Engine merges plugin settings into the configuration passed to the factory without rewriting `plugin.json`. For later changes, your plugin must reread and safely apply them, or require a restart. Keep file reads and JSON parsing outside high-frequency task loops.

Core policies also have their own timing; for example, [recording configuration](../Engine/Recording%20and%20Telemetry.md#recording-capacity) requires an Engine restart.

## Autosaved settings panels

Autosave lets someone edit settings without pressing a Save button. The [example plugin](https://github.com/kemptonburton/dartwic-example-plugin) uses a 500 ms debounce for display precision and unit labels. Its `interface/src/settings.mjs`, `settingsAutosave.mjs`, and `useDisplaySettings.jsx` show the storage calls, save queue, and React integration.

When building a similar panel:

- Validate drafts before queuing; an empty numeric input is not automatically zero.
- Queue only changed fields and save them sequentially, using each returned revision.
- Keep newer user edits when an older save response arrives.
- Flush on blur/cleanup and show pending, saved, or failed state. Keep failed changes available for retry; reload and reconcile revision conflicts.

The queue is example code, not an SDK export. Use command APIs for device commands and Interface storage for personal display preferences.

## Settings persistence checks

Before relying on a settings panel, read back through the same helper and captured project. Check that only intended overrides were saved, reset restores inheritance, and a stale revision or disconnect leaves the UI reporting an unsaved change.

# Scoped file helpers

Calibration documents, generated previews, and other files can use scoped helpers to select their storage location. Each helper chooses a root and validates the relative path:

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

Engine code uses `readStorageJson` / `writeStorageJson` with scopes `installation`, `instance`, `workspace`, `project`, `settings`, `runtime`, or `cache`. A write atomically replaces one file; your plugin handles schema changes and coordination across files.

General storage/settings calls require admin access unless explicitly allowed. Relative-path checks help prevent misplaced files, but native plugins still run with the Engine process's filesystem access.

# Shared and bundled assets

An **asset** is a reusable file referenced by a project, such as a layout or model. Keep user-authored assets separate from files distributed with the plugin:

| Kind | Location and lifetime |
| --- | --- |
| Shared plugin-authored file | `workspace/assets/plugins/<plugin-id>/`; travels with the workspace. |
| Other shared asset | `workspace/assets/<namespace>/`; reusable across projects. |
| Bundled file | Installed plugin's `assets/`; replaced by updates and removed on uninstall. |

## Shared plugin files

Workspace asset helpers are useful when several projects need the same layout, model, or calibration file. Use your manifest ID to group plugin-authored files, and save the returned reference in the schematic or resource:

```js
import {createPluginWorkspaceAssetClient} from '@dartwic/interface-sdk/assets';
const authored = createPluginWorkspaceAssetClient(operation, 'my_driver');
const reference = await authored.saveJson('layouts/operator.json', {version: 1});
const layout = await authored.readJson('layouts/operator.json');
// reference: assets/plugins/my_driver/layouts/operator.json
```

Subdirectories are supported and filenames need an extension. Use `createWorkspaceAssetClient` for other shared namespaces. For example, the [3D model node](../Interface/Schematics.md#3d-equipment-models) stores a shared model package and keeps `asset_path` in its node data.

Asset helpers read and write UTF-8 text or JSON. Encode binary content in a validated text format, and validate loaded documents against your plugin's schema. Reads are cached per operation callback; invalidate after external edits or use a new filename. Failed reads are evicted.

An asset may be used by several projects. Check those references before deleting a shared file.

Engine plugins can save and read the same assets. Here `node_name` is the target Engine node and `layout` is your JSON document:

```cpp
const auto reference = api.savePluginWorkspaceAsset(
    node_name, "my_driver", "layouts/operator.json", layout.dump());
const auto text = api.readPluginWorkspaceAsset(
    node_name, "my_driver", "layouts/operator.json");
```

## Bundled files

Files that ship with the plugin, such as labels or default layouts, belong in its source `assets/` directory. The build copies them into each installed side. These files are replaced on update and removed on uninstall, so save user-authored changes through workspace helpers.

```js
import {createBundledPluginAssetClient} from '@dartwic/interface-sdk/assets';
// Use after the Interface plugin runtime has registered its host adapter.
const bundled = createBundledPluginAssetClient('my_driver');
const labels = await bundled.readJson('labels.json');
```

Bundled readers are read-only, and installation leaves these files in the plugin directory. Engine plugins locate them with `pluginAssetPath`:

```cpp
const auto bundled_labels = api.pluginAssetPath("my_driver", "labels.json");
```

C++ file/asset calls are synchronous and can block or throw. Interface helpers return Promises; awaiting a write confirms file-operation completion. Keep file/network work outside timing-sensitive callbacks.
