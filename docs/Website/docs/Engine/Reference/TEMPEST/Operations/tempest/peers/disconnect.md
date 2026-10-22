---
title: tempest/peers/disconnect
summary: Disconnects a TEMPEST peers node.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `node_name` | `string` | Optional | Connected node name. Supply this or an endpoint identifier. |
| `id` | `string` | Optional | Connection identifier, normally `host:port`, used when `node_name` is unavailable. |
| `host` | `string` | Optional | Remote host used with `base_port` or `port` to identify the connection. |
| `base_port` | `integer` | Optional | Remote base port used with `host`. |
| `port` | `integer` | Optional | Alias for `base_port`. |
| `forget` | `boolean` | Optional | Remove the saved connection as well as disconnecting; defaults to false. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `removed` | `boolean` | Whether a matching active connection was removed. |
| `node_name` | `string` | Name of the disconnected node when a connection was found. |
