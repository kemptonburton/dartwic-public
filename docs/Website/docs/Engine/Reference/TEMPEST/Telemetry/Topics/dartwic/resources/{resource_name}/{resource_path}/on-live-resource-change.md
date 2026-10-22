---
title: dartwic/resources/{resource_name}/{resource_path}/on-live-resource-change
summary: Broadcasts live, resource-specific changes to other clients viewing the same resource.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Resource Collaboration
- **Direction:** Client → server → clients

## Delivery

Sent explicitly by a resource UI through the TEMPEST client-relay binding.

## Payload

**`object`:** Resource-specific live-change data. Editors commonly send incremental change batches, complete content, or both.
