---
updated: 2026-06-23
created: 2026-06-23
---

Checklists are Markdown-backed operator procedures. Use them for startup checks, shutdown steps, test cards, commissioning notes, recovery procedures, and repeatable workflows that should live with the project.

# What They Are

A checklist is a `.md` resource in the project `checklists` area. New checklists start as a Markdown document with a task item, then operators can edit them into a procedure.

Good checklist content is specific:

- what to verify
- what value or state is acceptable
- what action to take
- what to watch after the action
- where to go next if the step fails

# Editing And Viewing

The checklist editor supports Markdown editing and rendered viewing. It is meant to be practical during operations, not just a note file.

Common features include:

| Feature | Use |
| --- | --- |
| task list items | Track procedural steps with checkboxes. |
| edit and view modes | Switch between authoring and operator use. |
| line-number modes | Refer to exact steps during review or procedures. |
| live sync | Keep checklist changes current across the interface. |
| presence and context panel | See related context when collaboration features are enabled. |

# Useful Markdown Inserts

Checklists can include DARTWIC-aware inserts so a procedure can point at live data or project resources.

| Insert | Use |
| --- | --- |
| `@channel-display(...)` | Show a live channel value inside the checklist. |
| `@channel-button(...)` | Add a deliberate channel action button for an operator step. |
| `@resource(...)` | Link to another project resource. |
| `@remote-view(...)` | Embed or reference a remote schematic view. |
| `@schematic-node(...)` | Reference a specific schematic node. |

Keep command buttons rare and explicit. A checklist should make a command step clear enough that the operator knows what is being written, where it is being written, and what should happen afterward.

# Good Checklist Patterns

| Pattern | Example |
| --- | --- |
| startup | Confirm required remote nodes are connected, required tasks are running, and critical channels are fresh. |
| shutdown | Stop tasks in order, confirm final states, then disconnect or secure external systems. |
| test run | Record setup values, start recording, run the procedure, then open the dataframe or exporter. |
| fault response | Confirm ARGUS event details, check affected channels, apply the approved recovery path. |
| plugin workflow | Link to plugin pages, schematics, or resources needed for a project-specific process. |

# What To Avoid

- vague steps such as "check target" without naming the channel, task, node, or system
- command buttons without surrounding instructions
- copying outdated procedures into a new project without checking channel names
- using checklists as a replacement for ARGUS events or telemetry history

# Read More

- [Schematics](Schematics.md)
- [Channel Search](Channel%20Search.md)
- [ARGUS Events](ARGUS%20Events.md)
- [Commanding and Control](../Engine/Commanding%20and%20Control.md)
- [Plugins](Plugins.md)
