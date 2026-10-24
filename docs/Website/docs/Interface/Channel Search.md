---
summary: Find live signals, inspect metadata, and open graphs or controls.
updated: 2026-10-23T18:49
status: coming-soon
created: 2026-09-04T17:13
---

Open **Channels** in the left navigation to search current RAPID channels. Search by a device, task, or signal name, then select a channel name to inspect its details.

![Searching for tank signals in the Channels resource.](../_attachments/channel-search.jpg)

The interface remembers your **Channel list** or **Modules / Tasks** view choice locally, including after restarting the interface.

In **Modules / Tasks**, task headers include the same Start, Stop and Hold controls
as module pages, followed by one compact measured-frequency readout formatted like
the loops (for example, `10Hz`, or `0Hz` for a stopped worker). Header content follows **name | controls and frequency
(when available) | channel count**, with matching short dividers and no trailing resource-type label. Compact inline controls
align with the other browser rows; task state uses button color instead of a
separate running/off badge. Green, red and yellow
identify the task actions. Click an
action once to arm it, then click its check mark to confirm within four seconds;
Escape or clicking away cancels. Hold toggles to release hold. Frequency is read-only;
change the target rate in the Tasks resource. Viewers, disconnected sessions
and rebuilding tasks have mutation controls disabled. These controls do not expand
or collapse the task's channels; use the task header for that. Live control-channel
subscriptions follow rendered task rows and are released when those rows leave
the view.

## Read the results

The Modules / Tasks header shows **# modules · # tasks** for the current search
and filters, including matching resources inside collapsed branches.

Task start/stop and inventory updates keep the current results visible while
refreshing in the background. Channel additions and removals update the affected
rows; the Modules / Tasks tree waits for ownership information before placing a
new channel. A temporary refresh failure retains the last successful results.

Both browser layouts use the same channel state and colors for names, graphs and
values. Missing or unavailable channels use the Not Found color; otherwise active
event colors take priority over stale coloring. Without an active event, stale
channels use the stale color and recover when their source timestamp advances.
Event tones match the Events view: errors, critical events and aborts are red;
warnings and holds are yellow; prompts are blue; informational events use the
normal text color. Event badges still identify active alerts on a missing channel.

Rows show the channel name, a small graph, and the current value. Results are grouped by node; remote channel keys retain their node prefix. **+ more channels** reveals up to 10 additional results per click, and **SHOW ALL** reveals the full group. Use the field filter to narrow by metadata when a text search is too broad.

**SHOW ALL** expands the browsable results; live value subscriptions follow the rows currently on screen and any focused channel as you scroll. It does not subscribe to every result at once.

Live value updates reuse the catalog's grouping and sorting. Visible sparklines
share a redraw clock, while off-screen sparklines remain suspended.

The **Update** selector controls how often the view redraws received telemetry. It defaults to **LIVE**; slower options are available when you want them. It does not change device acquisition, a task's target frequency, or recording policy. A stopped simulation can display a flat graph with perfectly valid stored values, as in the screenshot.

## Inspect and edit a channel

Engine diagnostic channel origins offer both **Open in loop search** and **Open diagnostics**. The warning-triangle Diagnostics button opens the relevant measurement in Settings; the loop button opens its running publisher. The same Diagnostics button appears beside **Fired by** in ARGUS event details.

| Field | What it tells you |
| --- | --- |
| `value`, `units` | Current numeric value and engineering units. |
| `timestamp`, `stale_timeout` | Last update and freshness threshold in seconds. |
| `record_mode` | Whether accepted writes produce history samples. |
| `control_policy`, `control_owner`, `active_controller` | Whether the channel is free, owned by automation, manually overridden, or observe-only. |
| `commanded_by` | Trusted provenance of the latest accepted value write. |
| `value_options` | Numeric choices and labels offered by the control. |
| `startup_value` | Optional value applied at the next engine startup. |

Select the value control to edit a writable value. The engine enforces authority even if another client sends the same request directly. Every existing channel offers **Manual override** in its authority dropdown, including free, observe-only, diagnostic, and remotely sourced channels. Ordinary observe-only writes remain blocked until an operator explicitly takes manual control. Releasing manual override restores the previous policy. See [Commanding and Control](../Engine/Commanding%20and%20Control.md) for taking and releasing manual control.

Changing a startup value configures the **next start**; it does not issue a command now. Changing recording settings affects future samples, not past history.

## Work with several signals

Select rows to use the toolbar's bulk actions, edit shared settings, or open them in [Telemetry Exporter](Telemetry%20Exporter.md). A channel's data-frame link opens its historical group. You can also use channels in [schematic nodes](Schematics.md) for a reusable view.

**Channel Cleanup** in the top bar prepares a Project action for channels with no current owner or references. Review its candidates before applying deletion. An orphan with no current owners or references remains visible even when it retains control authority such as `observe_only`: it appears under **Under authority** with a red warning, starts unselected, and requires explicit manual override to delete. This applies regardless of which resource created the channel. Configured offline peers still own their cached channels.

