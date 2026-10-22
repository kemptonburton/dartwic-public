---
title: Resource Collaboration telemetry
summary: Client activity, presence, live changes, and synchronization for shared interface resources.
created: 2026-08-04T16:32
updated: 2026-10-20T18:59
---

| Topic | Direction | Description |
| --- | --- | --- |
| [`dartwic/clients/resource-activity`](Topics/dartwic/clients/resource-activity.md) | Client → server → clients | Announces that a client opened or closed an interface resource. |
| [`dartwic/resources/{resource_name}/{resource_path}/on-live-resource-change`](Topics/dartwic/resources/%7Bresource_name%7D/%7Bresource_path%7D/on-live-resource-change.md) | Client → server → clients | Broadcasts live, resource-specific changes to other clients viewing the same resource. |
| [`dartwic/resources/{resource_name}/{resource_path}/on-live-resource-presence`](Topics/dartwic/resources/%7Bresource_name%7D/%7Bresource_path%7D/on-live-resource-presence.md) | Client → server → clients | Broadcasts a client's live presence for a specific resource. |
| [`dartwic/resources/{resource_name}/{resource_path}/on-resource-sync-status`](Topics/dartwic/resources/%7Bresource_name%7D/%7Bresource_path%7D/on-resource-sync-status.md) | Client → server → clients | Reports whether a client is actively saving, pulling, or synchronizing a resource. |
