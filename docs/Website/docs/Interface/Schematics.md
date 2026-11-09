---
summary: Build and operate a saved view of equipment, signals, graphs, and controls.
created: 2026-08-03T15:41
updated: 2026-11-07T17:23
---

A **schematic** is a saved operator display that brings measurements and controls together. This is a walkthrough of the editor and shared node-and-edge workflow, not an exhaustive guide to every node or its options.

# Open or Create a Schematic

Open **Schematics** in the left sidebar and select a saved display, or right-click its resource list and choose **Create Resource** to name a new one. It opens as a canvas in its own tab.

Select the **Remote Views** icon beside the file search to switch to cards for saved Remote Views across the project, including those in subfolders. Search by view or schematic name. **Open view** opens the Remote View in a separate window or browser tab. **Go to node** opens the source schematic and centers on the Remote View region. The thumbnail is a layout preview drawn from the saved schematic. Use **Refresh Remote Views** after editing a view, and select **Remote Views** again to return to the file tree.

![The schematic canvas and editor toolbar.](_attachments/Pasted%20image%2020261030030010.png)

# Editor

Use the toolbar above the canvas to change editing, commanding, and navigation settings. Hover an icon to see its name.

![](_attachments/Pasted%20image%2020261030030939.png)

## Schematic Editing

The **pencil** enables editing so you can arrange nodes and edges. Use **Undo / Redo** or **Ctrl+Z / Ctrl+Y** to reverse or restore changes. Use **Ctrl + C** or **Ctrl + V** to copy and paste nodes.

## Canvas editing

The canvas uses X6 for schematic editing, embedded previews, and Cluster Map. Enable the pencil to edit. The grid toggle snaps movement to an 8-unit grid or to the schematic's saved spacing when it is finer. Alignment guides help match node edges and centers while dragging or resizing. Hold **Alt** to bypass snapping. Unlock **Manual pan/zoom** in the toolbar to pan with a left-drag on empty canvas or by holding **Space** over a node. In edit mode, left-drag a node to move it and use **Shift+left-drag** on empty canvas to select nodes and edges together. In view mode, right-click a node to inspect it and show its outline.

In edit mode, select a node to show its rotation controls at the top right. Click the upper button to advance to the next multiple of 90°. Shift-click it to reset to 0°, or drag the angle handle below it for finer rotation. Hold Shift while dragging to snap to 15° increments.

In edit mode, hover over a node to see its outline and any connection points. Drag from a connection point to start an edge. Tanks and boxes show strips along their borders, where you can start or end an edge anywhere along a side. Tanks also have a fixed circular handle at the midpoint of each side. Automatic routes leave and enter perpendicular to the chosen side. Valves use fixed ports. Drop the edge onto another edge to add a branch at a right angle. When there is room, automatic orthogonal branches make their rounded turn farther from the main edge. A click selects the whole edge and its shared settings. Double-click a branch to select it by itself. Delete then removes that branch and any branches attached to it.

Select an edge to reveal its bend points, segment controls, and endpoint handles. Drag a bend or segment to reshape it, **Shift+click** the edge to add a bend, and double-click a bend to remove it. Use the edge context menu's **RESET ROUTE** to restore automatic routing. Double-click the main edge or an already selected branch to edit its own label at the segment's center. You can also choose **EDIT LABEL** in the context menu. Click away or press Enter to save. Press Escape to cancel.

Right-click an edge or branch to inspect the whole edge's endpoints and channel bindings. In edit mode, choose **INSPECT EDGE** from the context menu. The edge and its branches stay outlined while the inspector is open.

**Top label** and **Bottom label** appear outside the node body. Changing a label keeps the edge attachment points in place.

Under **Node Setup → Layout**, choose **Small** (75%), **Normal** (100%), **Large** (125%), or **Custom** to enter a percentage from 10% to 400%. On a resizable node, drag the diagonal arrow at the lower-right corner to change its body dimensions. The presets scale the node from its authored dimensions. Plugin nodes with their own settings panels may show the size picker in a **General** section.

