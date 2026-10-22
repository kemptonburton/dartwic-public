---
summary: Get a free license, activate your engine, and understand compatibility, tiers, and offline renewal.
updated: 2026-10-21T21:11
created: 2026-08-03T15:41
---

Check compatibility and runtime capacity separately. A plugin can meet its minimum engine version and still exceed an installation's resource limits.

## Version requirements

| Component | Compatibility check |
| --- | --- |
| Python and React clients | Verify connected engine metadata against their minimum engine version. |
| Engine plugin | Declares `minEngineVersion`; native output must also match the host platform and runtime. |
| Interface plugin | Declares `minInterfaceVersion`. |
| Combined plugin | Must satisfy the requirements for each installed side. |

Use a matching tagged SDK/example version when building plugins. A minimum-version declaration does not repair a binary built for another OS, architecture, or incompatible C++ runtime.

## Get a free license

Public signup offers a free **EARLY_ACCESS** license with unlimited module instances, channels, tasks, engine plugins, interface plugins, and engine installations. No email or account is required. You can also run without a key using the smaller built-in **FREE** tier below.

To get a key:

1. Open [DARTWIC downloads](/areas/dartwic/downloads) and choose **Get license**.
2. Optionally answer **What are you working on?** and **Organization**. You can leave both blank.
3. Choose **Generate free key**, then copy and save the generated key shown in the popup.

Keys are generated randomly. **No email, account, or payment is required.** Optional answers help us understand how DARTWIC is used. Engine activation separately records the installation ID, machine fingerprint, and engine version for its offline license.

**Use one key on as many engine installations as you want, including engines running at the same time.** Each installation activates separately. You do not need another key for each engine.

Save your key with your configuration. There is no email-based recovery; if you lose it, generate another while signup is open. A replacement does not disable the previous key. Retrying an interrupted request in the same popup retrieves that request's key instead of issuing another.

## Put the key in your engine configuration

Stop the engine before editing its configuration. A direct launch from an extracted release package uses **`engine/instances/default/config.json`**. A workspace node uses its selected local instance under `engine/instances/<instance-id>/`. Set the existing top-level `license_key` property to the key copied from the website:

```json
{
  "license_key": "dwlic_<your-generated-key>"
}
```

This example shows only the license setting. Keep the other properties in your existing file, and replace the placeholder with your complete generated key. The key belongs in the engine's local configuration, not the workspace or Desktop Interface connection settings.

If your deployment sets `DARTWIC_CONFIG_DIR`, edit `config.json` inside that directory instead. The engine prints **Config directory:** at startup to identify the location it is using.

Save the file and start the engine with internet access. It activates the key and creates `license.json` beside `config.json`. You do not need to create or edit that signed file. Each installation gets its own activation; keep its `license.json` and `.dartwic-license-state.json` with that installation rather than copying them between machines.

The startup log should report the **EARLY_ACCESS** tier for a newly issued free license. For a complete first connection walkthrough, see [First Session](First%20Session.md).

## Tiers and capacity

| Resource | Without a key: FREE | Free license: EARLY_ACCESS |
| --- | --- | --- |
| Module instances | 1 | Unlimited |
| Channels | 100 | Unlimited |
| Tasks | 3 | Unlimited |
| Engine plugins | 1 | Unlimited |
| Interface plugins | 1 | Unlimited |

The current free early-access offer also allows unlimited engine installations per key. **Unlimited** describes resource and installation limits; it is not a promise of permanently free access. Early-access availability and terms may change.

These are runtime limits, not a pricing table. Existing or separately issued licenses can have different entitlements. Built-in engine diagnostics are treated separately from licensed project capacity where the runtime applies its exclusions.

## Offline use and renewal

First activation requires internet access. The engine then saves a signed offline license, normally valid for **one calendar month**, capped by the license's entitlement end date. A valid cached license continues to work without contacting the licensing service.

At startup, the engine checks that saved license. If it is missing, expired, or invalid, it tries online activation or renewal using the configured key. If that fails, the engine uses the built-in FREE limits. Reconnect to the internet and restart to retry.

The one-month offline period does not mean you need to request a new key each month. Keep the same key configured. Current validation happens at startup; an already-running engine does not periodically renew or stop when its offline license expires. Changes to a license cannot immediately invalidate a previously issued offline document.

## Check your license state

The engine reports its license state, tier name, message, and effective entitlements in `dartwic/get-runtime-metadata`. Inspect only the fields needed for troubleshooting:

```python
response = client.operation("dartwic/get-runtime-metadata")
response.raise_for_error()
license_info = response.payload.get("license", {})
print(license_info.get("state"), license_info.get("tier"))
print(license_info.get("message"))
print(license_info.get("entitlements", {}))
```

An entitlement value of `-1` means unlimited. Use the reported tier, message, and entitlements to confirm the capacity actually active on that installation.

## Resolve a failure

If a connection reports an old engine, update to a compatible host/client combination. If a plugin cannot load, check the side's minimum version and native dependencies. If creation or installation reports a capacity limit, inspect the entitlement and existing resources before retrying.

If the engine remains on FREE limits after signup, check the key against the website's result, confirm you edited the configuration directory printed at startup, and restart with internet access. Signup creates the license record; adding the key to `config.json` activates the installation. Generating a different key does not renew or reactivate a revoked or expired key. Use the engine's license message when asking for help.
