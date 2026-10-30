---
title: Node, Context, and Project Board
summary: Inspect node output, selection details, references, and project changes.
created: 2026-09-06T14:39
updated: 2026-10-30T15:54
---

These panels open from the lower left sidebar beside your main view: **Node Board** shows events and logs for the local Engine and connected nodes ([TEMPEST peers](Network%20Map.md#peers)), **Context** inspects or configures your selection, and **Project** reviews changes across resources.

![](_attachments/Pasted%20image%2020261030154516.png)

# Node Board

Open **Node Board** to keep a node's events and logs visible while working elsewhere. Other nodes connect through **TEMPEST peers**; choose the local Engine or an available peer node to follow its output.

![Node logs open below the main workspace.](../Getting%20Started/_attachments/Pasted%20image%2020261024203349.png)

## Node Activity

Each node—the local Engine and each connected **TEMPEST peer**—gets its own tab in the bottom node bar. 

Click its tab to view [events](Events%20and%20Logs.md#events), acknowledge conditions, answer prompts, or release holds. 

![](_attachments/Pasted%20image%2020261030154753.png)

Click the tab's **radio icon** for [network traffic](Network%20Map.md#viewing-network-traffic).

![](_attachments/Pasted%20image%2020261030154824.png)

Or its**Logs button** for that node's [log output](Events%20and%20Logs.md#logs). Those guides cover filtering, inspection, and available exports.

![](_attachments/Pasted%20image%2020261030154845.png)

On the right of the node bar, the **Aborts**, **Holds**, and **Prompts** buttons combine those events across the local Engine and connected peer nodes. Click one to review that category across nodes without opening each node tab.

# Context

Open **Context**, then select an item. The panel follows your selection: an event shows details and actions; a schematic node shows its properties and channel bindings. Source buttons open related tasks, modules, or scripts.

![](_attachments/Pasted%20image%2020261030153908.png)

See [Schematic Editing](Schematics.md#schematic-editing) and [Events](Events%20and%20Logs.md#events) for those controls.

# Project Board

Open **Project** to review changes across resources, such as renames, deletions, and channel cleanup. Related resource commands also open this panel.



Project actions can have bugs, including missed references between resources. If you find an incorrect or incomplete plan, please use [**Settings → General → Report a bug**](Navbar%2C%20Resources%2C%20and%20Settings.md#general). These actions automate changes you can also complete manually: edit the affected scripts or resource configuration and manage channels directly. Use an offered override where available, or make the underlying changes yourself if the automated action cannot finish.

## Project Actions and References

Right-click a channel and choose **Find references** to locate uses in scripts, schematics, and other resources. 

![](_attachments/Pasted%20image%2020261030155017.png)

For a rename or deletion, review the proposed edits and task stops, then **Apply** and inspect the result. Check affected tasks afterward; see [Removal and Replacement](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) for what remains.

![](_attachments/Pasted%20image%2020261030155107.png)

## Channel Cleanup

Choose **Channels → Review channel cleanup** to review leftover channels in Project. Inspect candidates and references, select channels, then **Apply**. A missing reference does not prove a channel is unused; active producers can recreate deleted channels.

![](_attachments/Pasted%20image%2020261030155141.png)

## Cancellation and Retry

The X in the Project Actions header cancels the selected action and keeps the board open, including while an action is being prepared. **Cancel action** stops remaining running steps at a safe boundary; completed changes remain. Closing the whole Project board through its navigation does not cancel Engine work. Review partial results before using **Retry**, or **Reload actions** after failed preparation.

## Builder Logs

Open **Project → Builder logs** for native DCode compilation output. Follow file/line links to the [editor](DCode%20Editor.md), or use the download menu to [export logs](Events%20and%20Logs.md#export-logs). See [Native C++ Execution](../DCode/Native%20C%2B%2B%20Execution.md) for compiler setup and activation details.
