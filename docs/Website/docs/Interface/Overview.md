---
summary: Find the right view for your signals, automation, and recorded data.
created: 2026-08-03T15:41
updated: 2026-10-30T02:07
---

The Interface is the application you use to configure and operate a system, watch live signals, and review recorded runs. It connects to an **Engine**, which communicates with equipment, runs automation, and records data. For installation and your first connection, follow [First Session](../Getting%20Started/First%20Session.md).

The Interface and its guides are organized around four areas:

- **Navbar:** choose your Engine and project, search, read notifications, and check versions.
- **Resources:** open the views and files used to build and operate your setup.
- **Settings & User:** configure the application and Engine, manage plugins, and edit your profile.
- **Node, Context, and Project Board:** watch activity, inspect a selection, and review project actions beside your main view.

![The main areas of the Interface.](_attachments/Pasted%20image%2020261030010232.png)

# Navbar

The navbar runs across the top of the Interface and identifies the setup you are operating.

## [Navbar, Resources, and Settings](Navbar%2C%20Resources%2C%20and%20Settings.md)

Select your Engine and project, find resources with the searchbar, read notifications, and check software versions. This guide also explains opening resource lists, arranging tabs, and choosing Settings categories.

You can search things such as schematic nodes, channels, or text in resources:

![](_attachments/Pasted%20image%2020261030020445.png)

Edit settings:

![](_attachments/Pasted%20image%2020261030020709.png)

Or rearrange resource icons, install software updates, and check notifications.

# Resources

Resource icons in the upper left sidebar open views and project files. Choose the guide for the work you want to do.

## [Channels](Channels.md)

A channel is a named measurement, command, or status signal. Open **Channels** to find signals, inspect their values and source, see what controls them, or send a command.

The guide walks through the channel list:

![](_attachments/Pasted%20image%2020261030012024.png)

The module and tasks view:

![](_attachments/Pasted%20image%2020261030012102.png)

As well as the config map:

![](_attachments/Pasted%20image%2020261030012211.png)


## [DataFrames, Databases, and Exporting Data](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md)

Open **Data** to review recorded channels, events, and logs. Use databases to search history or dataframes to keep a named run's time range and filters together. This guide covers reviewing, exporting, and managing those recordings.

![The database catalog with recorded events open beside it.](../Engine/_attachments/Pasted%20image%2020261029010108.png)

## [Telemetry Graphs](Telemetry%20Graphs.md)

Telemetry graphs show how signals change over time, such as pressure rising during a fill. Open **Telemetry** to add traces, follow live measurements, pause and inspect history, or compare signals with events and logs. You can export the range you are investigating.

![A recorded run with channel traces, event intervals, and log output.](../Engine/_attachments/Pasted%20image%2020261029010151.png)

## [Modules and Tasks](Modules%20and%20Tasks.md)

**Modules** provide device connections or services through plugins. Open **Modules** to create a device instance, configure its connection, and inspect its status and linked tasks.

![](_attachments/Pasted%20image%2020261030011659.png)

**Tasks** perform work, such as reading device inputs, controlling pressure, or running a procedure. Open **Tasks** to create and configure them, start or stop work, and monitor progress and related channels.

![](_attachments/Pasted%20image%2020261030011744.png)
## [Network Map](Network%20Map.md)

Network Map draws the connections between your Interface, Engine, and other nodes. Open it to see who is connected, inspect traffic, and investigate communication problems. The guide also covers adding and managing peer connections.

![The Interface client connected to its Engine in Network Map.](../Engine/_attachments/Pasted%20image%2020261029010339.png)

## [Events and Logs](Events%20and%20Logs.md)

**Events** bring conditions to your attention and track how they are handled. Open **Events** to inspect related measurements, acknowledge or resolve a condition, answer a prompt, or release a hold. You can search live activity and history or export matching records.

![](_attachments/Pasted%20image%2020261030011937.png)

**Logs** preserve timestamped output explaining what happened. Open **Logs** to choose an Engine or plugin stream, follow incoming messages, search earlier output, and export a filtered range.

![](_attachments/Pasted%20image%2020261030011821.png)

## [Schematics](Schematics.md)

A schematic puts measurements and controls beside the equipment they represent. Open **Schematics** to use a saved operator display or build one from symbols, gauges, and graphs. The guide explains navigation, channel bindings, editing, and commanding.

![](_attachments/Pasted%20image%2020261030011501.png)


## [DCode Editor](DCode%20Editor.md)

DCode scripts define calculations, event conditions, and automated procedures. Open **Scripts** to create or edit a file, then save and activate it. The editor guide explains loaded-code indicators, parameters, errors, and opening the runtime work a script defines.

![](_attachments/Pasted%20image%2020261030012307.png)

# Settings & User

The gear and profile controls below the resource icons configure the application and identify the operator. Settings is also available before connecting.

## [Settings and User Profile](Navbar%2C%20Resources%2C%20and%20Settings.md#settings)

Choose a Settings category to change appearance, local folders, network discovery, your profile, or Engine configuration. General shows version and license information; Diagnostics helps investigate software health. Engine-specific pages require a connection.

![](_attachments/Pasted%20image%2020261030012332.png)

## [Plugins](Plugins.md)

Plugins add capabilities such as device drivers, editors, and display elements. Open **Settings → Plugins** to browse and install packages, inspect their Engine and Interface sides, change settings, or update and remove them.

![](_attachments/Pasted%20image%2020261030012434.png)

# Node, Context, and Project Board

The lower sidebar opens supporting panels beside your main view. The bottom node bar also opens node activity and shortcuts to aborts, holds, and prompts.

## [Node, Context, and Project Board](Node%2C%20Context%2C%20and%20Project%20Board.md)

Keep **Node Board** open to follow events and logs while working elsewhere.

![](_attachments/Pasted%20image%2020261030012901.png)


Use **Context** to inspect or configure the selected item, like schematic node settings

![](_attachments/Pasted%20image%2020261030014757.png)

Use **Project** to find references and review renames, deletions, or cleanup. This guide walks through those panels and their action results.

![](_attachments/Pasted%20image%2020261030014927.png)
