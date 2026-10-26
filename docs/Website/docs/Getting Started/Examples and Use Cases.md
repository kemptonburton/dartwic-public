---
summary: Choose a starting point for monitoring, automation, and integration.
updated: 2026-10-26T02:12
created: 2026-08-03T15:41
---

# Run the simulated test stand

The [example workspace](Example%20Workspace.md) brings together a simulated test stand, DCode automation, and a separate flight peer. Open it to try a fill-and-ignition timeline, inspect sensor calculations and valve control, and record a run without physical hardware.

# Monitor a test stand

Install the driver plugin, configure a module for each device, and find its signals in [Channels](../Interface/Channels.md). Put pressures, temperatures, and command controls on a [schematic](../Interface/Schematics.md). Start a [dataframe](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#mark-a-live-run) with the recorded channels and event/log selection before the run, then stop it afterward to retain the time range.

# Automate a fill sequence

Use a [state machine](../DCode/Tasks.md#state-machine-tasks) for stages such as idle, filling, and complete. Use [channel calculations](../DCode/Channel%20Calculations.md) for unit conversion and a dependency-driven [event condition](../DCode/Events.md) for a limit response that must run when a measurement is committed. Check [command authority](../Engine/Channels%20and%20Control.md) so the sequence and operator controls have explicit ownership.

# Review a run

Open its [DataFrame](../Interface/DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md) to review recorded signals, events, and logs. Use the [Telemetry Graphs](../Interface/Telemetry%20Graphs.md) to graph a time window or export raw CSV, or export the frame as a ZIP to include its ARGUS records. The [Python client](../Clients/Python%20Client.md) provides the same history queries for repeatable analysis.

# Combine several nodes

Connect the engines through [TEMPEST Peer](../Engine/Networking%20and%20Peers.md), then inspect the [Network Map](../Interface/Network%20Map.md). Use node-qualified channel references in shared views. Keep latency-sensitive decisions on the node that acquires the signal and controls the output; remote observations include network delay.

# Add a device or operator tool

Follow [Building a Hardware Driver](../Plugins/Building%20a%20Hardware%20Driver.md) to follow the Modbus plugin’s module, fixed-channel read/write tasks, and device discovery. Use the example workspace to practice with a simulated device first. Start an operator UI from the [example plugin](../Plugins/Overview.md). The [packaging guide](../Plugins/Packaging%20and%20Installation.md) covers local installation and repository publication.
