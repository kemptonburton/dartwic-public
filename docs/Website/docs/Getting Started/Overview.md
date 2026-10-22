---
summary: Connect your equipment, write control logic, and build a workspace your team can use.
updated: 2026-10-14T14:58
created: 2026-09-04T17:13
---

DARTWIC brings data acquisition, controls, and an operator interface into one application. You can connect sensors and equipment, write the logic that operates them, and build diagrams that show what is happening while you run a test.

It began with rocket testing, where changing a sensor or valve often meant changing several different tools. The aim is to keep the useful parts of a control system together so the next person can understand and extend it without starting over.

## How it fits together

Imagine a small test stand with a pressure sensor and a valve. A driver connects the equipment to the **engine**, the process that gathers data and runs your control logic. It publishes the pressure as a **channel**: a named value that the rest of the system can read.

You can put that pressure on a graph, show it beside the valve on a schematic, or use it in a DCode script. **DCode** is DARTWIC's automation language. A script might convert the sensor reading into engineering units, fill a tank to a target pressure, or run a sequence of steps. These use the same channels that the operator sees.

The **Interface** is where you configure and operate the system. A workspace keeps your projects together; each project holds its scripts, tasks, device configuration, and schematics. You can start with an existing driver and configure a project, then write a plugin or connect an external application when you need something specific.

During a run, channel history, events, and logs help explain what happened. You can review a time range and export the measurements alongside the events from that run.

## Try it without hardware

The [example workspace](Example%20Workspace.md) includes a simulated test stand with sensors, valves, a fill-and-ignition sequence, and faults you can inject. Start there to see the pieces working together, then follow an exercise to change a calculation or controller.

For a smaller introduction, [First Session](First%20Session.md) takes you through opening a workspace and running a simple script. You do not need to write a hardware driver to begin.

## Build your own system

- [Engine](../Engine/Overview.md) explains channels, tasks, modules, and recording.
- [Interface](../Interface/Overview.md) covers the tools used to configure and operate a project.
- [DCode](../DCode/Overview.md) shows how to write calculations, conditions, and procedures.
- [Plugins](../Plugins/Overview.md) explains how to add a driver or extend the Interface.
- [Clients](../Clients/Overview.md) connects Python scripts, dashboards, and other applications to an engine.

If your system spans several computers, [TEMPEST Peer](../Engine/TEMPEST%20Peers.md) connects named nodes and makes their channels available together. [DARTWIC Ecosystem](DARTWIC%20Ecosystem.md) explains where each piece runs, and [Tracking a Project in GitHub](Tracking%20a%20Project%20in%20GitHub.md) covers moving your project between machines and sharing it with a team.