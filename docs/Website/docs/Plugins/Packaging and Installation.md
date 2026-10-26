---
summary: Package a plugin, publish its GitHub release, and install or list it in the browser.
updated: 2026-10-26T14:17
created: 2026-10-04T18:31
---

A plugin package contains the manifest and built files DARTWIC needs to install an extension. The **Engine side** supplies native code; the **Interface side** supplies the UI bundle. A plugin can include either side or both.

The plugin browser downloads packages from GitHub releases and installs each side into its own host. A valid release can be installed by repository link; a registry entry also makes it discoverable in the public list.

![](_attachments/Pasted%20image%2020261025233820.png)

Start from the [example plugin](Overview.md#start-from-the-example), which comes with build scripts produce the expected format. This guide covers packaging, GitHub releases, browser installation, and adding your plugin to the list.

# Package format

## Manifest

The combined example uses this complete manifest:

```json
{
  "id": "example_device_plugin",
  "name": "Example Device Plugin",
  "description": "A device driver and its operator tools.",
  "author": "Your team",
  "version": "2.0.0",
  "minEngineVersion": "2.0.0",
  "minInterfaceVersion": "2.0.0",
  "contains_engine_plugin": true,
  "contains_interface_plugin": true
}
```

Use a stable ID matching the runtime definition and every `<id>` directory. Both `contains_*` fields must be booleans, with at least one enabled. An Engine side requires `minEngineVersion`; an Interface side requires `minInterfaceVersion`.

These are tested minimum host versions, independent of the plugin's own version. SemVer ordering applies: a minimum of `2.0.0` rejects `2.0.0-beta.1`. See [Versioning and Compatibility](../Getting%20Started/Compatibility%2C%20Licensing%2C%20and%20Tiers.md#versioning-and-compatibility) for the ecosystem's version rules.

## Archive layout

Every plugin ZIP, including an Interface-only `plugin.zip`, has exactly one top-level `plugin/` directory:

```text
plugin/
  engine/<id>/
    plugin.json
    bin/<id>.dll              # Windows Release; lib<id>.so on Linux
    bin/<runtime dependencies>
    ...                       # native configuration/default files
  engine-debug/<id>/
    plugin.json
    bin/<id>.dll              # Windows Debug; lib<id>.so on Linux
    bin/<id>.pdb              # Windows debug symbols
    bin/<debug runtime dependencies>
    ...
  interface/<id>/
    plugin.json
    ui/index.js
    ...                       # UI assets
  # Each engine/interface plugin directory may contain assets/.
  # Authored example workspaces are distributed separately.
```

All included manifests must match the root release manifest. Choose directories and release archives from the sides your plugin enables:

| Plugin contains | Include | Release archive |
| --- | --- | --- |
| Engine code, optionally with UI | `engine/`, `engine-debug/`, and `interface/` when enabled | `plugin-win32-x64.zip` and/or `plugin-linux-x64.zip` |
| Interface code only | `interface/` | Portable `plugin.zip`, shown as **Any platform** |

Native packages include **Release and Debug together**. The Engine installs the matching directory. Bundle its runtime libraries beside the native binary; Windows Debug includes PDB symbols, and Linux Debug retains debug information.

Each host selects its own platform. A Windows Interface connected to a Linux Engine uses the Windows archive for UI and the Linux archive for native code. Keep UI identical across native platform archives. Missing platforms report an unavailable download; they cannot fall back to another OS or a portable native ZIP.

## Bundled assets

The plugin source `assets/` directory is copied into each built plugin side's `assets/`. Update and uninstall operate on that managed plugin directory. Archives containing loose `plugin/files/` payloads are rejected by the Engine; plugins must not inject default files into a user's workspace during installation. Distribute an example workspace separately. Runtime authoring uses the [plugin workspace asset helpers](Storage%20and%20Settings.md#shared-and-bundled-assets).

# Build a package

From the plugin root:

```sh
npm ci
npm run verify
npm run package
```

For native plugins, run packaging on each supported platform. The starter builds Release and Debug together plus the enabled Interface side, validates the output, and writes a platform ZIP and SHA-256 receipt. `package-debug` is an alias for that same complete package. Interface-only packaging produces one portable `plugin.zip`. Packaging does not deploy or publish.

| Build | Prerequisites |
| --- | --- |
| Interface only | Node.js and a ZIP utility. |
| Windows native | Node.js, CMake, vcpkg (`VCPKG_ROOT`), and Visual Studio 2022 with ClangCL. |
| Linux native | Node.js, CMake, vcpkg, Clang, Ninja, `zip`, and the development dependencies required by `vcpkg.json`. |

Verify the built plugin on a compatible host, including its external library requirements, before publishing. Package checks alone do not verify hardware.

# Publish a GitHub release

Commit the source and root `plugin.json` to a public GitHub repository. Create a release for the same source version: for example, tag `v2.0.0` for version `2.0.0`, and attach the root manifest and generated packages directly as release assets:

```text
v2.0.0
  plugin.json                 # required shared manifest
  plugin-win32-x64.zip         # Windows x64; upload if supported
  plugin-linux-x64.zip         # Linux x64; upload if supported
  release-manifest.json        # optional checksums produced by the tooling
```

For an **Interface-only release**, attach `plugin.json` and `plugin.zip` instead of native platform ZIPs. Filenames are exact and case-sensitive. Native plugins cannot use the portable ZIP; separate `plugin-debug.zip` files are unsupported. GitHub's automatic source ZIP/TAR is not an installable package.

Keep `plugin.json` in the tagged source too; browser hosts read it there. The tag, uploaded manifest, and manifests inside the ZIP must identify the same plugin version. Include a README with setup, supported hardware, dependencies, and troubleshooting.

For example, after collecting both native platform builds:

```sh
gh release create v2.0.0 plugin.json plugin-win32-x64.zip plugin-linux-x64.zip --target main --title "2.0.0" --notes-file RELEASE_NOTES.md
```

For an Interface-only release:

```sh
gh release create v2.0.0 plugin.json plugin.zip --target main --title "2.0.0" --notes-file RELEASE_NOTES.md
```

Attach `release-manifest.json` when using the generated receipt. Combine checksums when collecting builds from several platforms.

# Install from the plugin browser

The interface can automatically install engine and interface plugins. Connect to the Engine you intend to extend and open **Settings → Plugins → Browse Plugins**.

![](_attachments/Pasted%20image%2020261025232743.png)

Search for a plugin and inspect its README, compatible release, and enabled sides. Choose **Install** and check the result for each side.

![](_attachments/Pasted%20image%2020261025233048.png)

Restart the selected Engine when prompted to load native code. The Interface side loads immediately. Depending on the project size, relaunching the engine could take some time. You can also choose to restart later by clicking the Cancel button.

![](_attachments/Pasted%20image%2020261025233703.png)

Be sure to check the plugins README, as vendor libraries and device permissions may need separate setup.

Read more in [Plugins](../Interface/Plugins.md#read-installation-status) for installed, loaded, queued-update, and failure states.

## Install an unlisted GitHub plugin

A valid release can be installed before the plugin joins the public list. Choose the link icon, **Open plugin from GitHub**, in **Settings → Plugins**.

![](_attachments/Pasted%20image%2020261025233345.png)

Paste the public repository URL, such as `https://github.com/owner/repo`.

![](_attachments/Pasted%20image%2020261025233550.png) Choose **View plugin** to preview its release and compatibility. Read the details and choose **Install**.

Use the repository URL rather than a downloaded ZIP. It goes through the same release checks as a listed plugin. Public listing is a separate step.

# Add your plugin to the public list

Once the release is installable, submit a pull request to [`dartwic-public/data/plugin-registry.json`](https://github.com/kemptonburton/dartwic-public/blob/main/data/plugin-registry.json). Add an object to its JSON array:

```json
{
  "id": "example_device_plugin",
  "name": "Example Device Plugin",
  "author": "Your team",
  "description": "A device driver and its operator tools.",
  "repo": "your-org/your-plugin-repository"
}
```

Match `id` to the manifest and use `owner/repository` for `repo`. After acceptance, users can find it in the public list. The registry points to your repository; releases supply versions and downloads. New releases do not require a registry edit unless the listing metadata changes.

# Install locally during development

For a local development installation, set the destination roots and let the starter copy the correct files:

```powershell
$env:DARTWIC_ENGINE_DIR = 'C:\DARTWIC\engine'
$env:DARTWIC_INTERFACE_DIR = 'C:\DARTWIC\interface'
npm run deploy
```

You can also copy `deployment-settings.example.json` to `deployment-settings.json` and set `engine_dir` and `interface_dir`.

`deploy-debug` targets a debug engine; `deploy:interface` rebuilds and copies only UI.

The `package.zip` and the `package.json` are copied into the files below:

| Package source           | Installation destination                                             |
| ------------------------ | -------------------------------------------------------------------- |
| `plugin/engine/<id>/`    | `<engine-directory>/plugins/<id>/`                                   |
| `plugin/interface/<id>/` | `<interface-host-root>/plugins/<id>/`                                |
| Bundled assets           | `assets/` inside the installed Engine or Interface plugin directory. |

The engine must be stopped before the new files are copied over, and must start with the new files to load it into memory. The interface can stay on, as it is capable of hot-reloading the new files, just reload the interface.

Start the Engine and reload the Interface after a manual copy. In **Settings → Plugins**, check each side's files, installed version, loaded version, and any load error.

![](_attachments/Pasted%20image%2020261025231632.png)
