---
summary: Build and operate a saved view of equipment, signals, graphs, and controls.
created: 2026-08-03T15:41
updated: 2026-10-30T14:30
---

A **schematic** is a saved operator display that brings measurements and controls together. This is a walkthrough of the editor and shared node-and-edge workflow, not an exhaustive guide to every node or its options.

# Open or Create a Schematic

Open **Schematics** in the left sidebar and select a saved display, or right-click its resource list and choose **Create Resource** to name a new one. It opens as a canvas in its own tab.

![The schematic canvas and editor toolbar.](_attachments/Pasted%20image%2020261030030010.png)

# Editor

Use the toolbar above the canvas to change editing, commanding, and navigation settings. Hover an icon to see its name.

![](_attachments/Pasted%20image%2020261030030939.png)

## Schematic Editing

The **pencil** enables editing so you can arrange nodes and edges. Use **Undo / Redo** or **Ctrl+Z / Ctrl+Y** to reverse or restore changes. Use **Ctrl + C** or **Ctrl + V** to copy and paste nodes.

## Commanding

**Commanding** enables or disables operator actions. Leave edit mode before operating the display; editing disables commanding. Check device feedback after a command. For disabled or rejected controls, inspect [channel authority](../Engine/Channels%20and%20Control.md#policies).

## Two-Click Commands

Enable **Two-click commands** to arm an action with the first click and confirm it with the second. The affect this has on nodes depends on the node type. This setting is recommended to be turned on, it is to prevent accidental commands being sent by clicking on a node once, i.e., opening a valve with only one click.

![](_attachments/Pasted%20image%2020261030032119.png)

## Other Controls

Use **Fit view** to frame the layout and the **lock** to switch between automatic fitting and manual pan/zoom. **Snap to grid** helps alignment, and **Background** changes the canvas pattern and color.

**Background node interactivity** toggles editing of background nodes. Check save/synchronization status when finished.

# Nodes

A **node** is an item placed on the canvas. Available types and settings depend on DARTWIC and your installed plugins; this guide covers their shared workflow rather than every node's options.

![](_attachments/Pasted%20image%2020261030032710.png)

## Quick Add

With editing enabled, drag a channel from **Channels** onto empty canvas and choose a node from the drop menu. Channel displays/cards, labels, controls, valves, sliders, and switches are initialized from the dropped channel.

![](_attachments/Pasted%20image%2020261030032940.png)

Drop onto a supported existing node to configure it instead. Displays use the channel as their source, graphs add a series, tanks use it for fill level, and controls update their channel bindings.

Controls, valves, sliders, and switches also look for a matching `_state` channel. For example, drop `inlet_valve` to command it and automatically use `inlet_valve_state` as feedback if that channel exists.

## Quick Inspect

To quickly inspect a nodes channels and info, you can right click a node to see its channels graphed. The channels can then be opened in Channel Searcher by clicking the search button.

![](_attachments/Pasted%20image%2020261030143052.png)

## Add and Configure Nodes

Enable editing, open **Context → Nodes**, and search or browse the palette. Drag a node onto the canvas, then select it to show its settings under **Configuration** in [Context](Node%2C%20Context%2C%20and%20Project%20Board.md#context).

![](_attachments/Pasted%20image%2020261030033213.png)

Configure its channel bindings and available appearance or behavior options, then position and resize it. Compare bound values with [Channels](Channels.md) to check the configuration.

![](_attachments/Pasted%20image%2020261030033126.png)

## Commanded and Actual Values

With separate **Command channel** and **State channel** bindings, supported nodes show feedback alongside a **blue commanded indicator** when the values differ. The blue difference closes as feedback catches up. For example, a valve can show the requested position while its measured position is still changing. 

In the example below, I have taken manual override of the the `_state` channel that produces this valves actual state. The valve command `valves_valve_1` is set to 1, and the blue indicator on the valve is showing `1`, `OPEN`, but the valve itself is not opening.

The valve is also yellow because it is tied to an ARGUS warning that was reported by the loop trying to write the `_state` channel could not.

![](_attachments/Pasted%20image%2020261030033529.png)

If I release manual override on the `_state` channel, the valve then turns.

![](_attachments/Pasted%20image%2020261030034050.png)


## Channel States

Nodes that support commands have a **Control Bar** around the outside of the node. The bar reflects the nodes command channel's authority. **Free** allows permitted writes, **Automatic** means automation owns control, and **Observe only** reserves writes for its publisher. **Automatic override** gives another automation action priority; **Manual override** gives the operator control.

![](_attachments/Pasted%20image%2020261030141306.png)

Supported controls use orange authority accents for manual override and red for automatic override. **Stale** and **Not Found** also change a node's appearance when its data is old or unavailable. See [Channel States](Channels.md#channel-states) and [Control Policies](../Engine/Channels%20and%20Control.md#policies) for details.

![](_attachments/Pasted%20image%2020261030141423.png)

## ARGUS Events

A node shows an ARGUS event when a channel it uses also appears in the event's **Channels**. For example, a display using `tank_pressure` can show a high-pressure event that includes `tank_pressure`. Bound channels are matched automatically; add other channels under **General → Events → Extra channels** in Configuration.

Ordinary events appear only while **New** and firing; acknowledging them or ending their firing removes the node alert. **Holds** and **prompts** remain visible while awaiting release or a response, even after acknowledgement or firing ends. **Resolved**, **Silenced**, **Deleted**, and **Stale** events do not appear. Ordinary events also disappear when their firing state becomes unknown.

The node flashes red for errors or aborts, yellow for warnings or holds, and blue for prompts. If several events match, the highest-priority color is used. Hover the node to see its matching alerts, then click one to open it in the board. See [Events and Logs](Events%20and%20Logs.md#events) for event states and actions.



## Node Gallery

The Node Gallery shows all the current nodes in there different states for reference. Open **Context → Nodes** and click **Node Visual Gallery** in the node browser toolbar. 

![](_attachments/Pasted%20image%2020261030140752.png)

It shows side-by-side examples of node appearances, control policies, events, and stale or missing data. Use the command button to enable simulated controls, then try the two-click toggle and example commands. The Disabled example stays disabled.

Control Nodes are nodes that control a specific thing, like a Channel or Task.

![](_attachments/Pasted%20image%2020261030141929.png)

![](_attachments/Pasted%20image%2020261030141946.png)

Parameter Nodes are nodes that display something that is read-only, like a value or parameter.

![](_attachments/Pasted%20image%2020261030142024.png)
## Media Imports

You can add an image or SVG in two ways.

**Use a Media node:** add a **Media** node to the schematic, then double-click it or choose **Edit media** in its Configuration. Choose your media, adjust its crop and size, and click **Apply**. This configures that node directly; its configuration is saved with the schematic.

![](_attachments/Pasted%20image%2020261030142544.png)

**Import a reusable schematic node:** choose **Import media node → Choose media** in the Nodes palette. Select your media, give it a name and category, and choose **Add to node browser**. You can then drag the named entry onto schematics in that project.


![](_attachments/Pasted%20image%2020261030142321.png)


In both cases, the connected Engine saves the artwork in `<workspace>/assets/media/`. Imported reusable definitions are saved separately in `<workspace>/<project>/schematic_nodes/<category>/<name>.json`. Keep the whole workspace when sharing or backing it up so the artwork travels with the nodes. See [Workspace Sharing](../Engine/Configuration%20and%20Storage.md#workspace-sharing).

## 3D Equipment Models

For custom 3D artwork, use **Open 3D editor** in the node's configuration to import a GLB or glTF model. Set its view and choose **Apply view and settings**. These are special media-import workflows; other nodes provide their own configuration options.

![](_attachments/Pasted%20image%2020261030142140.png)

You can select different parts of the model and change its color based on a channel value, to show the model reacting to data in real time.

![](_attachments/Pasted%20image%2020261030142216.png)


# Edges

An **edge** draws a connection between nodes, helping show how the equipment or parts of your display relate.

![](_attachments/Pasted%20image%2020261030142657.png)

## Quick Configure

With editing enabled, drop a channel onto an existing edge to drive its color from the channel's value. Select the edge and review the automatic value range and colors under **Configuration** in Context.

## Draw and Configure Edges

With editing enabled, drag from a node's connection handle to another node to create an edge. Drag its route handles to adjust the path.

![](_attachments/Pasted%20image%2020261030142735.png)

Select the edge to adjust its **Width** and **Color** under **Configuration** in Context.

![](_attachments/Pasted%20image%2020261030142846.png)
# Extending Schematics

An Interface plugin can add custom nodes with their own appearance, configuration, and command behavior. Start with [Interface Plugin → Schematic nodes](../Plugins/Interface%20Plugin.md#schematic-nodes), then use the [Schematic Node Reference](../Plugins/Reference/Interface/Schematic%20Nodes/Overview.md) for the available APIs.

[Shared and Bundled Assets](../Plugins/Storage%20and%20Settings.md#shared-and-bundled-assets) covers reusable files. Follow [Plugins](Plugins.md) to install and manage the extension.
