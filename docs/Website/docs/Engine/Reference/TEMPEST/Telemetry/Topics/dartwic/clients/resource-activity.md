---
title: dartwic/clients/resource-activity
summary: Announces that a client opened or closed an interface resource.
created: 2026-08-04T16:32
updated: 2026-10-20T18:59
---

- **Category:** Resource Collaboration
- **Direction:** Client → server → clients

## Delivery

Sent by an interface client when resource activity changes; the server updates that client's open-resource state, adds client identity fields, and broadcasts the enriched payload.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `kind` | `string` | Always | Activity kind, normally `opened` or `closed`. |
| `resource_name` | `string` | Always | Registered resource type. |
| `resource_path` | `string` | Always | Resource path within its type. |
| `clientId` | `string` | Always | Identifier added by the server for the sending client. |
| `username` | `string` | Always | Username added by the server for the sending client. |
| `instance_number` | `integer` | Always | Client instance number added by the server. |
| `open_resources` | `array<object>` | Always | Sending client's current open-resource list after the activity is applied. |
| `timestamp` | `integer` | Always | Original telemetry timestamp in Unix-epoch milliseconds. |
