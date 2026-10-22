---
title: Events telemetry
summary: ARGUS event mutations, snapshots, and the legacy console projection.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

| Topic | Direction | Description |
| --- | --- | --- |
| [`argus/events/created`](Topics/argus/events/created.md) | Server → clients | Publishes the complete ARGUS record after an event is created or its correlated record is updated. |
| [`argus/events/deleted`](Topics/argus/events/deleted.md) | Server → clients | Publishes an ARGUS deletion mutation after an event status changes to `deleted`. |
| [`argus/events/firing-states-changed`](Topics/argus/events/firing-states-changed.md) | Server → clients | Publishes authoritative ARGUS firing-state transitions. |
| [`argus/events/history-refresh`](Topics/argus/events/history-refresh.md) | Server → clients | Tells history consumers to refresh after a large mutation batch or bounded publication overflow. |
| [`argus/events/snapshot`](Topics/argus/events/snapshot.md) | Server → clients | Publishes the complete current ARGUS in-memory board. |
| [`argus/events/updated`](Topics/argus/events/updated.md) | Server → clients | Publishes the complete ARGUS record after an event is created or its correlated record is updated. |
| [`dartwic/get-console-data`](Topics/dartwic/get-console-data.md) | Server → clients | Publishes the legacy console view derived from active ARGUS events. |
