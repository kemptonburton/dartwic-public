---
updated: 2026-06-23
created: 2026-06-23
---

This page is the shortest path from first launch to a useful DARTWIC session.

# Before You Start

You need:

- a running DARTWIC engine
- a reachable interface or client
- access to the channels, tasks, or modules you care about
- permission to command hardware if you plan to write values

# First Session Checklist

1. Connect to the target engine.
2. Confirm the interface shows a healthy connection.
3. Open the smallest channel set that answers your question.
4. Check that timestamps are moving and values are fresh.
5. Identify which channels are observe-only and which are commandable.
6. Check task state before starting, stopping, holding, or releasing automation.
7. Confirm control authority before sending a command.
8. Export or query only the data slice you actually need.

# First Things To Learn

- how live channels are named in your deployment
- what stale data looks like in the interface
- which channels are recorded for history
- which tasks and modules own the behavior you care about
- which plugin resources are part of your normal workflow
- what level of command authority your session has

# Good Operating Habits

- start with a focused channel set instead of browsing everything
- treat stale data as a workflow issue, not just a display issue
- confirm control state before writing commands
- avoid broad exports until a small query proves the shape is right
- keep task actions deliberate: start, stop, hold, and release should each have a reason

# Next Steps

- Learn the runtime model: [Engine Overview](../Engine/Overview.md)
- Learn the interface model: [Interface Overview](../Interface/Overview.md)
- Review examples: [Examples and Use Cases](Examples%20and%20Use%20Cases.md)
