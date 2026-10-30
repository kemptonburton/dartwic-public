---
summary: Build and operate a saved view of equipment, signals, graphs, and controls.
created: 2026-08-03T15:41
updated: 2026-10-29T18:30
---

A schematic is a saved operator display that puts measurements and controls beside the equipment they represent. Check the signals in [Channels](Channels.md) first; drawing a device does not configure its driver.

![A schematic with gauges, tanks, and controls beside a plugin-provided flight visualizer.](../Plugins/_attachments/Pasted%20image%2020261027000641.png)

The examples use project-specific resources and plugins; they are not included in every installation.

# Schematic Navigation

Open **Schematics** and choose a saved resource. Use **fit view**, pan, and zoom to inspect the canvas. To create one, right-click the resource list, choose **Create Resource**, name it, and open it.

![Creating a schematic from its resource list.](../Getting%20Started/_attachments/Pasted%20image%2020261026232104.png)

# Schematic Editing

Start with the part of the system you want an operator to understand, such as a tank's pressure and inlet valve. Each item you place on the drawing is a **node**, such as a gauge, valve symbol, button, or graph. Its **bindings** connect it to the channels it displays or commands. The **palette** is the collection of available nodes.

1. Click the pencil, **Enable schematic editing**.
2. Add a node from the palette or drag a channel from a supported list.
3. Select the node and configure its bindings, label, and appearance in **Context**.
4. Arrange the layout, check save/synchronization state, then disable editing.

Start with one channel display and compare it with Channels before adding more equipment. For a valve dropped from a channel list, check both command and state bindings; a matching `_state` channel may be selected automatically.

| Node | Main settings |
| --- | --- |
| Display or gauge | Measurement channel, label, units, and range. |
| Button, switch, or slider | Command channel and values/range. |
| Task control | Task identity and supported controls. |
| Graph | Series, axes, and time window. |
| Image / SVG | Asset and layout; **Import media node** adds reusable media to the palette. |

# Schematic Controls

A schematic can be used to operate the system as well as watch it. For example, a valve control sends a value to its command channel, while a separate position display shows what the device reports. Arrange both so the operator can check the response to an action.

Editing disables commanding. Once the layout is ready, disable editing and check **Commanding Enabled** before operating controls. With **Two-click commands**, the first click arms an action and the second confirms it.

Show command and independent feedback separately. After a valve command, check measured position; an accepted command does not establish physical movement. If a control is disabled or rejected, inspect its channel policy and controller. See [Channels and Control](../Engine/Channels%20and%20Control.md#policies) for authority rules and [Task Controls](Modules%20and%20Tasks.md#task-controls) for task operation.

# Graphs

Place a pressure graph beside the tank symbol to show how its reading has changed, rather than only its current value. A graph node can compare several signals over a chosen time window. Open a supported graph in **Telemetry** to inspect recorded history, then pause and use **Export telemetry** to download its range. See [Telemetry Graphs](Telemetry%20Graphs.md) for navigation and exports.

# 3D Equipment Models

A 3D model can show the shape and internal parts of equipment that are difficult to represent with flat symbols. You can color its parts from channel values, for example to show temperatures across an assembly.

Import a model in GLB or glTF 2.0 format with its supporting files. Configure part colors, including colors for unavailable or out-of-date readings; **X-ray** exposes internal parts. The model files save with the schematic. For custom node development, see the [schematic-node reference](../Plugins/Reference/Interface/Schematic%20Nodes/Overview.md).
