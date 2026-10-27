---
summary: Package a plugin, publish its GitHub release, and install or list it in the browser.
updated: 2026-10-27T00:11
created: 2026-10-04T18:31
---

A plugin package contains the manifest and built files DARTWIC needs to install an extension. The **Engine side** supplies native code; the **Interface side** supplies the UI bundle. A plugin can include either side or both.

The Plugin Browser downloads packages from GitHub releases and installs each side into its own host. A valid release can be installed by repository link; adding it to the public list makes it discoverable in search.

![](_attachments/Pasted%20image%2020261025233820.png)

For your own plugin, the [example project](Overview.md#example-plugin) includes the build and deployment scripts used below. Configure its manifest, build and test locally, then publish a release when it is ready to share. If you already have a plugin to install, go to [Plugin Browser installation](#install-from-the-plugin-browser).

# Package format

The manifest tells DARTWIC what your plugin provides and which hosts it supports. The package contains the files for those enabled sides. The starter produces this layout for you.

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

Set minimum host versions to the oldest releases you have tested. They are independent of your plugin's version; a minimum of `2.0.0` also excludes `2.0.0-beta.1`. See [Versioning and Compatibility](../Getting%20Started/Compatibility%2C%20Licensing%2C%20and%20Tiers.md#versioning-and-compatibility) for the version rules.

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

Native packages include **Release and Debug together** so the Engine can install the matching build. Runtime libraries belong beside the native binary; include PDB symbols for Windows Debug and retain debug information for Linux Debug.

Each host downloads its own platform archive. For example, a Windows Interface connected to a Linux Engine uses the Windows archive for UI and the Linux archive for native code. Keep UI identical across native archives, and publish an archive for each supported platform. A missing platform is shown as unavailable.

## Bundled assets

Put files shipped with the plugin in its source `assets/` directory. The build copies them into each plugin side, where updates replace them and uninstall removes them. [Storage and Settings](Storage%20and%20Settings.md#shared-and-bundled-assets) explains how to keep user-authored files separately.

Distribute example workspaces separately. Installation must not add default files to a user's workspace; the Engine rejects loose `plugin/files/` payloads.

# Build a package

Packaging creates an installable ZIP for sharing or publishing. Install the tools for the sides you have enabled before running the build:

| Build | Prerequisites |
| --- | --- |
| Interface only | Node.js and a ZIP utility. |
| Windows native | Node.js, CMake, vcpkg (`VCPKG_ROOT`), and Visual Studio 2022 with ClangCL. |
| Linux native | Node.js, CMake, vcpkg, Clang, Ninja, `zip`, and the development dependencies required by `vcpkg.json`. |

From your plugin's root directory:

```sh
npm ci
npm run verify
npm run package
```

The starter builds the enabled sides, validates the output, and writes a ZIP and SHA-256 receipt. Native packages contain Release and Debug together; run packaging on each supported platform. Interface-only plugins produce one portable `plugin.zip`. `package-debug` is an alias for the same complete packaging command.

Packaging leaves the output on your computer. Use [local deployment](#install-locally-during-development) to test it on a compatible host, including any device connections and external libraries, before publishing.

# Install locally during development

Local deployment lets you try changes in DARTWIC before publishing a release. The starter rebuilds the enabled sides and copies their directories into your installation.

Install the [build prerequisites](#build-a-package) and run `npm ci` in your plugin repository first. Stop the target Engine before replacing its native files. Then set the installation roots and deploy from the plugin directory:

```powershell
$env:DARTWIC_ENGINE_DIR = 'C:\DARTWIC\engine'
$env:DARTWIC_INTERFACE_DIR = 'C:\DARTWIC\interface'
npm run deploy
```

Replace these paths with your installations. Alternatively, copy `deployment-settings.example.json` to `deployment-settings.json` and set `engine_dir` and `interface_dir`. Only destinations for the sides being deployed are required.

`npm run deploy-debug` targets a Debug Engine; `npm run deploy:interface` rebuilds and copies only UI.

The starter copies the built plugin directories, including their manifests and bundled assets:

| Build output             | Installation destination                                             |
| ------------------------ | -------------------------------------------------------------------- |
| `plugin/engine/<id>/`    | `<engine-directory>/plugins/<id>/`                                   |
| `plugin/interface/<id>/` | `<interface-host-root>/plugins/<id>/`                                |
| Bundled assets           | `assets/` inside the installed Engine or Interface plugin directory. |

Start the Engine and reload the Interface after deploying or manually copying files. In **Settings → Plugins**, check each side's installed and loaded versions and any load error.

![](_attachments/Pasted%20image%2020261025231632.png)

# Publish a GitHub release

A GitHub release lets the Plugin Browser download and install your plugin. Commit the source and root `plugin.json` to a public repository, then create a release for that version. For example, version `2.0.0` uses tag `v2.0.0` with these attached assets:

```text
v2.0.0
  plugin.json                 # required shared manifest
  plugin-win32-x64.zip         # Windows x64; upload if supported
  plugin-linux-x64.zip         # Linux x64; upload if supported
  release-manifest.json        # optional checksums produced by the tooling
```

For an **Interface-only release**, attach `plugin.json` and `plugin.zip` instead. Use the exact, case-sensitive filenames shown here. Native plugins require platform ZIPs containing both build types; separate `plugin-debug.zip` files are unsupported. GitHub's automatic source archives are not installable packages.

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

# Add your plugin to the public list

Public listing makes your plugin discoverable in the Plugin Browser. Once its release is installable, submit a pull request to [`dartwic-public/data/plugin-registry.json`](https://github.com/kemptonburton/dartwic-public/blob/main/data/plugin-registry.json) with an entry in its JSON array:

```json
{
  "id": "example_device_plugin",
  "name": "Example Device Plugin",
  "author": "Your team",
  "description": "A device driver and its operator tools.",
  "repo": "your-org/your-plugin-repository"
}
```

Match `id` to the manifest and use `owner/repository` for `repo`. Once accepted, the listing points to your repository and its releases. Update the registry only when listing details change; new releases need no registry edit.

# Install from the plugin browser

The Plugin Browser installs the enabled Engine and Interface sides from a compatible release. Connect to the Engine you intend to extend and open **Settings → Plugins → Browse Plugins**.

![](_attachments/Pasted%20image%2020261025232743.png)

Search for a plugin and read its README for setup, vendor libraries, and device permissions. Check its compatible release and enabled sides, then choose **Install** and check the result for each side.

![](_attachments/Pasted%20image%2020261025233048.png)

The Interface side loads immediately. Restart the selected Engine when prompted to load native code, or choose **Cancel** to restart later. Restarting a large project can take some time.

![](_attachments/Pasted%20image%2020261025233703.png)

[Plugins](../Interface/Plugins.md#installation-status) explains installed, loaded, queued-update, and failure states.

## Install an unlisted GitHub plugin

A valid release can be installed before the plugin joins the public list. Choose the link icon, **Open plugin from GitHub**, in **Settings → Plugins**.

![](_attachments/Pasted%20image%2020261025233345.png)

Paste the public repository URL, such as `https://github.com/owner/repo`.

![](_attachments/Pasted%20image%2020261025233550.png)

Choose **View plugin** to preview its release and compatibility, then read the details and choose **Install**.

Use the repository URL rather than a downloaded ZIP. It goes through the same release checks as a listed plugin. Public listing is a separate step.
