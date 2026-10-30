---
summary: Inspect node output, selection details, references, and project changes.
created: 2026-09-06T14:39
updated: 2026-10-29T18:30
---

These panels keep node activity, selection details, and project changes beside your main tab. Open **Node Board**, **Context**, or **Project** using the buttons near the bottom of the left sidebar; hover an icon for its name.

# Node Activity

The Node Board gives you a place to watch an Engine's messages while working in another view. For example, you can keep its logs visible while changing a device connection and see the result without switching tabs. It also shows events that need acknowledgement, prompts asking for an answer, and holds waiting for release. The bottom activity bar opens node output and shortcuts to aborts, holds, and prompts.

![Node logs open below the main workspace.](../Getting%20Started/_attachments/Pasted%20image%2020261024203349.png)

Keep logs open while starting a device task to catch errors without leaving its editor. For filters, history, and downloading records, follow [Events and Logs](Events%20and%20Logs.md).

# Context

Context lets you inspect or configure an item without leaving the view you are working in. Select an event to read its description and use its actions, or select a schematic item to change its properties and connected channels. The panel follows your selection. Use source buttons to open the related task, module, or script.

![A selected event's details, related graphs, and actions.](../Engine/_attachments/Pasted%20image%2020261028143012.png)

# Project Actions and References

A pressure channel might be read by a controller and displayed on several schematics. Renaming or deleting it can affect all of those places. Project helps you find those uses and review the changes together before applying them:

1. Right-click a channel and choose **Find references**.
2. Select a result to preview its runtime state and authored source, where available.
3. Choose the rename or delete action, then review affected resources, task stops, and warnings.
4. **Apply**, wait for the result, and inspect failed steps before continuing.

For **Channel Cleanup**, start from the Channels toolbar and select the candidates you intend to remove. An incomplete scan does not establish that a channel is unused. Publishers and retained scripts can recreate deleted resources.

Deletion can leave affected tasks stopped; check them afterward. [Stop and Cleanup](../Engine/Modules%20and%20Tasks.md#stop-and-cleanup) and [Removal and Replacement](../Engine/Modules%20and%20Tasks.md#removal-and-replacement) explain resource lifetime.

## Cancellation and Retry

A project change can involve several steps, such as stopping tasks and updating files. If it fails partway through, some steps may already be complete. Review the result so you know what remains before retrying.

Closing the panel does not cancel submitted work. **Cancel action** stops remaining steps; completed changes remain. Use **Retry** for failed steps, or **Reload actions** after failed preparation. Review partial results before repeating an action.

# Builder Logs

Native DCode needs to be compiled before the Engine can run it. **Builder** performs that preparation; its logs explain problems such as code that could not compile, which may prevent your edited automation from loading.

**Project → Builder logs** shows **DARTWIC BUILDER** output. Read it alongside the script's activation result and follow file/line links to the [editor](DCode%20Editor.md). To download saved output, select the Builder stream in [ARGUS Logs](Events%20and%20Logs.md#recorded-logs) and export its time range.
