---
summary: Help an operator turn a detected device into a module, channels, and tasks.
updated: 2026-10-20T18:59
created: 2026-10-14T15:04
---

Discovery helps someone configure a device without starting from an empty module form. The plugin detects an endpoint and offers a setup; the operator reviews that offer before creating project resources.

The [Modbus TCP plugin](https://github.com/kemptonburton/dartwic-modbus-tcp-client) demonstrates the complete flow. Its discovery loop is separate from the read/write tasks described in [Building a Hardware Driver](Building%20a%20Hardware%20Driver.md).

## Detect an endpoint

Modbus discovery runs on a 1 Hz plugin loop. It checks configured targets and can scan bounded IPv4 ranges. A TCP probe rejects closed ports before read-only Modbus requests inspect responding addresses. Discovery itself does not write device outputs.

Discovery settings belong to the plugin's workspace settings. The device's address, unit ID, and transaction timeout become module parameters; register mappings become task arguments.

A responding register tells you that an address answered. It does not tell you the sensor name, engineering units, multi-register encoding, or whether a write is appropriate. The offer identifies its confidence as `address_response_only`; use the device register map to finish the configuration.

## Keep the offer current

The plugin sends a `dartwic.module-discovery` request through `requestInterfaceUi`. It gives the endpoint a stable discovery ID and a presence lease. The Modbus offer uses a 15-second lease and updates or withdraws it as presence changes.

Before announcing, it checks whether the operator has already configured that endpoint or muted its offer. Keep this behavior in a new driver too: repeated scans should refresh one useful suggestion, not create a new notification every second.

The endpoint is identified by host and port, with unit ID included when scanning multiple units. Presence means the offer is still relevant; the configured module and tasks report the later connection and acquisition state.

## Suggest channels and tasks together

The Modbus offer contains four groups: coils, discrete inputs, holding registers, and input registers. Its range editor lets the operator select addresses and the appropriate read or write mapping.

The provisioning description ties those selections together:

| Part | Modbus example |
| --- | --- |
| Module | Local type `tcp_client`, suggested instance name, endpoint parameters. |
| Channel suggestions | Selected addresses and proposed channel names. |
| Read task | Local task type `read`, with `read_mappings`. |
| Write task | Local task type `write`, with `write_mappings`. |
| Identity | Parameter keys used to recognize an already configured endpoint. |

The plugin supplies the supported choices; the host's provisioning workflow creates the selected resources. Do not hard-code a second set of mappings in the Interface after generating them in the engine.

See [the Modbus announcement implementation](https://github.com/kemptonburton/dartwic-modbus-tcp-client/blob/main/engine/src/modbus_device_discovery.cpp) for the full payload and [Interface UI and Notifications](Reference/Engine/Interface%20UI%20and%20Notifications/Overview.md) for the SDK.

## Verify the configured device

After accepting the offer, inspect the created module's endpoint and each task's selected module and mappings. Start with reads, confirm expected values, and enable outputs only after checking their device meaning.

Test disappearance, return, an already configured endpoint, and a muted offer. A successful provisioning response establishes configuration creation; confirm connection, task diagnostics, and actual readings separately.

The [example workspace](../Getting%20Started/Example%20Workspace.md) lets you try accepting an offer in a disposable workspace without scanning real equipment.
## Shared resource presentation

Plugin authors supply structured resource descriptions; the host owns the setup layout. Use `DARTWIC::API::DiscoveryResources` from `<sdk/discovery/DiscoveryResources.h>` and its `toJson()` helper. It contains `channels` (`name`, `label`, `direction`) and `loops` (`name`, `label`). Names may contain `{instance}`, replaced with the chosen module instance name.

Put resources created by module initialization in `provisioning.resources`. Put resources created by a suggested task in that task editor descriptor's `resources`. Editable device/channel bindings remain in `channel_suggestion_editor`; the shared UI displays a task's fixed resource declarations beneath its editable bindings. Do not put task-created channels in the module's resources, and do not describe a plugin-wide discovery loop as a module-created loop.

These descriptors preview the owning lifecycle's effects. They do not create channels or loops themselves, and do not change task arguments. The host creates the selected module and tasks through the existing provisioning plan. The Configure step keeps the module identity in the selection sidebar; the main area uses expandable browser-style sections for Setup, Created with Module, and each suggested task or loop. Setup starts open. Collapsing a section keeps its draft selections and channel names. All three steps show the instance name above a smaller line containing the module icon, module type name and plugin icon; hovering the plugin icon identifies the plugin. Select and Review use the same table component for their header, row styling and full-height scrolling. Review has Module, Address and Module Map columns; Module Map covers the proposed tasks, channels and loops. The module instance name uses compact text, with the module type and icons beneath it; the Module Map column lists task names with counts, a single Module Channels count row when needed, and individual named rows for module-created loops. Map rows stay on one line: long names truncate with the full name available on hover, while counts remain visible. Each step uses the full available dialog height for scrolling, keeping the step header and footer visible. It does not repeat every channel.

The example plugin's module creates no channels or loops. Its suggested Read task declares 22 editable device outputs and five fixed simulation input channels; its Write task declares nine editable command bindings. Both use the same shared setup UI.

LabJack, Modbus and EtherCAT use these same resource descriptors. Each module declares its connection-status channel. Modbus read/write tasks each declare four diagnostic channels, EtherCAT's cyclic task declares four, and LabJack's stream task declares seven. Their connection monitors are shared plugin loops, not additional loops created per module.

Editable channel names use the shared channel picker. Selecting an existing channel or entering a new name only changes the provisioning draft; channel creation happens when the plan is applied. Required channels use the same rows with checked, disabled checkboxes and disabled pickers. Configure uses compact rows and controls. In range editors, use the chevron immediately after the mapping name to expand individual channel names; its tooltip shows the channel count. Automatic LabJack digital state channels follow their command channel names and cannot be renamed separately.

Address-range task options may declare `readback_suffix` for an automatically derived state channel and `mapping` for device-specific mapping defaults; group-level `mapping` defaults apply first. Task editor `arguments` supply setup defaults while preserving base provisioning task arguments. The selected mapping table replaces only its declared `argument_key`.
