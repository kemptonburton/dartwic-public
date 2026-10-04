---
updated: 2026-06-23
created: 2026-06-23
---

Schematics are operator views built from live DARTWIC data. A schematic can combine channel displays, buttons, switches, sliders, graphs, task controls, images, embedded views, and plugin-provided nodes.

# What Schematics Are For

- creating a focused operator screen
- grouping related channels and controls
- making common actions easier to find
- showing live values in context
- adding graphs for important telemetry
- creating project-specific pages without forcing operators into raw channel search

# Common Node Types

- channel display
- channel button or command control
- switch
- slider
- task control
- live graph
- image or SVG
- embedded schematic node
- plugin-provided schematic node

# Operating From Schematics

A schematic control still writes through the engine. Command authority, stale state, and task ownership still matter. If a schematic control does not change a value, inspect the related channel in Channel Search and check `control_policy`, `control_owner`, and `active_controller`.

# Building Schematics

Administrators can add nodes, drag channels into the canvas, configure node settings, resize nodes, and save the schematic resource. Later docs should include screenshots for the editor toolbar, node palette, channel drag/drop, and context panel.

# Read More

- [Channel Search](Channel%20Search.md)
- [Commanding and Control](../Engine/Commanding%20and%20Control.md)
- [Plugins](Plugins.md)
- [Schematic Nodes Reference](../Plugins/Reference/Interface/Schematic%20Nodes.md)
