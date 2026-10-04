---
updated: 2026-06-23
created: 2026-06-23
---

DARTWIC is most useful when it is tied to a specific operational question. These examples show the common shapes.

# Live Monitoring

Use the interface to watch a focused set of channels, confirm freshness, and keep the important values visible while a system is running.

Good fit when you need to know:

- what the system is doing now
- whether telemetry is fresh
- whether a value has gone stale or stopped updating
- which task or module is driving a behavior

# Commanded Operation

Use writable channels or task controls when an operator needs to deliberately change runtime state.

Good fit when you need to:

- start or stop a task
- hold automation while preserving state
- release a hold after a check
- request a target value or target state
- make a manual override with visible authority state

# Automation Tasks

Use engine tasks or DCode when behavior needs to run inside the runtime instead of from an external script.

Good fit when you need:

- periodic logic
- long-running worker behavior
- state-machine sequencing
- channel calculations
- operator prompts or ARGUS events from runtime logic

# Historical Analysis

Use recorded channels, range queries, bucketing, and exports when the question is about what happened over time.

Good fit when you need:

- a quick trend
- a CSV handoff
- a Python analysis pass
- a bounded replay of selected channels

# Project-Specific Workflows

Use plugins and resources when the workflow is not just raw telemetry. A plugin can package the labels, controls, pages, resources, and runtime modules that make sense for one project.

# External Data Source Or Device Driver

Use an engine module when DARTWIC needs custom C++ lifecycle for a device, PLC, simulator, database, or external service.

Good fit when you need:

- connection management
- polling or streaming from an external system
- protocol-specific reads and writes
- channel creation from an external source
- ARGUS events when the integration disconnects or fails

Start with [Modules](../Engine/Modules.md), then [First Engine Plugin](../Plugins/First%20Engine%20Plugin.md).

# External Analysis Or Client App

Use the Python or React clients when another process needs to connect to a running engine.

Good fit when you need:

- Python analysis
- dashboards
- scripted checks
- custom external tooling
- React surfaces outside the main interface

# Client Example

- [Python Query Example](../Clients/Python%20Query%20Example.md)
