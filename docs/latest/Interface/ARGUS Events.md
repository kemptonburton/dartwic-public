---
updated: 2026-06-23
created: 2026-06-23
---

ARGUS event surfaces show what the engine wants operators to notice. They include messages, warnings, errors, prompts, holds, aborts, DCode print output, process output, and operation observations.

# Interface Surfaces

- pinned events bar for current high-priority operator attention
- events board for filtering and reviewing event history
- prompt and hold views for operator responses
- terminal/event view for runtime output
- event details for source, channels, actions, and resolution text

# Event Actions

Depending on the event, the interface may offer actions such as:

- acknowledge
- silence
- delete
- respond to prompt
- release hold

# How To Use Events

1. Open the event.
2. Read title, description, source, subsystem, and resolution.
3. Check related channels and task/source context.
4. Take the offered action only when the runtime condition is understood.
5. Use Channel Search or Schematics to confirm the system state changed as expected.

# Read More

- [Events and ARGUS](../Engine/Events%20and%20ARGUS.md)
- [DCode and Scripting](../Engine/DCode%20and%20Scripting.md)
- [Managing Tasks](Managing%20Tasks.md)
