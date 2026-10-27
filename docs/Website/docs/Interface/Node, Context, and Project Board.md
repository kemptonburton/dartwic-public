---
summary: Inspect node output, selection details, references, and project changes.
created: 2026-09-06T14:39
updated: 2026-10-26T21:52
---

These panels keep supporting information beside your work. Open the **Node Board** for node output, **Context** for the current selection, and **Project** for references and project actions.

# Node, Context, and Project panels

| Panel | Use it for |
| --- | --- |
| Node Board | Node-scoped events, prompts, holds, and logs. |
| Context | Properties and configuration for the selected channel, schematic node, or resource. |
| Project | References, reviewed actions, progress, and Builder logs. |

The context panel follows your selection. Selecting a resource in Project shows its runtime state and available source alongside it. A runtime identity and its authored file can be opened independently.

# Node activity

Use the Node Board to monitor output without replacing your main resource tab. Open an event for its description and actions, or choose the node's log stream.

[Events](Events.md) explains acknowledgement, prompts, and holds. [Logs](Logs.md) explains stream, session, and time filters.

# Project actions and references

**Find references** shows ownership and uses in scripts, tasks, modules, and schematics. Inspect the listed files and declarations before renaming or deleting a resource. Creation or last-writer history alone does not establish current ownership.

**Apply** refreshes the evidence and runs the requested action, including needed operator authority and task stops. Warnings and incomplete scans require review; they do not automatically prevent an administrator from applying a change. Viewers cannot apply actions.

| Action | Review before applying |
| --- | --- |
| Channel Cleanup | Channels without current owners or references. Retained control authority shows a warning and starts unselected. |
| Delete a channel | Affected tasks stop; surviving work stays stopped for reference repair. |
| Delete a task or module | Linked tasks, owned-channel cleanup, task-group releases, configuration removal, and snapshot saving. Read-only inputs are not automatically deletion candidates. |
| Rename a channel | Supported reference repairs, stopped work, unsupported references, and native bindings. Conflicting destination names are not overwritten. |

After a rename, ordinary tasks restart only once bindings and authority are restored. Timelines stay stopped because their elapsed position cannot be preserved. Parameter-derived DCode references may require editing YAML or the template and reactivating it.

A saved peer connection owns its cached channels while offline. A publisher can recreate a deleted channel, and retained DCode source can recreate deleted runtime resources. Incomplete scans are not proof that a channel is unused.

## Cancellation and retry

Actions run one at a time. **Cancel action** removes queued work immediately or stops running work between steps. Completed deletions remain deleted. A cancelled rename attempts recovery.

Failed steps show their concrete errors while independent steps can continue. **Retry** attempts the remainder. Recovery and snapshot-save failures still need attention even if some runtime changes succeeded.

When deleting a module, a linked task's failed removal keeps the module in place, including when only that task's saved file remains. Resolve the file error and retry the action to finish removing both.

For Engine lifecycle and cleanup responsibilities, see [Modules and Tasks](../Engine/Modules%20and%20Tasks.md).