Actions and References share the same resource previews. Channels use the Channel Search row with its live values and controls. Tasks and timelines use the Tasks list row; loops, channel calculations, and callbacks use their resource tables. When a runtime resource has an authored source, a resizable read-only source pane appears beside it with a file path, line, and open-source link. The columns have a visible dividing line and drag handle. Each pane has one open control: **Open resource** for the resource pane and the file-path link for its source. Source text wraps within the editor and scrolls independently; live runtime updates preserve your scroll position. References combine current ownership with the matching source occurrence instead of showing a second owner selection. Generated event firing calculations link to their `on_firing:` block; events link to the event declaration. **Find references** opens References and fills the search in one click, including when the Project panel was closed.

In both Actions and References, click a resource name to inspect it and use its separate arrow to expand or collapse channels. Clicking a child channel opens its Channel Search controls, with the referenced DCode or text location beside it when available. Channel rows share the same icon, styling and evidence details on both pages. Module selection and module deletion/reload steps show the normal module UI. Repeated evidence at the same source line shares one row; distinct source lines remain separate selections.

The **References** view separates creation history from current ownership and links to the tasks, scripts, modules, and schematic instances using the signal. **Created on: node:MY_NODE** identifies location; **Dependency: node:SECONDARY_NODE** identifies a saved peer connection that still needs the channel. `commanded_by` is last-writer history and does not establish ownership. Cleanup rechecks candidates before removing them; incomplete scans, ambiguous legacy origins, and active manual control keep a channel out of automatic deletion.

Deletion review shows each channel's checks inline in cleanup and deletion actions, wrapping onto additional lines as needed. Green checks identify a creator confirmed gone, no current owners, and no references found by a complete scan. Unknown creation history and incomplete scans are shown explicitly instead of claiming those checks passed. Red indicators identify control authority, direct ownership, or native bindings that require operator manual override. Yellow indicators identify an existing recorded creator, references in saved files, possible references, incomplete scans, or unverified history. Creation history alone does not establish current control authority. A channel can have several reasons; elevated authority appears first. Only action rows with a channel, task, script, reference list, or provider control to inspect are selectable. Selectable rows highlight on hover; progress-only rows keep the current detail view unchanged.

The review checkbox permits deletion despite yellow evidence, including stale fixed channels with unknown creation history. For red channels, it explicitly authorizes manual deletion. Only an authenticated operator can request that authority; a headless client cannot. The engine rechecks the reviewed evidence and uses normal channel removal, including generation invalidation for fixed handles, then saves successful deletions to the channel snapshot. Active publishers may recreate a deleted channel; native callers holding a retired handle receive a stale-handle result until reconfigured.

Every running Project action offers **Cancel action**. It requests a stop at the next safe step; an operation already in progress finishes first. A cancelled rename runs its recovery path to restore the previous state. Completed deletions remain and are saved to the snapshot. Errors appear above the scrolling steps. If the engine cannot save its recovery record before starting, the action stops without making changes and can be acknowledged. A failure after some removals reports the completed work; cancellation does not restore removed channels.

Renaming a channel lists the affected task stops, reference edits, task reconfiguration or script activation, restart of previously running tasks, source-channel retirement, and snapshot save. Activating an edited DCode file can replace other tasks from that file, so those tasks are included too. Previously stopped tasks stay stopped. Restarting resets runtime state; a running timeline must be stopped before renaming because its elapsed position cannot be restored. Release or stop a held task before applying a rename.

Direct channel deletion and cleanup also list affected task stops. These tasks remain stopped after deletion because their references have not been rewritten. Native handles to retired channels become stale; repair bindings before restarting. Task/module deletion instead enumerates owned channels as part of its cascade. All of these actions recheck reviewed evidence before mutation and show why an unresolved requirement blocks application.

Native task declarations, metadata and ownership evidence for the same channel share one channel row under that task. Its tooltip retains the individual locations. Separate authored code occurrences remain selectable at their own lines.

Saved DCode templates resolve channel references through their YAML parameters, using the same expansion as script activation. A parameter such as `|{params.channel}|` refers to the concrete channel values selected from YAML. A failed expansion reports an incomplete scan instead of assigning that placeholder to unrelated channels. To change a resolved reference, edit its YAML or template and reactivate the script.

A stored control policy such as observe-only remains a red authority indicator even when its recorded controller's current binding is uncertain. That uncertainty does not turn active channel authority into a yellow usage warning.

If a signal is missing, confirm the active project and source module or task. A disconnected TEMPEST peer's channels remain in search with their last known fields and values, marked **Not Found**; commands are unavailable until the peer reconnects. For a remote signal, inspect [Network Map](Network%20Map.md). If a value is stale, check the source before increasing its timeout.
