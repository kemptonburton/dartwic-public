---
summary: Find signals, operate automation, and review data in the DARTWIC interface.
updated: 2026-10-23T15:51
created: 2026-08-03T15:41
---

The interface is your workspace for a running engine. The top bar identifies the connected node and active project. The left navigation opens resource types; resources open in tabs, and the context panel shows details for the current selection.

Markdown documents, plugin READMEs, release notes and chat responses share readable
typography: regular-weight prose, normal letter spacing, compact headings and
subtle inline code that follows the text baseline. Code blocks retain their
monospace presentation, highlighting and copy controls.

## Find the right view

| View | Use it to… |
| --- | --- |
| [Channel Search](Channel%20Search.md) | Find current values, inspect metadata and authority, and open graphs. |
| [Schematics](Schematics.md) | Arrange live signals, diagrams, plots, and controls into an operator view. |
| [Tasks](Managing%20Tasks.md) | Start, stop, or hold automation and inspect execution diagnostics. |
| [ARGUS Events](ARGUS%20Events.md) | Investigate conditions, acknowledge events, answer prompts, and release holds. |
| [Logs](Logs.md) | Follow live text output or search historical output by stream, session, severity, and time. |
| [Data](Recorded%20Data.md) | Browse recorded channel, event, and log databases, or group a test in a [dataframe](DataFrames.md). |
| [Telemetry Exporter](Telemetry%20Exporter.md) | Compare historical signals and download CSV. |
| [Network Map](Network%20Map.md) | Inspect clients, remote nodes, TEMPEST peer connections, and traffic. |
| [Plugins](Plugins.md) | Install drivers and additional interface tools. |
| [Settings](Settings.md) | Configure interface preferences, engine connection settings, retention, [diagnostics](Diagnostics.md), and plugins. |

Scripts and module configuration are also resources. [Workspace and Resources](Workspace%20and%20Resources.md) explains navigation and project files.

An administrator connection can command and configure the engine. **Connect as viewer** opens the permitted read-only views without a username or password when the engine allows viewers. [Viewer access](Workspace%20and%20Resources.md#viewer-access) explains the available controls.

**Disconnect** returns to the node chooser and stops automatic reconnection. If the network drops while the Interface is open, it stays on the connected page and tries to recover. Reloading that window attempts to reconnect to its active node once; if that fails, it returns to the chooser and later reloads stay disconnected. Closing and reopening starts disconnected. Saved nodes remain available for explicit selection. An explicit connection link is consumed once; a successful connection then follows the same reload behavior.

The version menu's yellow download icon signals an available update. Open the menu to see the same icon beside each Interface or Engine version that has a newer release.

## Reading live state

The interface receives telemetry asynchronously. A graph's update interval controls the display subscription; it does not set the device sampling rate or task frequency. A stale value is the last known value whose freshness threshold has expired. A missing value means the channel could not be found. Neither is a new zero measurement.

Engine-side [command authority](../Engine/Commanding%20and%20Control.md) determines whether a control can write. After a command, inspect the command value and the separate hardware feedback signal when the driver provides one.

New to the app? Follow [First Session](../Getting%20Started/First%20Session.md).
