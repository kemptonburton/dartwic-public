---
summary: Understand DARTWIC versioning, Engine licensing, and what each tier provides.
created: 2026-08-03T15:41
updated: 2026-10-26T21:52
---

DARTWIC's components have their own versions and compatibility requirements. Engine licenses determine the available tier and resource limits. This guide introduces how those pieces fit together, including license activation and offline use.

# Versioning and Compatibility

DARTWIC uses release versions, minimum host requirements, and internal compatibility versions to describe which components work together.

## Release versions

The Engine, Interfaces, clients, SDKs, and plugins have their own release versions, such as `2.1.3`. These use semantic versioning: major, minor, and patch, with optional prerelease labels such as `2.1.0-beta.1`.

| Part | Purpose |
| --- | --- |
| Major | Identifies a major release and potentially incompatible public changes. |
| Minor | Identifies feature additions within that release line. |
| Patch | Identifies fixes and smaller compatible updates. |
| Prerelease label | Identifies a development, beta, or release-candidate build before the stable version. |

Components can release independently. An Interface and Engine do not need identical release numbers, and a plugin's version identifies that plugin's own releases.

Interface and Engine versions, as well as release notes, can be viewed in the Interface version selector. Here you can select, download, and install a new version to update your project automatically.

![](_attachments/Pasted%20image%2020261025135220.png)

## Minimum Engine and Interface versions

Minimums identify the earliest Engine or Interface release that supplies the features a component or workspace needs.

| Requirement | Used for |
| --- | --- |
| `minEngineVersion` | Engine capabilities required by Interfaces, clients, Engine plugins, and workspace/project dependencies. |
| `minInterfaceVersion` | Interface capabilities required by Interface plugins and workspace/project dependencies. |

A combined plugin has requirements for both sides. For example, a plugin released as `1.4.0` could require Engine `2.1.0` because it uses an operation introduced there. These numbers describe different things. The plugin browser in the interface shows these versions on the plugin page, as well as the platform supported.

![](_attachments/Pasted%20image%2020261025135506.png)

Minimum comparisons include prerelease ordering:

```text
2.0.0-beta.1 < 2.0.0-beta.2 < 2.0.0
```

A minimum of `2.0.0` rejects those betas. Build metadata such as `+build.7` does not change version precedence.

As DARTWIC develops, we aim to add and improve features while keeping existing plugins, SDK integrations, and client code working without rebuilding or rewriting them. A new feature should raise only the requirements of consumers that actually need it. Updating the Engine does not by itself mean every plugin needs a new minimum or rebuild.

## Internal compatibility versions

Some changes affect the binary or communication contract between components. When preserving the old contract is not possible, a separate internal version identifies the incompatible change. These development counters are independent of release numbers and minimum host versions.

**ABI** means application binary interface: the compiled functions and data layouts that a host and loaded module agree on.

| Internal version | What it protects | When it changes |
| --- | --- | --- |
| Engine plugin ABI (`engine_plugin_abi`) | The compiled boundary between the Engine and native plugins built with its SDK. | Compiled interfaces or data layouts become incompatible with existing plugin binaries. Plugins need a matching SDK rebuild and may need source changes. |
| Interface plugin host (`interface_plugin_host`) | The runtime contract between an Interface plugin bundle and its host. | Host APIs or integration behavior change incompatibly. Affected plugins need an updated SDK integration and rebuilt bundle. |
| TEMPEST compatibility (`tempest_compatibility`) | Registration and communication between Engines, Interfaces, clients, and built-in TEMPEST peers. | The shared communication contract changes incompatibly. Connected components need compatible packages; custom integrations may need protocol changes. |
| Native DCode module ABI (`native_dcode_module_abi`) | The compiled boundary between the Engine and generated Native C++ DCode modules. | Generated modules and the host can no longer use the same compiled interface. Native artifacts need regeneration and compilation for that host. |
| Updater protocol (`updater_protocol`) | The update messages and job format understood by hosts and updater tooling. | Update requests, job formats, or handoff behavior change incompatibly. Hosts, updater tooling, and update packages need to support the same protocol. |

