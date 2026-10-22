---
summary: Build drivers and operator tools with the public example plugin.
updated: 2026-10-21T15:14
created: 2026-08-03T15:41
---

Plugins extend the engine, the interface, or both. An engine plugin adds native modules, tasks, operations, and DCode functions. An interface plugin adds resources, task and module editors, settings, and schematic nodes.

## Start from the example

Clone the [DARTWIC example plugin](https://github.com/kemptonburton/dartwic-example-plugin). It is a standalone project with matching SDK snapshots and build scripts; you do not need the DARTWIC engine source.

```sh
git clone https://github.com/kemptonburton/dartwic-example-plugin.git my-dartwic-plugin
cd my-dartwic-plugin
npm ci
npm run verify
```

Use a tagged example version compatible with your installed host. Keep its bundled SDKs together; copying a newer header or interface type into an older SDK is not a supported upgrade.

| Build | Guide | Requirements |
| --- | --- | --- |
| Hardware driver or native service | [Engine Plugin](Engine%20Plugin.md) | C++ toolchain, CMake, vcpkg, and Node.js for the starter scripts. |
| Hardware I/O with fixed channels and native DCode automation | [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md) | An engine plugin plus the native DCode toolchain on the engine computer. |
| Operator page or configuration UI | [Interface Plugin](Interface%20Plugin.md) | Node.js and the bundled interface SDK. |
| Package for local use or distribution | [Packaging and Installation](Packaging%20and%20Installation.md) | Built output for every side enabled in the manifest. |
| Settings, private files or shared assets | [Storage and Settings](Storage%20and%20Settings.md) | Scope inventory, SDK examples and the 3D node asset pattern. |

## Files you will edit

```text
plugin.json                 # identity, version, supported hosts, included sides
engine/include/             # your C++ declarations
engine/src/                 # your native implementation and defaults
interface/src/              # your interface contributions
files/                      # optional files installed under the engine config root
```

The example's `engine/include/sdk` and `interface/sdk` are versioned SDK snapshots. The generated `plugin/` directory contains build output. Make source changes in the directories above, then rebuild.

For a complete API list, use the generated [Engine SDK reference](Reference/Engine/Overview.md) or [Interface SDK reference](Reference/Interface/Overview.md).

Before publishing, follow the [GitHub release contract](Packaging%20and%20Installation.md#github-release-contract) for exact platform ZIP filenames, the shared manifest, and the combined Release/Debug layout.
