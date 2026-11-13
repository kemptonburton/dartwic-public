---
created: 2026-11-08T16:30
updated: 2026-11-13T00:19
component: dartwic
releaseType: bundled
releaseMode: planned
impact: minor
version: dartwic-2-2-0
channel: stable
releaseTrain: dartwic-2-2-0
title: DARTWIC 2.2.0
summary: "DARTWIC 2.2 brings together the changes since 2.1.0. Schematics gets a rebuilt editor, richer readouts and controls, Tables for grouped layouts, and linked Portals for navigating larger projects."
publishedAt: 2026-11-13T00:00:00.000Z
artifacts:
  - id: engine
    name: "DARTWIC Engine"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-public/releases/tag/engine-v2.2.0"
  - id: interface-desktop
    name: "Desktop Interface"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-public/releases/tag/interface-desktop-v2.2.0"
    minEngineVersion: 2.2.0
  - id: interface-webserver
    name: "Webserver Interface"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-public/releases/tag/interface-webserver-v2.2.0"
    minEngineVersion: 2.2.0
  - id: interface-sdk
    name: "Interface Plugin SDK"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-public/releases/tag/interface-sdk-v2.2.0"
    minInterfaceVersion: 2.1.0
  - id: example-workspace
    name: "DARTWIC Example Workspace"
    version: 2.2.0
    delivery: source-repository
    githubRelease: "https://github.com/kemptonburton/dartwic-example-workspace/releases/tag/v2.2.0"
    githubRepository: "https://github.com/kemptonburton/dartwic-example-workspace"
    githubTag: "https://github.com/kemptonburton/dartwic-example-workspace/tree/v2.2.0"
    minEngineVersion: 2.2.0
    minInterfaceVersion: 2.2.0
  - id: example-plugin
    name: "DARTWIC Example Plugin"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-example-plugin/releases/tag/v2.2.0"
    minEngineVersion: 2.1.0
    minInterfaceVersion: 2.1.0
  - id: modbus-plugin
    name: "Modbus TCP Plugin"
    version: 1.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-modbus-tcp-client/releases/tag/v1.2.0"
    minEngineVersion: 2.1.0
    minInterfaceVersion: 2.1.0
  - id: labjack-plugin
    name: "LabJack T7 Plugin"
    version: 1.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-labjack-plugin/releases/tag/v1.2.0"
    minEngineVersion: 2.1.0
    minInterfaceVersion: 2.1.0
  - id: ethercat-plugin
    name: "EtherCAT Plugin"
    version: 2.2.0
    delivery: github-release
    githubRelease: "https://github.com/kemptonburton/dartwic-ethercat-plugin/releases/tag/v2.2.0"
    minEngineVersion: 2.1.0
    minInterfaceVersion: 2.1.0
  - id: docs
    name: "Documentation"
    version: 2.2.0
    delivery: documentation
    githubTag: "https://github.com/kemptonburton/dartwic-public/tree/docs-v2.2.0"
---

<!-- DARTWIC:RELEASE-ARTIFACTS:START -->
## Release artifacts

This is a bundled DARTWIC release. Each artifact is versioned and delivered separately.