Each counter belongs to its own boundary. An Engine plugin ABI change does not automatically change TEMPEST, and a native DCode ABI change does not itself change the DCode language. Compatible fixes and release-number changes do not require these counters to increase.

Hosts check the applicable internal contract; a higher Engine release number or a satisfied minimum cannot make a mismatched binary or protocol compatible. Incompatible changes need an explicit compatibility review, with release notes explaining affected integrations and any rebuild or migration work.

Build extensions against the matching tagged SDK/example release. Native binaries must also match the host OS, architecture, and C++ runtime. See [Packaging and Installation](../Plugins/Packaging%20and%20Installation.md) and [Clients](../Clients/Overview.md) for their specific requirements.

# Licensing and Tiers

Only the Engine requires a license, the interface does not. If you are a new team member wanting to connect to an existing engine your team is already running, all you have to do is download the interface and connect. See [First Session](First%20Session.md).

The engine can run without a license key using the built-in **FREE** tier. A free **EARLY_ACCESS** license provides unlimited module instances, channels, tasks, engine plugins, interface plugins, and engine installations. No email or account is required.

## Get a free license

You can download a free unlimited license key on the the [Downloads](https://kemptonburton.com/areas/dartwic/downloads) page. Click the Get License button, enter the optional information, and generate a key. 

![](_attachments/Pasted%20image%2020261024160310.png)


Keys are generated randomly. **No email, account, or payment is required.** Optional answers help us understand how DARTWIC is used. Engine activation separately records the installation ID, machine fingerprint, and engine version for its offline license.

**Use one key on as many engine installations as you want, including engines running at the same time.** Each installation activates separately. You do not need another key for each engine.

Save your key with your configuration. There is no email-based recovery; if you lose it, generate another while signup is open. A replacement does not disable the previous key. Retrying an interrupted request in the same popup retrieves that request's key instead of issuing another.

## Engine license configuration

Stop the engine before editing its configuration. The packaged starter uses **`engine/instances/default/config.json`**. If you select another instance at launch or open a different workspace through the Interface, use that instance's `config.json` under `engine/instances/<instance-id>/`. Set the existing top-level `license_key` property to the key copied from the website:

```json
{
  "license_key": "dwlic_<your-generated-key>"
}
```

This example shows only the license setting. Keep the other properties in your existing file, and replace the placeholder with your complete generated key. The key belongs in the engine's local configuration, not the workspace or Desktop Interface connection settings.

Save the file and start the engine with internet access. It activates the key and creates `license.json` beside `config.json`. You do not need to create or edit that signed file. Each installation gets its own activation; keep its `license.json` and `.dartwic-license-state.json` with that installation rather than copying them between machines.

The startup log should report the **EARLY_ACCESS** tier for a newly issued free license. For a complete first connection walkthrough, see [First Session](First%20Session.md).

## Tiers and capacity

A tier determines how many modules, channels, tasks, and plugins an Engine can use.

| Resource | Without a key: FREE | Free license: EARLY_ACCESS |
| --- | --- | --- |
| Module instances | 1 | Unlimited |
| Channels | 100 | Unlimited |
| Tasks | 3 | Unlimited |
| Engine plugins | 1 | Unlimited |
| Interface plugins | 1 | Unlimited |

The current free early-access offer also allows unlimited engine installations per key. **Unlimited** describes resource and installation limits; it is not a promise of permanently free access. Early-access availability and terms may change.

Existing or separately issued licenses can have different resource limits. Built-in Engine diagnostic channels are treated separately from the licensed project channel capacity where the runtime applies its exclusions.

## Offline use and renewal

First activation requires internet access. The engine then saves a signed offline license, normally valid for **one calendar month**, capped by the license's entitlement end date. A valid cached license continues to work without contacting the licensing service.

At startup, the engine checks that saved license. If it is missing, expired, or invalid, it tries online activation or renewal using the configured key. If that fails, the engine uses the built-in FREE limits. Reconnect to the internet and restart to retry.

The one-month offline period does not mean you need to request a new key each month. Keep the same key configured. Current validation happens at startup; an already-running engine does not periodically renew or stop when its offline license expires. Changes to a license cannot immediately invalidate a previously issued offline document.