Existing schematic nodes and authored layouts remain supported. Legacy embedded draw.io (`mxgraph_diagram`) nodes have been retired and display the unsupported-node placeholder; their saved payload remains intact.

## Media colors

Open the **Colors** tab in the media editor or **SVG Colors** in a placed Media node's configuration. Search for an element ID, CSS selector, paint property, or original value. Check one or more entries to edit them together. For example, search for `stroke` and choose **Select all shown** to recolor the matching outlines in one edit.

Use **Hex Color** for a fixed Light/Dark pair. To drive a paint from telemetry, choose **Channel Value** and set its **Default color** during import. After placing the node, open **SVG Colors** and choose the channel that supplies a CSS color such as `#22c55e`. The default appears in previews and whenever the channel is unassigned, stale, or invalid. The placed node's **Linear Interpolate** option maps a numeric channel between two colors. **Reset** restores the selected entries' underlying paint.

Colors follow application theme changes in the canvas, previews, and Media editor. Choose **App Colors** in the shared picker to use an Interface color variable such as `--schematic-node-outline` or `--schematic-valve-circle`. Changing the theme does not edit the schematic or create an undo entry. The stock Vent includes contrasting light/dark stroke colors. The test workspace's **Vent Theme Check** schematic provides a saved example.

The shared color picker has a **Saved** tab. Adjust the Light and Dark colors, open **Saved**, then enter a name and choose **Save**. Search by name and select an entry to copy its color values into the current field. A picker for a single color uses the active theme's value. Administrators can save or replace entries. The palette belongs to the connected Engine instance and is available across its workspaces.

## Commanding

