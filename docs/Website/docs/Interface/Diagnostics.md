---
summary: Interpret live engine measurements, warning evidence, and local clock checks.
created: 2026-10-04
updated: 2026-10-21T15:45
---

Open **Settings → Diagnostics** to inspect engine resources, RAPID, ARGUS, CAESAR, and TEMPEST. Rows show a current measurement, recent graph, and related events. Expand a row for its basis, formula, inputs, and supporting counters. Missing or stale measurements are unavailable, not zero.

The diagnostic area tabs sit to the left of Search in one toolbar. Tabs keep their
normal size while the search input adjusts to the available width.

## Read the evidence

| Area | What the measurements establish |
| --- | --- |
| Resources | Machine/process CPU, physical memory, process resident memory, and storage on the actual data volumes. Process memory is not a heap-allocation count. |
| RAPID | Channel access/write rates, fixed-slot use, recording progress, queue pressure, and lost samples or notifications. Recording loss and notification loss have separate counters. |
| ARGUS | Log backlog, dropped records, write failures, event-persistence progress, and event-publication loss. Read event recording `queued_jobs`, `deferred_updates`, `oldest_pending_ms` and `rejected_recording_jobs_total` separately from `publication_queued` and `publication_dropped_total`. A visible event is not proof its history reached disk; a dropped publication is not proof its history was lost. |
| CAESAR | Scheduler and internal runtime measurements. Inspect an application's [task card](Managing%20Tasks.md) for its own timing and failures. |
| TEMPEST | Transport payload rates, bounded queues, drops, operation rejections, and timeouts. Mbps measures traffic; it does not establish available bandwidth or a successful physical command. |

Peer measurements belong in [Network Map](Network%20Map.md), where connection and snapshot progress can be read together. A queue replacement that discards an obsolete display snapshot is distinct from lost recorded samples or a rejected operation.

WebSocket telemetry also has byte limits: 64 MiB per connection and 256 MiB across the web adapter, including posted, queued and in-flight payloads. A slow interface can reach its byte limit while message-count queue pressure is low. Inspect the web transport's `outbound_pending_bytes`, byte limits and `dropped_total` in the diagnostic evidence. Capacity drops mean observations were omitted; they do not mean recorded channel samples were lost or an HTTP command failed. Transport send rates count accepted payloads across paths and do not prove interface receipt or rendering.

The independent engine sampler runs approximately every half second. Ordinary application snapshots arrive at 5 Hz. These are observation and delivery rates, not device sampling or control frequencies.

## Configure warnings

Open a row's warning settings to enable a rule and choose **Above**, **Below**, or **Outside range**. Boundary values are within the rule. Switches and modes save immediately; numeric limits save after typing pauses or the popup closes. Invalid limits stay unsaved.

ARGUS warnings describe the affected resource and observed evidence. Queue pressure or a chosen CPU threshold can prompt investigation; neither establishes a failure by itself. Actual loss, write errors, callback failures, timing misses, and operation timeouts have their own conditions. A timeout leaves remote completion unknown.

Condition rows show **Firing**, **Not firing**, or **Unavailable**, with the engine's supporting evidence. Their **Events** switch controls new ARGUS events for that condition; measurements and existing history remain available when it is off. A row marked **Recorded event** describes saved evidence without claiming a current evaluation. Open its recorded event for the original details. Older engines may not support individual condition switches.

Internal CAESAR runtime warning switches default off; custom DCode/plugin runtime warnings default on. Disabling a warning leaves its measurements available. Acknowledging an event records that you saw it; recovery follows the underlying condition.

## Check interface and engine clocks

Open **Local Interface** for the estimated engine-minus-interface clock offset. A positive value means the engine clock is ahead. Expand it to see round-trip time, uncertainty bounds, and the last check.

The check does not identify which clock is correct or assume equal network delay in both directions. Warnings require repeated violations confirmed by the bounds; a delayed or ambiguous reply cannot confirm a clock fault. Configure the warning limit locally. These issues appear in Notifications and Settings, separately from engine ARGUS events.
