---
title: rapid/channel-created
summary: Announces every channel created through the normal RAPID lifecycle.
created: 2026-08-04T16:30
updated: 2026-10-04T21:09
---

- **Category:** Channels
- **Direction:** Server → clients

## Delivery

Published asynchronously after RAPID commits the channel's first write.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `channel_name` | `string` | Always | Flat channel name, including a remote node prefix when applicable. |
| `created_by_client_id` | `string` | Always | Originating TEMPEST client when one exists. |