**Commanding** enables or disables operator actions. Control nodes keep their normal appearance with commanding off. Leave edit mode before operating the display; editing disables commanding. Check the device state after sending a command. For disabled or rejected controls, inspect [channel authority](../Engine/Channels%20and%20Control.md#policies).

In a Remote View with commanding off, controls keep their normal appearance and display live values. They cannot send commands.

## Two-Click Commands

In edit mode, enable **Two-click commands** to arm an action with the first click and confirm it with the second. The behavior depends on the node type. Use this setting to prevent accidental commands such as opening a valve with a single click.

![](_attachments/Pasted%20image%2020261030032119.png)

## Other Controls

Use **Fit view** to frame the layout and the **lock** to switch between automatic fitting and manual pan/zoom. Changes to the opening view are saved only in edit mode. In edit mode, **Snap to grid** snaps movement to the grid and the **Alignment guides** ruler toggles guide lines and snapping to nearby nodes. The Interface remembers both settings in your browser or desktop profile. In edit mode, **Background** switches between Dots and Blank. New schematics start with Blank. Dot colors follow the application theme.

**Background node interactivity** toggles editing of background nodes. Check save/synchronization status when finished.

# Nodes

A **node** is an item placed on the canvas. Available types and settings depend on DARTWIC and your installed plugins; this guide covers their shared workflow rather than every node's options.

![](_attachments/Pasted%20image%2020261030032710.png)

## Quick Add

With editing enabled, drag a channel from **Channels** onto empty canvas and choose a node from the drop menu. Channel displays/cards, labels, controls, valves, sliders, and switches are initialized from the dropped channel.

![](_attachments/Pasted%20image%2020261030032940.png)

Drop onto a supported existing node to configure it instead. Displays use the channel as their source, graphs add a series, tanks use it for fill level, and controls update their channel bindings.

Controls, valves, sliders, and switches also look for a matching `_state` channel. For example, drop `inlet_valve` to use it as the command channel. If `inlet_valve_state` exists, the node shows that channel as its state.

## Quick Inspect

To quickly inspect a nodes channels and info, you can right click a node to see its channels graphed. The channels can then be opened in Channel Searcher by clicking the search button.

![](_attachments/Pasted%20image%2020261030143052.png)

## Add and Configure Nodes

Enable editing, open **Context → Nodes**, and search or browse the palette. Hover over a preview to see the node's name. Drag a card onto the canvas to see the node at its drop position. The preview follows grid snapping when enabled. Hold **Alt** to place the node freely. Select the placed node to show its settings under **Configuration** in [Context](Node%2C%20Context%2C%20and%20Project%20Board.md#context).

![](_attachments/Pasted%20image%2020261030033213.png)

Start with **Node Setup**. Under **External labels**, set each outside label's source to **Hidden**, **Text**, or **Configurable input**. Labels can sit above, below, left, or right of the whole node. Choose **Parameter** as the style to show a title above the value and units. For example, bind the bottom label to a tank pressure channel and enter `PRESSURE` and `bar`. Turn **Card** off to show the label directly on the canvas. An unavailable value displays a dash. A retained stale value is marked as stale.

**Appearance** follows **Node Setup** when the node has display options. **State** controls what the node shows. **Command** controls what the node sends when you operate it. Task selection stays in **Node Setup**, with its display options in **Appearance**. A value editor's input menu lets you choose a fixed value or a channel. Choose **Add condition** when the value needs conditional logic.

**Channel Reference** supplies the channel or field identifier as text, such as `|pump_running|`. **Channel Value** reads the current value at that reference. Use Channel Value for feedback, such as a pump reporting `0` when stopped and `1` when running.

Drag a **General Node** from **Display** when you want to build a custom symbol or control. Set **Content → Readout** to give it a title, value, and units. **Card** places the readout inside the filled body. **Symbol** places it beside the glyph or artwork. Switching a default General Node to Symbol uses the same compact glyph size as the Parameter and Control presets. The optional right label sits beyond the readout. Use the **Type** setting on a Parameter or Control preset to switch its layout and keep its channel setup.

Turn on **Commandable** for a General Node to reveal **Command**, then choose its action and destination. A new Angle Valve shows its state in a Parameter label above the symbol. Older Angle Valves retain their saved value sources and captions. If both label slots already contain captions, the saved angle readout has its own row in **Node Setup**.

Position and resize the node, then compare its bound values with [Channels](Channels.md). Open **Node Setup → Advanced → Lock node on canvas** to keep a node in place while arranging other items.

![](_attachments/Pasted%20image%2020261030033126.png)

## State and Command

For a Control node, set **State value** to the value you want the node to show. You can use a channel, a fixed value, or conditional logic. Choose **Use command channel** if you want the node to show that channel. Under **Command**, choose what happens **When clicked** and set the command channel or callback. Under **Appearance**, turn on **Show command value** to show the command in blue when it differs from the displayed state. Set an arming channel under **Command → Advanced command options** when another channel needs to permit the command.

On a Valve, **State value** sets the position shown on the node. On an Angle Valve, it sets the angle shown. **Closed angle** and **Open angle** define the displayed range. Under **Command**, **Value to open** and **Value to close** set the values sent to the command channel. Find orientation and **Show command value** under **Appearance**.

Find **Check Valve**, **Pump**, **Regulator**, and **Three-Way Valve** in **Fluids**. Choose the flow orientation under **Appearance**. The Check Valve is a passive symbol. On a Pump, set **State → Running feedback** to the channel that reports whether the pump is running. The fan spins up and coasts down briefly as feedback changes. On a Regulator, choose the setpoint channel under **Command** to enter a numeric setpoint from the canvas. On a Three-Way Valve, set **Value to open** and **Value to close** under **Command**, then bind **State value** to position feedback that reports those same values. Open runs straight across. Close uses the 90° outlet. The highlight transitions briefly when the feedback changes.

**Relief Valve**, **Burst Disc**, and **Filter** are read-only parameters in **Fluids**. Bind a measurement under **State**. These nodes start without labels. To display the measurement, set an external label to **State** under **Node Setup → External labels**. For example, bind a Filter to differential pressure and set the label units to `bar`.

For a read-only regulator symbol, turn off **Commandable** in its **Command** tab.

### Fluid edge activity

Valves and pumps use their state feedback to highlight fluid edges. Active sections thicken and glow in their configured color. A branch to an inactive source or a dead end at a closed valve stays dim up to its junction. Tank handles default to **Source**. A tank can pass along existing edge activity or feed an open valve or running pump through passive equipment. To change a handle's role, open **Node Setup → Handle roles**.

Ties default to **Carry**, which passes activity between connected sink edges. In the Tie's settings, set **Fluid flow** to **Inhibit** to stop activity from passing through that junction.

### Command Form

Place a **Command Form** from the **Command** category, or choose **Open command form** as a Button's action. The standalone node starts at a custom size of 55%. In **Command**, add a row for each destination channel and choose **Number** or **Boolean**. An empty label uses the channel name. Each row needs a different destination channel.

The popup shows each label beside the current channel value. The border shows that channel's authority, and a take or release button appears where applicable. The node's authority strip summarizes the configured channels, giving automatic override priority over manual override. Select **False** on the left to write 0 or **True** on the right to write 1. Take manual control first when the value is locked. To edit a number, click its value, type the new number, then press Enter or click the inline send icon. Each action writes only that row's channel and follows its authority rules. If a response is lost, check that channel's readback before retrying.

Sliders and Switches use **Command channel** under **Command** and **State value** under **State**. With an empty state channel, the node shows the command channel. For a TEMPEST action, choose the operation under **Command**, then choose a state channel or operation response under **State**. A command menu uses its shared or per-option state to show which option is active.

In the example below, the valve command channel `valves_valve_1` is set to `1` (open). The blue indicator shows that command. Manual override holds the `_state` channel closed, so the main valve symbol still shows a closed state.

The valve is also yellow because it is tied to an ARGUS warning that was reported by the loop trying to write the `_state` channel could not.

![](_attachments/Pasted%20image%2020261030033529.png)

If I release manual override on the `_state` channel, the valve then turns.

![](_attachments/Pasted%20image%2020261030034050.png)


## Channel States

Nodes that support commands show their command channel's authority around the face. Circular controls use the same colored backing as valves. Controls with straight edges show a short strip along each edge. **Free** allows permitted writes, **Automatic** means automation owns control, and **Observe only** reserves writes for its publisher. **Automatic override** gives another automation action priority, and **Manual override** gives the operator control.

![](_attachments/Pasted%20image%2020261030141306.png)

Supported controls use orange authority accents for manual override and red for automatic override. **Stale** and **Not Found** also change a node's appearance when its data is old or unavailable. See [Channel States](Channels.md#channel-states) and [Control Policies](../Engine/Channels%20and%20Control.md#policies) for details.

![](_attachments/Pasted%20image%2020261030141423.png)

## ARGUS Events

A node shows an ARGUS event when a channel it uses also appears in the event's **Channels**. For example, a display using `tank_pressure` can show a high-pressure event that includes `tank_pressure`. Bound channels are matched automatically. Add other channels under **Node Setup → Advanced → Extra event channels** in Configuration.

Ordinary events appear only while **New** and firing; acknowledging them or ending their firing removes the node alert. **Holds** and **prompts** remain visible while awaiting release or a response, even after acknowledgement or firing ends. **Resolved**, **Silenced**, **Deleted**, and **Stale** events do not appear. Ordinary events also disappear when their firing state becomes unknown.

The node flashes red for errors or aborts, yellow for warnings or holds, and blue for prompts. If several events match, the highest-priority color is used. Hover the node to see its matching alerts, then click one to open it in the board. See [Events and Logs](Events%20and%20Logs.md#events) for event states and actions.



## Node Gallery

The Node Gallery shows all the current nodes in there different states for reference. Open **Context → Nodes** and click **Node Visual Gallery** in the node browser toolbar. 

![](_attachments/Pasted%20image%2020261030140752.png)

It shows side-by-side examples of node appearances, control policies, events, and stale or missing data. Use the command button to enable simulated controls, then try the two-click toggle and example commands. The Disabled example stays disabled.

Control Nodes are nodes that control a specific thing, like a Channel or Task.

Use **Command → Center label** to add text inside a Button node. Use **Node Setup → Shape** to change its outline.

![](_attachments/Pasted%20image%2020261030141929.png)

![](_attachments/Pasted%20image%2020261030141946.png)

In a **Task Control** node, choose a **CAESAR Artifact** under **Node Setup** by name or by its DCode symbol. Under **Appearance**, toggle **Task icon** to control whether the icon appears on the card. Enable **Hide task controls** to replace the start, hold, and stop buttons with a status dot. Gray means off, green means running, and yellow means held.

Parameter Nodes are nodes that display something that is read-only, like a value or parameter.

![](_attachments/Pasted%20image%2020261030142024.png)
## Media Imports

Add an image or SVG when you need a symbol beyond the built-in shapes. Save a reusable preset if you want to place the same artwork and settings on multiple schematics.

For a single placement, add a **General Node** or **Media** preset to the schematic. Open **Media → Add media**, choose your artwork, adjust its crop and size, and click **Apply**. Double-click the node or choose **Edit media** to adjust it later.

![](_attachments/Pasted%20image%2020261030142544.png)

To create a preset, choose **Import Node** in the Nodes palette. Give it a name and category beside the preview. Configure the shape, labels, and optional commands in the same settings you use on the canvas. Use **Media → Add media** if the preset needs artwork, then choose **Save preset**. The node’s right-click menu shows the preset name and node type. To reuse a placed node, right-click it in edit mode and choose **Save to Node Browser**. Each placement starts with a copy of the preset settings, so later edits apply to that placement.

The node browser previews the saved proportions, button shape, crop, artwork scale, and colors. Large nodes shrink proportionally to fit the preview, and channel-driven SVG paints use their saved default colors.

Open **Preview** when importing or editing media to see the artwork inside its node. Adjust **Artwork scale** to enlarge or shrink it without changing the node size. Use **Contain** to keep its proportions, **Cover** to fill the face, or **Stretch** to fit its bounds. **Reset scale** returns the artwork to 100%. Custom handles follow the artwork as it scales. For SVGs, **SVG stroke width** adjusts line thickness independently. **Reset stroke** restores the original widths.

Open **Handles** when importing or editing media to place connection points on the artwork. Click to add a handle or drag it to move it. Each row lets you set X, Y, edge direction, and the role. Adding a custom handle replaces the four default handles. Choose **Use defaults** to restore them.

To use artwork as a control, turn on **Commandable** in **Node Setup** and choose an action in **Command**. The preset preview shows the face and artwork. Commands become available on placed nodes according to the schematic's commanding settings and Engine authority.

Administrators can right-click a project preset in the Nodes palette and choose **Delete** to remove it from the browser. Nodes already placed on schematics keep their shared media and settings.


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

With editing enabled, open **Schematic accent** to the left of the pencil. Choose **Schematic default** or a color from **Saved** or **App colors**. The accent colors new edges and the fill and outline of new built-in tanks. Branches use the color of the edge they join.

Select edges or tanks to see their accent colors in the toolbar. Choose a color to apply it to the whole selection. Undo restores the previous colors in one step. For individual tank settings, open the **Tank** tab.

Choose the pencil beside **Search colors** to open the Saved Colors dialog. Search for an existing color to edit or delete it, or use **New color** to start a new entry. Set the **Dark** and **Light** swatches, then name and save the color in the footer. The regular color picker's **Saved** tab opens the same dialog. Existing edges keep the colors stored when they were drawn.

Drag an edge's route handles to adjust its path.

![](_attachments/Pasted%20image%2020261030142735.png)

Select the edge to adjust its **Width** and **Color** under **Configuration** in Context.

![](_attachments/Pasted%20image%2020261030142846.png)
# Extending Schematics

An Interface plugin can add custom nodes with their own appearance, configuration, and command behavior. Start with [Interface Plugin → Schematic nodes](../Plugins/Interface%20Plugin.md#schematic-nodes), then use the [Schematic Node Reference](../Plugins/Reference/Interface/Schematic%20Nodes/Overview.md) for the available APIs.

[Shared and Bundled Assets](../Plugins/Storage%20and%20Settings.md#shared-and-bundled-assets) covers reusable files. Follow [Plugins](Plugins.md) to install and manage the extension.
