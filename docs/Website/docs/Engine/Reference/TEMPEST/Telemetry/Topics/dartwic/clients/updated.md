---
title: dartwic/clients/updated
summary: Publishes the current public profile and runtime identity of an updated client.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

- **Category:** Clients
- **Direction:** Server → clients

## Delivery

Published after `dartwic/update-client-info` saves client metadata.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | Always | Identifier of the updated client. |
| `client_username` | `string` | Always | Username associated with the client. |
| `client_name` | `string` | Always | Display name for the client. |
| `avatar_image_src` | `string` | Always | Avatar image source or an empty string. |
| `avatar_image_placeholder_text` | `string` | Always | Fallback avatar text. |
| `client_category` | `string` | Always | Client category supplied by the client. |
| `client_role` | `string` | Always | Client role supplied by the client. |
| `node_name` | `string` | Always | DARTWIC node hosting the client. |
| `instance_number` | `integer` | Always | Instance number for clients sharing a username. |
| `dartwic_client_type` | `string` | Always | DARTWIC client implementation type. |
| `dartwic_client_version` | `string` | Always | DARTWIC client implementation version. |
| `interface_type` | `string` | Always | Interface implementation type. |
| `interface_version` | `string` | Always | Interface implementation version. |
| `timestamp` | `integer` | Always | Server Unix-epoch timestamp in milliseconds. |
