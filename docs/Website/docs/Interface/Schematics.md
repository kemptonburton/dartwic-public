---
summary: Build and operate a saved view of equipment, signals, graphs, and controls.
created: 2026-08-03T15:41
updated: 2026-11-13T00:37
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

Select multiple nodes or edges to edit matching entries together. **Node Config** appears when nodes are selected, and **Edge Config** appears when edges are selected. Both tabs share the editing area for mixed selections and have distinct icons. With nothing selected, the configuration tabs are hidden. The panel combines every entry available on the selected items, including entries supported by just one item. Selecting one Table with other nodes still shows its **Table** tab, and selecting one Tank still shows its **Tank** tab. For example, selecting a Table with several cards still shows the cards' **Commandable**, **Readout** and appearance settings. Differing values among the applicable items show **Mixed**. Editing an entry changes only the selected items that support it. Hover its label to see how many items it applies to. Unrelated settings, channel bindings, labels, artwork and geometry remain intact. Editing a list or rule block replaces that setting for its applicable items. Use normal Undo/Redo to reverse a batch edit.

Fields with different values are marked **MIXED**. Editing a field applies that setting to the current group while keeping each item's other bindings, labels, artwork, and geometry. Lists and rule blocks apply as a whole setting when edited. Each batch update uses the normal Undo/Redo history.

The canvas uses X6 for schematic editing, embedded previews, and Cluster Map. Enable the pencil to edit. The grid toggle snaps movement to an 8-unit grid or to the schematic's saved spacing when it is finer. Alignment guides help match node edges and centers while dragging or resizing. Hold **Alt** to bypass snapping. Unlock **Manual pan/zoom** in the toolbar to pan with a left-drag on empty canvas or by holding **Space** over a node. In edit mode, left-drag a node to move it and use **Shift+left-drag** on empty canvas to select nodes and edges together. In view mode, right-click a node to inspect it and show its outline.

In edit mode, select a node to show its rotation controls at the top right. Click the upper button to advance to the next multiple of 90°. Shift-click it to reset to 0°, or drag the angle handle below it for finer rotation. Hold Shift while dragging to snap to 15° increments.

The body and internal text rotate together. External labels and attached readout captions stay upright on their configured sides, outside the rotated node's bounds. Top, Bottom, Left, and Right label settings stay the same. Valve nodes use these same shared rotation controls. Existing valve drawings keep their saved orientation.

In edit mode, hover over a node to see its outline and any connection points. Drag from a connection point to start an edge. Tanks and boxes show strips along their borders, where you can start or end an edge anywhere along a side. Tanks also have a fixed circular handle at the midpoint of each side. Automatic orthogonal routes leave and enter along the chosen handle's outward direction, perpendicular to its side. This applies to ordinary node points, perimeter handles, fixed equipment ports, and custom handles with a configured direction. Rotating a node rotates that direction too; fine rotations use a short angled lead before the orthogonal route. Valves use fixed ports. Drop the edge onto another edge to add a branch at a right angle. When there is room, automatic orthogonal branches make their rounded turn farther from the main edge. A click selects the whole edge and its shared settings. Double-click a branch to select it by itself. Delete then removes that branch and any branches attached to it.

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