| Artifact | Version | Minimum Engine | Minimum Interface |
| --- | --- | --- | --- |
| [DARTWIC Engine](https://github.com/kemptonburton/dartwic-public/releases/tag/engine-v2.2.0) | 2.2.0 | — | — |
| [Desktop Interface](https://github.com/kemptonburton/dartwic-public/releases/tag/interface-desktop-v2.2.0) | 2.2.0 | 2.2.0 | — |
| [Webserver Interface](https://github.com/kemptonburton/dartwic-public/releases/tag/interface-webserver-v2.2.0) | 2.2.0 | 2.2.0 | — |
| [Interface Plugin SDK](https://github.com/kemptonburton/dartwic-public/releases/tag/interface-sdk-v2.2.0) | 2.2.0 | — | 2.1.0 |
| [DARTWIC Example Workspace](https://github.com/kemptonburton/dartwic-example-workspace/releases/tag/v2.2.0) | 2.2.0 | 2.2.0 | 2.2.0 |
| [DARTWIC Example Plugin](https://github.com/kemptonburton/dartwic-example-plugin/releases/tag/v2.2.0) | 2.2.0 | 2.1.0 | 2.1.0 |
| [Modbus TCP Plugin](https://github.com/kemptonburton/dartwic-modbus-tcp-client/releases/tag/v1.2.0) | 1.2.0 | 2.1.0 | 2.1.0 |
| [LabJack T7 Plugin](https://github.com/kemptonburton/dartwic-labjack-plugin/releases/tag/v1.2.0) | 1.2.0 | 2.1.0 | 2.1.0 |
| [EtherCAT Plugin](https://github.com/kemptonburton/dartwic-ethercat-plugin/releases/tag/v2.2.0) | 2.2.0 | 2.1.0 | 2.1.0 |
| [Documentation](https://github.com/kemptonburton/dartwic-public/tree/docs-v2.2.0) | 2.2.0 | — | — |
<!-- DARTWIC:RELEASE-ARTIFACTS:END -->

## Overview

DARTWIC 2.2 brings together the changes since 2.1.0. Schematics gets a rebuilt editor, richer readouts and controls, Tables for grouped layouts, and linked Portals for navigating larger projects.

Task timing diagnostics reveal brief fast or slow cycles that an average can hide, with new ARGUS warnings to help investigate. Run scripts and control their tasks from the explorer, carry recorded values forward in CSV exports, and move Desktop tabs into separate windows. Channel pins, device plugin updates, and smaller Interface improvements round out the release.

![](_attachments/Pasted%20image%2020261112173128.png)

# Schematics

## Rebuilt editor

Arrange nodes with snapping, alignment guides, resizing, and rotation. 

![](_attachments/Pasted%20image%2020261112173542.png)

Draw routed edges, and connect edges onto other edges to create branches. Double click a section on a branch to select the branched edge.

![](_attachments/Pasted%20image%2020261112173619.png)

Edit shared settings across mixed selections with separate Node Config and Edge Config tabs.

![](_attachments/Pasted%20image%2020261112172307.png)

## General Node and shared settings

General Node brings body style, shape, artwork, readouts, commands, labels, and alerts into one configurable node. Built-in nodes reuse the same Node Setup and Node Appearance settings, with dedicated tabs for their own content. Browser presets provide starting configurations rather than locking a node to one look.

## Readouts

Readout replaces Parameter terminology. Choose Glyph, Card, Gauge, or horizontal/vertical Bar presets, then configure titles, units, sparklines, ticks, warning/danger thresholds, alignment, and independent readout sizing. Drag channels onto new or existing nodes to carry their titles and units. Bars resize along their direction; percentage mode uses the configured bounds.

![](_attachments/Pasted%20image%2020261112174001.png)

## Tables

Dock nodes into rows, columns, or shared cells, with previews showing where each drop will go. Configure headers, even or list alignment, flush or padded spacing, and shared colors. Nodes fit their allocated space while retaining their shapes; command-authority strips sit inside their bounds. Move the Table as a group.

![Readouts and controls arranged in a Table](_attachments/Pasted%20image%2020261112170646.png)

## Commands, Command Forms, and Switches

Controls pair commands with their `_state` feedback channel when available. Command Forms group numeric and Boolean inputs with live readback, labels, per-channel authority, and override controls. Switches support configurable state tabs, with Off/Close on the left and On/Open on the right by default. Disabled commanding keeps nodes readable and editable.

![](_attachments/Pasted%20image%2020261112172442.png)

## Fluid nodes

New Check Valve, Pump, Regulator, Three-Way Valve, Relief Valve, Burst Disc, Filter presets, and more expand the equipment palette. Pumps animate from running feedback with short startup/stop transitions. Tanks support configurable shapes and domed ends.

![](_attachments/Pasted%20image%2020261113001905.png)

## Active flow paths

Source/sink handle roles and valve/pump feedback highlight active sections of connected edges. 

A source is shown by an orange handle, and a sink / normal handle is white. When this valve is open, it will attempt to connect to the next sink and will highlight the edge when that sink is active if it has an active state, if not, it will pass on to the next node and check that.

In this case, that would be the next node, the heat exchanger. It has no active property, so the next valve is checked. The valve is not active, so therefore, it will not highlight to the next sink.

![](_attachments/Pasted%20image%2020261113001409.png)

When the next node that has a specific active state is active, it will light up the edges.

![](_attachments/Pasted%20image%2020261113001717.png)

Different flow paths can be specified also. In the case below we have 2 separate paths for this heat exchanger. This prevents both paths from lighting up if only one is active.

![](_attachments/Pasted%20image%2020261113001249.png)

Tanks participate in connected paths, Ties can carry or inhibit activity, and branches to inactive sources or closed dead ends remain dim. Custom artwork handles expose the same roles. 

![Equipment nodes and active paths](_attachments/Pasted%20image%2020261112170819.png)

## Portals

Navigate between matching links across project schematics, choose among destinations, and rename one link or its group. Optional display labels are independent of link names. Destination previews show connected-edge colors; Label mode provides an annotation without navigation.

![Linked Portal navigation](_attachments/Pasted%20image%2020261112171006.png)

## Schematic search

Ctrl+P finds schematic nodes by label, channel, type, or location, including unsaved edits. Search stays inside the schematic tab, uses full node previews, and centers/highlights the destination. Application-wide search uses the same result rows.

![Schematic node search](_attachments/Pasted%20image%2020261112171119.png)

## Remote Views

Browse saved views across the project, search by view or schematic name, open them independently, or locate their source region.

![Remote Views browser](_attachments/Pasted%20image%2020261112171145.png)

## Style selectors and colors

The Style menu applies **Flow**, **Border**, or **Background** across compatible selections. Flow colors selected Tank fills and outlines; Border edits the outline independently. Shared schematic colors, theme-following App colors, and the named Saved palette keep displays consistent. Conditional appearance and ARGUS highlights remain distinct from steady stale/missing-channel indications.

![](_attachments/Pasted%20image%2020261112172619.png)

## Artwork and custom nodes

Import media, place custom handles, edit SVG paints, and bind individual colors to channels. General Node can combine artwork with readouts and commands. Asset changes synchronize automatically. The updated Interface SDK exposes shared node/configuration building blocks and named gallery presets without requiring another renderer.

# Tasks

Task cards distinguish **Target**, **Average**, and **Cycle-to-cycle frequency**, with skipped cycles, failures, and execution time.

Task and named-loop `_actual_frequency` channels are renamed to `_average_frequency` because they measure completed callbacks per second over a sampling window. The measurement is unchanged; **Average** makes clear that it can hide brief fast or slow cycles even when the overall rate meets the target.

New `<task>_cycle_to_cycle_frequency_min` and `<task>_cycle_to_cycle_frequency_max` channels retain those extremes between consecutive starts. The ARGUS **Task timing variation** warning flags rates outside the allowed limits, recording the target, allowed range, and range at detection. This helps spot irregular timing in control loops and device polling. Shortcuts open the task and its warning settings.

![Task timing diagnostics](_attachments/Pasted%20image%2020261112170347.png)

![Task timing variation warning](_attachments/Pasted%20image%2020261112170452.png)

# Scripts

Run DCode directly from the Scripts explorer. Expand a script to see its registered tasks, sequences, timelines, and standalone loops, open them in Tasks, or use inline Start, Hold, and Stop controls. Task-name searches reveal the owning script; actions use checkmark confirmation. Running an open script saves its current editor contents first.

![Script explorer runtime controls](_attachments/Pasted%20image%2020261112170124.png)

# Exporting

Channels often record at different times, leaving blanks when another channel adds a CSV row. Enable **Carry forward last value** in Telemetry or Data → Databases exports to repeat each channel's last recorded value until its next sample. For example, a pressure reading of 42 psi fills later blank pressure cells until a new reading replaces it. This makes channels recorded on different schedules easier to compare.

In this example, pressure last recorded **42 psi** before the export starts. Flow has no earlier sample.

**Off**

| Time | Pump speed (rpm) | Pressure (psi) | Flow (L/min) |
| --- | ---: | ---: | ---: |
| 10:00:00 | 1200 | | |
| 10:00:01 | | 43 | |
| 10:00:02 | | | 9 |

**On** — bold values are carried forward.

| Time | Pump speed (rpm) | Pressure (psi) | Flow (L/min) |
| --- | ---: | ---: | ---: |
| 10:00:00 | 1200 | **42** | |
| 10:00:01 | **1200** | 43 | |
| 10:00:02 | **1200** | **43** | 9 |

The option starts off and changes only the exported CSV. It preserves timestamps and can use a sample from before the export range; without one, leading cells stay blank. Carried values can span recording gaps without an age limit, so they represent the last known reading. Writer columns identify actual samples only.

![](_attachments/Pasted%20image%2020261112172934.png)

# Smaller updates

- **Desktop:** detach and move resource tabs between windows while sharing the Engine connection.
- **Channel pins:** workspace-specific Pinned sections across Channel list and Modules / Tasks, retaining search, filters, ownership, and live status.
- **Updates:** better local Engine/update state handling, stock-asset synchronization, Windows updater dependencies, and the Engine 2.1.1 license-key fix.
- **Device plugins:** Signed 16-bit Modbus registers and live connection settings; configurable empty mappings and stale timeouts; a persistent EtherCAT discovery bridge.
- **Polish:** improved navigation/loading, plugin prerelease badges, refreshed schematic examples, SDK examples, and guides.

# Upgrading

Existing schematics may migrate to the new editor, but compatibility is not guaranteed. Keep a backup and check that your layouts, connections, readouts, and commands work correctly after upgrading. Some schematics may need manual fixes or rebuilding. Embedded draw.io diagrams no longer render and must be replaced with supported nodes or imported artwork.

Replace task and named-loop `_actual_frequency` references with `_average_frequency`; the metric is unchanged. Runtime responses now use `average_frequency` and `average_frequency_channel`. Update custom integrations and use Engine 2.2.0 with this Interface. Recorded history keeps its original names; legacy managed live-channel entries are not restored. Worker throughput remains `_worker_rate`.
