---
summary: Build drivers and operator tools with the public example plugin.
updated: 2026-10-27T00:40
created: 2026-08-03T15:41
---

Plugins extend DARTWIC with device drivers, native services, and operator tools. A plugin can add Engine behavior, Interface tools, or both, using the same internal APIs and frameworks DARTWIC uses.

For example, Modbus device drivers and custom tasks:

![](_attachments/Pasted%20image%2020261027000245.png)

Or custom ways to visualize your projects:

![](_attachments/Pasted%20image%2020261027000641.png)

Plugins can be automatically downloaded within the interface through the Plugin Browser from the public manifest, or from manually pasting a GitHub link.

![](_attachments/Pasted%20image%2020261025233820.png)

# Plugin Types

The two sides of a combined plugin share one manifest ID. The Engine side supplies behavior; the Interface side supplies controls and presentation. The [Engine](Engine%20Plugin.md#plugin-lifecycle) and [Interface](Interface%20Plugin.md#plugin-lifecycle) guides explain how each side loads and is removed.

| Type | Runs in | Typical use |
| --- | --- | --- |
| Engine | The Engine process, as native C++ code. | Device connections, tasks, operations, and DCode functions. |
| Interface | The Interface, using the host's React runtime and Engine connection. | Operator pages, task and module editors, settings panels, and schematic nodes. |
| Combined | Both hosts, with each side installed separately. | A device driver with its configuration editors and operator controls. |

# Plugin Guides

Below you can find some guides to help get started quickly in building your first plugin.

| Guide | Purpose |
| --- | --- |
| [Engine Plugin](Engine%20Plugin.md) | Native plugin configuration, lifecycle, registrations, and Engine APIs. |
| [Interface Plugin](Interface%20Plugin.md) | UI plugin configuration, lifecycle, contributions, and host APIs. |
| [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md) | A walkthrough connecting a device module, read/write tasks, discovery, and configuration UI. |
| [Building a Custom Peer](Building%20a%20Custom%20Peer.md) | Add an Engine peer type using a custom transport or a bridge to another protocol. |
| [Packaging and Installation](Packaging%20and%20Installation.md) | Build prerequisites, packages, local installation, and GitHub releases. |
| [Storage and Settings](Storage%20and%20Settings.md) | Settings, private files, shared workspace assets, and bundled files. |

# Example Plugin

If you are building your first plugin, the [DARTWIC example plugin](https://github.com/kemptonburton/dartwic-example-plugin) gives you a working starting point to learn from and adapt. Its simulated device shows how Engine behavior and Interface tools fit together, with matching SDK snapshots and build scripts already included. It is a standalone project, so you do not need the DARTWIC Engine source.

To try it, install Git and Node.js, then clone the project using the commands below. Use a tagged example version compatible with your installed host. Keep its bundled SDKs together; copying a newer header or Interface type into an older SDK is not a supported upgrade.

```sh
git clone https://github.com/kemptonburton/dartwic-example-plugin.git my-dartwic-plugin
cd my-dartwic-plugin
npm ci
npm run verify
```

`npm run verify` checks the starter's source files and bundled SDK consistency. To build the Engine side, first install the native tools listed in [build prerequisites](Packaging%20and%20Installation.md#build-a-package). Then follow the relevant plugin guide to add your implementation.

# Source Layout

The example keeps native code, Interface tools, and bundled assets in separate folders so you can find the part you want to change.

```text
plugin.json                 # identity, version, supported hosts, included sides
engine/include/             # your C++ declarations
engine/src/                 # your native implementation and defaults
interface/src/              # your Interface contributions
assets/                     # bundled files copied into each installed plugin side
```

The example's `engine/include/sdk` and `interface/sdk` are versioned SDK snapshots. The generated `plugin/` directory contains build output. Make source changes in the directories above, then rebuild.

Before publishing, follow the [GitHub release contract](Packaging%20and%20Installation.md#publish-a-github-release) for exact platform ZIP filenames, the shared manifest, and the combined Release/Debug layout.