**Commanding** enables or disables operator actions. With commanding off, Control nodes keep their normal appearance and remain selectable in edit mode. Leave edit mode before operating the display. Check the device state after sending a command. For disabled or rejected controls, inspect [channel authority](../Engine/Channels%20and%20Control.md#policies).

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

With editing enabled, drag a channel from **Channels** onto the canvas to open **Insert Node**. Browse the compact **Readouts**, **Controls**, **Fluids**, **Layout**, and **Media & Views** tabs or search by name. Readout and Control presets offer Glyph, Card, Gauge, Horizontal Bar, and Vertical Bar. Configure other combinations on a placed node. Insert Node uses the node browser's category tabs, node previews, hover styling, and tooltips. Names appear in tooltips instead of captions under the previews. Search still matches preset names. Only presets that accept a channel drop appear here.

![](_attachments/Pasted%20image%2020261030032940.png)

Drop onto any existing node offered by **Insert Node**, including one in a Table, to configure it in place. Readout and non-commandable General Nodes bind the dropped channel or field and keep their appearance settings. Graphs add a series, tanks bind fill level, and command forms add a channel row. These nodes also appear in **Insert Node**. When a drop binds a readout, it sets the title to the channel name and copies the units. This applies both when inserting a new node and when dropping onto an existing one.

Controls use the dropped channel for commands and look for a matching `_state` channel. For example, drop `inlet_valve` to use it as the command channel. If `inlet_valve_state` exists, the node uses it as state. Otherwise it reads state from `inlet_valve`. If the feedback channel provides units, the readout uses those units.

## Quick Inspect

To quickly inspect a nodes channels and info, you can right click a node to see its channels graphed. The channels can then be opened in Channel Searcher by clicking the search button.

![](_attachments/Pasted%20image%2020261030143052.png)

## Add and Configure Nodes

Enable editing, open **Context → Nodes**, and search or browse the palette. Hover over a preview to see the node's name. Drag a card onto the canvas to see the node at its drop position. The preview follows grid snapping when enabled. Hold **Alt** to place the node freely. Select the placed node to show its settings under **Configuration** in [Context](Node%2C%20Context%2C%20and%20Project%20Board.md#context).

![](_attachments/Pasted%20image%2020261030033213.png)

Open **Node Setup**, find the **External labels** table, and click the **Add label** plus in its header. Choose **Text** or **Readout**, then select **Top**, **Bottom**, **Left**, or **Right**. Enter text directly in the row. For a readout, click **Configure** to open its **Top Readout**, **Bottom Readout**, **Left Readout**, or **Right Readout** tab with the normal source, title, units, Value/Gauge/Bar, size, sparkline, ticks, and formatting controls. For example, add a bottom readout, bind it to tank pressure, and enter `PRESSURE` and `bar`. Turn **Card** off to display it directly on the canvas. All schematic Value readouts share **Horizontal alignment** and **Vertical alignment** controls, including Card, Panel, Bare, Glyph, attached readouts, and external labels with Card on or off. **Glyph position** selects the symbol side separately. Meter readouts keep their type-specific layout controls.

Change the position dropdown to move a label. An occupied destination swaps the labels and their settings. Use the trash button to remove one. Valve **State** settings continue to control symbol and flow feedback independently of label placement.

General-based nodes start with **Node Setup** and **Node Appearance**. Use **Node Setup** for layout, external labels, and task selection. Use **Node Appearance** for supported borders, fills, orientation, and ARGUS alert styling. **Readout** configures the displayed value or feedback. **Command** configures what a commandable node sends.

Choose **If / else** to open the rules table. Each row compares its own **If** input with its **Equals** value. Use the plus in the table header to add more rules. The first match returns its **Then** value. **Else** supplies the fallback. Switch to **Configurable input** to clear the rules and keep the fallback as the direct value.

**Channel Reference** supplies the channel or field identifier as text, such as `|pump_running|`. **Channel Value** reads the current value at that reference. Use Channel Value for feedback, such as a pump reporting `0` when stopped and `1` when running.

The node browser groups presets under **Readouts**, **Controls**, **Fluids**, **Layout**, and **Media & Views**. **General Node** appears at the top of **All** and under **Layout**.

Readout and Control Cards, Gauges, and Bars start with a rectangular shape, including nodes inserted from channel drops. **Readout Glyph** and **Control Glyph** start circular. Control presets appear under **Controls** in both pickers. Choose another shape under **Node Setup → Shape**.

Readout and Control glyphs have a shape-matching outline in the shared node border color and share the same face background outside Tables. Command authority indicators remain above that outline. Docked glyphs use the inset accent to remain distinct from the cell, including with **Cell background → Off** or a table background override. This affects the glyph face, independently of the optional cell-wide fill.

Schematic surfaces share five theme-aware colors. Choose them from **App colors** in a color picker; saved colors and custom node colors remain available.

| Color | Use |
| --- | --- |
| `--schematic-edge` | Default edge color. |
| `--schematic-node-border` | Default node and table outlines. |
| `--schematic-node-background-1` | Main Card, Tank, valve, Portal, and control backgrounds. |
| `--schematic-node-accent-1` | Inset details, including unfilled meter tracks, slider tracks, selected switch tabs, and default table headers. |
| `--schematic-node-background-2` | Table/container background behind nested nodes. |

In dark mode, the inset accent is lighter than the main background and darker than the edge. Light mode uses a corresponding contrast hierarchy. Older outline, valve-circle, and label-circle color names remain compatible aliases.

In **Node Setup → Body style**, choose **Glyph** or **Card** on a General, Readout, or Control node. Glyph places the readout beside the glyph or artwork. Set **Horizontal alignment** beside the **Glyph** field under **Readout** to place it on the left or right. Card provides a filled body. For Glyph and Card, **Node Setup → Shape** selects the outline. Card lets you independently choose **Show border** and **Show background** under **Node Appearance**. Panels with both off stay transparent until a warning or alert. Transparent controls place the authority dot immediately after the node label on the same row. When only a value is shown, the dot follows that value. Table-docked controls retain their perimeter strips. Saved Panel and Bare appearances retain their settings. Use **Node Setup** to scale the node and its readout text. Changing body style keeps the existing bindings.

Use a **Button** node to place a custom clickable area over part of a schematic or an imported drawing. In edit mode, select it and drag its lower-right resize handle, or set its width and height under **Node Setup → Layout**. Buttons use a rectangular Card with no glyph, readout, or State tab. Turn off **Show border** and **Show background** under **Node Appearance** for a transparent overlay. **Command → Show command auth bars** hides or shows the perimeter bars; transparent Buttons keep the bars rather than using an authority dot. Configure the action under **Command**; normal commanding and authority checks still apply.

On a Channel Graph, use **Node Appearance → Card** to set **Border rounding**, border and background colors, **Show border**, and **Show background**. These controls are separate from the graph's time, history, and series settings. **Conditional appearance** uses channel comparisons to change the card's border or background, or flash it; **ARGUS alerts** provides the same linked-event highlighting as other card nodes. Add channels outside the plotted series under **Node Appearance → ARGUS alerts → Extra event channels** when their alerts should highlight the graph.

Under **Readout**, choose **Value**, **Gauge**, **Horizontal Bar**, or **Vertical Bar** and configure the title, units, and optional sparkline. Choose **Readout size → Fit** to scale the readout within a fixed Card or table pane. For bars, Fit scales the text within its available space and keeps the track length. For a bar, use **Readout position** to place the title and value above, below, or beside the bar. Use **Horizontal alignment** to align them left, center, or right. When the readout is beside the bar, **Vertical alignment** positions it at the top, center, or bottom. Drag the right handle to resize a horizontal bar or the bottom handle to resize a vertical bar, including bars inside Tables. A table fits around the requested length. The cross axis fits automatically. Vertical bars start taller and narrower, with the track centered independently of its side ticks. Bars reserve tick-label space below or beside the track, keeping the value close to the bar. Tick labels use larger text and automatically omit crowded labels while retaining all tick marks. Value and Gauge readouts have fixed canvas dimensions. **Use percentage** on a bar or gauge displays the input as a percentage of its configured range. For example, 60 in a range of 20 to 100 displays 50%. With **Use percentage** off, the readout shows the input value even outside the range. The graphic stops at the range bounds. Gauge and bar presets are available in **Readouts**, **Controls**, and the channel drop picker. Ticks start enabled for Gauge and Bar readouts; turn off **Show ticks** to hide them. On a Tank or another specialized node, enable an attached readout to add a value beside the node's own drawing.

On a General or Media node, including a node imported with artwork, choose **Readout type → Hidden** to display the node without its readout. Selecting a visible readout type restores the saved binding.

Under **Node Appearance → Panel**, choose a border color or add a background fill. Open **Conditional appearance** below **ARGUS alerts** and select **If / else**. Use the same rule table as in **Readout**. Choose a channel under **If**, set the operator and value under **Compare**, and select **Edit effects** under **Then** to change the border, change the enabled fill, or flash the background. The first matching rule applies. The **Else** row uses the Panel's default appearance. **Off** pauses the rules and keeps their settings. Flashing works on transparent Panels too.

Stale and not-found channel status color the readout text and node outline without tinting the background. Tank fill also follows its status color. Only stale fill uses diagonal hatching, making stale data recognizable even when the tank is full; fresh fill stays solid during ARGUS events. Labels retain their units without an extra stale suffix. Active ARGUS events use a much darker shade of the event color behind bright outlines and text across Cards, valves, Tanks, and other node bodies. Configured conditional appearance can also highlight the background.

Under **Node Appearance → ARGUS alerts**, choose **Flash**, **Steady**, or **Off**. Graphs and Ties default to **Off**. When enabled, linked alerts can highlight a transparent Panel's background and border. Hover the node for event details; there is no separate corner alert icon. Linked alerts can tint transparent Panels and take priority over a channel-driven Panel flash. Reduced motion shows steady highlights. Turn on **Snap to grid** to arrange Panels into rows or columns.

The shared **Readout** tab groups display settings under **Setup** and the value source under **Readout value**. Select **Configurable input** or **If / else** in the source button group. Channel-based Controls also offer **Command channel**, which follows the configured command destination. Switching back to a custom input or conditions keeps that explicit choice, including an empty input.

Gauges use a broad arc with the value and units centered inside. The value has clearance inside the arc and fits the available width when the number is long. For Gauges and both Bar directions, enable **Readout → Show ticks** to add major and minor divisions. Set **Tick divisions** and optionally hide **Tick labels**. Labels use the configured **Start value** and **End value** in channel units, even when the readout displays a percentage. The end may be below the start: a scale from 0 to -100 fills as the input decreases. Readout titles stay on one line. Rectangular readouts and table cells grow to fit the title. Shaped cards fit their text and meters inside the outline: circular cards stay round, including Bar cards, while triangles and polygons reserve an inner content region. Glyphs use the same outlines with symbols fitted inside their faces. Hiding Gauge ticks or their labels reclaims that space while retaining room for any tick-range band.

Set **Warning starts at** and **Danger starts at** beside the other meter settings to color the tick ranges. Leave either blank to disable that threshold. Values before the first threshold use green on the scale; the normal fill stays white in dark mode. Warning turns the fill yellow and Danger turns it red, with Danger taking priority. Thresholds follow the scale direction: for 0 to -100, warning at -60 and danger at -80 activate as the value falls. These settings change appearance only; existing channel and alert highlighting still takes priority.

Under **Table → Node spacing**, choose **Flush** to fit eligible rectangular nodes against their pane edges and share borders. Choose **Padded** to separate nodes from the table edges; set **Cell padding** and **Node gap** from 0 to 64 schematic units. Padded nodes retain their borders, corner rounding, and authority strips. The table background shows through the spaces. Shaped or fixed-size nodes keep their geometry, and each cell's existing alignment options still apply.

Each cell settings button also offers **Node spacing → Table / Flush / Padded**. **Table** inherits the table settings; **Padded** lets that cell set its own padding and gap. Overrides follow the cell when rows or columns are inserted. Selecting **Table** restores inheritance.

Docked nodes stay above their table's background, including nodes previously sent to the back. Their saved content and layering outside the table are preserved.

For a grouped layout, drag a **Table** from **Layout**. New tables start with one cell and use the container background and schematic node border colors. Drag over an occupied pane to preview placing a node above, below, left, or right of the existing node. Drop at the outside edges to add a row or column. The grid draws separators between rows and columns and leaves panes within one cell open. Rectangular Panels and readout Cards fill their assigned panes. Shaped nodes keep their outlines. Rectangular controls show command authority strips on all four sides of their pane. In edit mode, open the cell settings button and choose **Fill**, **Even**, or **Top**. **Even** is the default and shares the available space where node sizes allow. **Top** packs nodes at the top of the cell. **Cell background** defaults to **Auto**, which uses the first filled node's background across the cell. Choose **Off** to leave the space around the nodes transparent.

Tables start without titles. Open the **Table** tab to choose the grid color, enter an optional full-width title, or add titles over one or more columns. Headers align left by default, inherit the table border, and use the inset accent background. With a custom table border, the automatic header fill follows that color. Header text is white in dark mode. Set their alignment, border, and background in **Headers**. **Header size** offers the node size presets and a custom percentage. Turn on **Override table background** to apply one idle background to the cells and docked node bodies. Header fills and alert-driven appearance still apply. Drag a title or the grip above an untitled table to move the group. Drag a node out to detach it. Deleting the Table leaves its contents on the canvas.

Open **Command** and turn on **Commandable** for a General Node, then choose its action and destination. Valve command authority is shown by visible arcs around the circular face. A new Angle Valve shows its angle above the symbol. Configure that display under **Top Readout**. Its default **Node state** source follows the valve feedback; choose **Configurable input** or **If / else** in the same tab to use an independent source. External readouts do not enlarge the valve body. Older Angle Valves retain their saved value sources and captions. If both label slots already contain captions, the older angle display has a **Saved Readout** tab. Older separate attached readouts have an **Attached Readout** tab.

Position and resize the node, then compare its bound values with [Channels](Channels.md). Open **Node Setup → Advanced → Background node** to keep a node in place while arranging other items.

![](_attachments/Pasted%20image%2020261030033126.png)

Use **Node Setup → Advanced → Background node** to mark a node as part of the background. The switch sits on its own row below **CSS class**. The node cannot be selected or dragged until **Toggle background node interactivity** is enabled in the schematic toolbar. This setting was previously labeled Lock node on canvas.

## General Node Presets

Readout and Control variants, Button, Label, Box, Media, and the static fluid symbols are configurable General Node presets. Buttons use a fixed rectangular Card and command-only center; the other supported presets can change body or readout style while keeping their bindings. Graphs, Tanks, animated valves, Pumps, Tasks, Tables, Sliders, Switches, Command Forms, 3D Models, Remote Views, and Ties retain their own content and dedicated configuration tabs. Existing schematics and imported presets are converted when opened and saved normally.

The fluid browser names are **Single-Way Valve**, **Three-Way Valve**, and **Angle Valve**. Their command and feedback configuration remains independent of the preset name.

## Portals

Add **Portal** from **Layout** and enter its **Name** in **Portal Setup**. The filled ribbon fits its name, has a rounded left end and pointed right end, supports node size and rotation, and has connections at both ends. Rotate it 180° to point the arrow left; its name stays upright. Both handles default to **Sink**; configure the **Rounded end** and **Arrow end** under **Node Setup → Handle Roles**.

Set the Portal's **Border color** and **Background color** independently under **Node Appearance**, using app colors or the saved palette. New Portals inherit the schematic drawing accent. Select placed Portals with edges or Tanks to apply the same accent from the toolbar: it colors the Portal outline and lightly tints its background. **Schematic default** restores the schematic edge outline and card background.

Set **Link name** to identify the linked group. An optional **Display label** changes only the text shown on this Portal and in previews/search results; leave it blank to show the link name. The ribbon fits the displayed text. Editing a display label affects only that instance, and group renames preserve its label. Both the display label and link name are searchable.

New Portals use **Linked** mode. Matching link names link across the active project's schematics, including nested folders, ignoring case and surrounding spaces. Unnamed instances show **PORTAL**. Choose **Label** mode for a plain annotation excluded from destinations and group renames. Portal links provide navigation; they do not carry activity between schematics.

Outside edit mode, click a linked Portal to open a matching instance in the same schematic or another schematic in the project. One destination opens directly. For several destinations, use the compact searchable Portal-only list, with schematic paths and connected-edge color dots labeled with saved color names (such as LOX), app colors (such as Schematic edge), or custom hex values. Portal previews in this list, schematic search, and application search show short connected edge segments using their configured colors. Connections leave each end along its outward direction, including after rotation. The destination is centered and briefly highlighted. In edit mode, select the Portal normally and use **GO TO LINKED PORTAL** from its context menu.

Click away from **Link name** or **Display label** to apply the edit; Enter is optional. Renaming an existing linked Portal offers **THIS PORTAL**, **ALL MATCHING PORTALS**, or **CANCEL**. The dialog shows the affected instances and schematics and whether the new name joins an existing group. Group rename changes only names. Files changed concurrently or unable to save are listed separately; **RETRY REMAINING** refreshes and retries only unresolved instances. Check any incomplete lookup warning before assuming every schematic was included.

## Find Nodes in the Project

With a schematic focused, press **Ctrl+P** or select its toolbar **Search** button. The compact search centers inside that schematic's tab and shows full node previews with names, types, and schematic locations. It finds nodes across the active project's schematic files, including subfolders. Search names, visible labels, configured channels, Portal names, node types, or schematic names and paths. Current open edits appear immediately. The result rows use the same layout and node previews as application-wide search.

Use the arrow keys and Enter to choose a result. Its schematic opens or activates, centers the node, and briefly highlights it. Escape or clicking outside closes the panel. Unreadable schematic files produce an incomplete-search warning while valid results remain available. **Ctrl+Space** continues to open application-wide search.

## State and Command

To use a Control node as a read-only display, turn off **Command → Commandable**. Turn it back on to restore the saved command. Set **Readout → State value** to the value you want the node to show. You can use a channel, a fixed value, or conditional logic. Choose **Use command channel** if you want the node to show that channel. Under **Command**, choose what happens **When clicked** and set the command channel or callback. Under **Readout**, turn on **Show command value** to show the command in blue when it differs from the displayed state. Set an arming channel under **Command → Advanced command options** when another channel needs to permit the command.

On a Valve, **State value** sets the position shown on the node. On an Angle Valve, it sets the angle shown. **Closed angle** and **Open angle** define the displayed range. Under **Command**, **Value to open** and **Value to close** set the values sent to the command channel. Use the shared rotation controls for orientation. Configure **Show command value** under **State**.

Find **Check Valve**, **Pump**, **Regulator**, and **Three-Way Valve** in **Fluids**. Use the shared node rotation controls for orientation; fluid nodes no longer have a separate Flow Setup tab. The Check Valve is a passive symbol. On a Pump, set **State → Running feedback** to the channel that reports whether the pump is running. The fan spins up and coasts down briefly as feedback changes. With separate command and feedback channels, a blue offset rotor appears behind the actual fan when the two disagree. The actual fan continues to follow fresh running feedback. The command rotor disappears when feedback catches up or either value becomes unavailable or stale; **Show command value** can hide it. On a Regulator, choose the setpoint channel under **Command** to enter a numeric setpoint from the canvas. Choose **Regulator (Non-commandable)** in Fluids for the same symbol, connections, labels, and optional readouts with **Commandable** off by default. New Three-Way Valves start open with a white straight-through path; their initial State value is a constant `1`. To use live feedback, set **Value to open** and **Value to close** under **Command**, then bind **State value** to position feedback that reports those same values. Open runs straight across. Close uses the 90° outlet. The highlight transitions briefly when the feedback changes.

**Relief Valve**, **Burst Disc**, and **Filter** are read-only presets in **Fluids**. Bind a measurement under **State**. These nodes start without labels. To display the measurement, set an external label to **Node state** under **Node Setup → External labels**. For example, bind a Filter to differential pressure and set the label units to `bar`.

For a read-only regulator symbol, turn off **Commandable** in its **Command** tab.

**Quick Disconnect (Check Valves)**, **Quick Disconnect (One-Way)**, and **Quick Disconnect (Slip Fit)** are passive two-port symbols in Fluids. All three share the normal Check Valve triangles, connecting bar, and center disconnect mark. Check Valves has a check ball on both sides; One-Way has one on the left side; Slip Fit has none. Use the shared node appearance, rotation, labels, and optional readouts to configure any variant.

**Heat Exchanger** in Fluids has two independent paths: **Entry 1** on the left connects to **Output 1** on the right, and **Entry 2** on the bottom connects to **Output 2** on the top. Entries default to Sink and outputs to Source. Activity passes through each pair independently; activating one path does not light the other. The path list is always available in **Node Setup / Handle roles** to edit path names and assign each handle to a path; ordinary passive nodes show one default path. Add a path with the table-header plus, or remove extra paths with their trash buttons. Unlisted handles are isolated. For nodes with multiple paths, hover or select the node in edit mode to see numbered, colored dashed paths that match the list; they disappear in view mode. Older Heat Exchangers automatically use the two separate circuits while retaining their connections and custom role overrides. Use the shared appearance, rotation, external labels, and optional readout controls to configure it.

**Orifice** is a passive symbol beside **Filter** in Fluids, drawn as two opposing curves. It uses the same connections, shared appearance, external labels, and optional readouts as Filter. **Vent** uses a dotted open arrow. Rotate either symbol with the shared node controls. Existing stock Vent drawings adopt the new artwork while keeping their connections and colors; custom drawings stay unchanged.

### Fluid edge activity

Valves and pumps use their state feedback to highlight fluid edges. Active sections thicken and glow in their configured color. A branch to an inactive source or a dead end at a closed valve stays dim up to its junction. Tank handles default to **Source**. A tank can pass along existing edge activity or feed an open valve or running pump through passive equipment. To change a handle's role, open **Node Setup → Handle roles**. **Source** handles are orange when visible in edit mode; **Sink** handles keep the normal outline. Source marks a supply or output, Sink accepts and relays activity through passive parts, and Unassigned excludes that handle from activity propagation. Activity follows the handle roles regardless of which direction you drew the edge. A Source role alone does not activate a path: highlights follow open-valve/running-pump feedback and connected supply/receiving paths. Active edges retain their configured Flow color and become thicker and brighter; orange identifies the handle role.

Ties default to **Carry**, which passes activity between connected sink edges. In the Tie's settings, set **Fluid flow** to **Inhibit** to stop activity from passing through that junction. Select **Hidden Tie** in Layout for the same junction with **Tie Setup / Hidden** already enabled. You can toggle Hidden on any Tie. Hidden ties have a larger, high-contrast hollow dotted marker in edit mode and previews, and disappear in view mode. Ties have a larger grab area; select one to use its drag grip instead of rotation handles. Their connected edges and Carry/Inhibit behavior remain active.

### Command Form

Place a **Command Form** from the **Controls** category, or choose **Open command form** as a Button's action. The standalone node starts at a custom size of 55%. In **Command**, add a row for each destination channel and choose **Number** or **Boolean**. An empty label uses the channel name. Each row needs a different destination channel.

The popup shows each label beside the current channel value. The border shows that channel's authority, and a take or release button appears where applicable. The node's authority strip summarizes the configured channels, giving automatic override priority over manual override. Select **False** on the left to write 0 or **True** on the right to write 1. Take manual control first when the value is locked. To edit a number, click its value, type the new number, then press Enter or click the inline send icon. Each action writes only that row's channel and follows its authority rules. If a response is lost, check that channel's readback before retrying.

Sliders and Switches use **Command channel** under **Command** and **State value** under **State**. The Slider value uses only the width it needs, leaving the remaining width for the track. With an empty state channel, the node shows the command channel. For a TEMPEST action, choose the operation under **Command**, then choose a state channel or operation response under **State**. A command menu uses its shared or per-option state to show which option is active.

Switches use compact tabs with rounded outer edges. New switches place **OFF** (0) on the left and **ON** (1) on the right. In **Command → States**, edit each label and value, or use the header's plus button and each row's remove button to change the tabs. The active tab follows the actual state; a differing commanded state retains its blue indication. Selecting a tab sends its configured value through the existing authority and confirmation flow. TEMPEST switches support the same states when the operation accepts a value argument; Boolean arguments accept only 0/1 or false/true.

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

A node shows an ARGUS event when a channel it uses also appears in the event's **Channels**. For example, a display using `tank_pressure` can show a high-pressure event that includes `tank_pressure`. Bound channels are matched automatically. Add other channels under **Node Appearance → ARGUS alerts → Extra event channels** in Configuration.

Ordinary events appear only while **New** and firing; acknowledging them or ending their firing removes the node alert. **Holds** and **prompts** remain visible while awaiting release or a response, even after acknowledgement or firing ends. **Resolved**, **Silenced**, **Deleted**, and **Stale** events do not appear. Ordinary events also disappear when their firing state becomes unknown.

The node flashes red for errors or aborts, yellow for warnings or holds, and blue for prompts. If several events match, the highest-priority color is used. Hover the node to see its matching alerts, then click one to open it in the board. See [Events and Logs](Events%20and%20Logs.md#events) for event states and actions.



## Node Gallery

The Node Gallery lets you compare the current node presets in different states before using them in a schematic. Open **Context → Nodes** and click **Node Visual Gallery** in the node browser toolbar. It uses the same catalog as the node browser, including your saved presets, categories, and the Glyph, Card, Gauge, and Bar variants. Search by preset name or category, or click **Refresh nodes** to reload the catalog.

![](_attachments/Pasted%20image%2020261030140752.png)

It shows side-by-side examples of node appearances, control policies, events, and stale or missing data. Nodes use the same sizing as a placed schematic node. Readouts include sample labels and units; specialized nodes demonstrate external captions and numeric readouts where supported. These settings belong to the gallery copies and leave your presets intact. Paired controls include a **Commanded vs state** example with different command and feedback values, showing the node's blue command indication alongside its actual state. Use the command button to enable simulated controls, then try the two-click toggle and example commands. The Disabled example stays disabled. These examples use simulated channel values and commands; they do not command your equipment. Task Control offers a task selector for periodic tasks, loops, sequences, state machines, and timeline layouts.

Control Nodes are nodes that control a specific thing, like a Channel or Task.

Use **Command → Center label** to add text inside a Button node. Use **Node Setup → Shape** to change its outline.

![](_attachments/Pasted%20image%2020261030141929.png)

![](_attachments/Pasted%20image%2020261030141946.png)

In a **Task Control** node, choose a **CAESAR Artifact** under **Node Setup** by name or by its DCode symbol. Under **Node Appearance**, toggle **Task icon** to control whether the icon appears on the card. Enable **Hide task controls** to replace the start, hold, and stop buttons with a status dot. Gray means off, green means running, and yellow means held.

Readout Nodes are nodes that display something that is read-only, like a value or parameter.

![](_attachments/Pasted%20image%2020261030142024.png)
## Media Imports

Add an image or SVG when you need a symbol beyond the built-in shapes.

Use **Media** for standalone artwork. Use **General Node** when the artwork is part of a custom node with a readout, labels, or commands. On either node, open **Media → Add media**, choose your artwork, adjust its crop and size, and click **Apply**. Double-click the node in edit mode to adjust it later. Existing Media nodes with commands retain those bindings.

![](_attachments/Pasted%20image%2020261030142544.png)

Choose **Import Node** in the Nodes palette to add a custom node to the project browser. Give it a name and category beside the preview, and configure its shape, labels, and optional commands. Use **Media → Add media** if it needs artwork, then choose **Import node**. The right-click menu shows the node name and type. Each placement starts with a copy of the imported settings, so later edits apply to that placement.

The node browser previews the saved proportions, button shape, crop, artwork scale, and colors. An empty Media node shows an image icon until you add artwork, including in the node browser and on the canvas. Large nodes shrink proportionally to fit the preview, and channel-driven SVG paints use their saved default colors.

Open **Preview** when importing or editing media to see the artwork inside its node. Adjust **Artwork scale** to enlarge or shrink it without changing the node size. Use **Contain** to keep its proportions, **Cover** to fill the face, or **Stretch** to fit its bounds. **Reset scale** returns the artwork to 100%. Custom handles follow the artwork as it scales. For SVGs, **SVG stroke width** adjusts line thickness independently. **Reset stroke** restores the original widths.

Open **Handles** when importing or editing media to place connection points on the artwork. Click to add a handle or drag it to move it. Each row lets you set X, Y, edge direction, role, and flow path. The shared **Flow paths** table starts with one path; add and name extra paths for separate circuits, then assign each handle to its path. Multiple paths appear as numbered colored guides over the artwork while editing handles. Unassigned-role handles do not relay activity, and handles assigned to **Isolated** do not join a circuit. Removing a handle also removes its path membership. Adding a custom handle replaces the four default handles. Choose **Use defaults** to restore them. **Apply** saves the handles and paths together; **Cancel** discards the draft.

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

## Draw and Configure Edges

With editing enabled, open **Style** to the left of the pencil. Hover **Flow** to open its color palette beside the menu. With nothing selected, Flow sets the color of new connections and the liquid in new built-in tanks. Choose **Default** or a color from **Saved** or **App colors**. Tank borders and backgrounds keep their own settings, and project tank presets retain their authored colors. Branches use the color of the edge they join.

Select items and open **Style** to change their colors. Color dots beside Style and each property show the configured colors. Matching saved and app colors are highlighted with a checkmark in their palette. Saved colors match both light and dark values; app colors match their variable reference and open **App colors** automatically. A matching color can also have been entered manually; the checkmark identifies a value match. Hover a property to open its color palette, or use the arrow keys to enter its submenu. The dropdown shows only the properties supported by the selection: **Flow** for connections and both the liquid fill and outline of selected Tanks, **Border** for node outlines, and **Background** for node bodies and panels. Tanks support all three; Border can adjust their outlines independently of the liquid fill. Flow Default restores the fill and outline to their own defaults. Cards and portals expose their visible borders and backgrounds. Tables expose their border and background colors. These backgrounds belong to the selected nodes; the canvas background is configured separately.

For a mixed selection, a color applies only to items that support the chosen property. Changing one property leaves the others intact. **Default** restores each item's default for that property, and Undo restores the whole change in one step. A selection with no supported color properties disables **Style**. Detailed settings remain available in **Node Config** and **Edge Config**, including the **Tank** tab for individual tank inputs.

Choose the pencil beside **Search colors** to open the Saved Colors dialog. Search for an existing color to edit or delete it, or use **New color** to start a new entry. Set the **Dark** and **Light** swatches, then name and save the color in the footer. The regular color picker's **Saved** tab opens the same dialog. Existing edges keep the colors stored when they were drawn.

Drag an edge's route handles to adjust its path.

![](_attachments/Pasted%20image%2020261030142735.png)

Select the edge to adjust its **Width** and **Color** under **Configuration** in Context.

![](_attachments/Pasted%20image%2020261030142846.png)
# Extending Schematics

An Interface plugin can add custom nodes with their own appearance, configuration, and command behavior. Start with [Interface Plugin → Schematic nodes](../Plugins/Interface%20Plugin.md#schematic-nodes), then use the [Schematic Node Reference](../Plugins/Reference/Interface/Schematic%20Nodes/Overview.md) for the available APIs.

[Shared and Bundled Assets](../Plugins/Storage%20and%20Settings.md#shared-and-bundled-assets) covers reusable files. Follow [Plugins](Plugins.md) to install and manage the extension.
