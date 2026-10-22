---
title: tempest/peers/connect
summary: Connects the engine to a TEMPEST peer.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

- **Category:** TEMPEST peers

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `host` | `string` | Optional | Remote host name or IP address; defaults to `127.0.0.1`. |
| `port` | `integer` | Optional | Remote TEMPEST base port; defaults to 7200. |
| `password` | `string` | Optional | Registration password; defaults to `admin`. |
| `peer_id` | `string` | Required | Registered peer definition, such as `tempest.engine` or `example_device_plugin.example_flight_link`. |
| `node_name` | `string` | Optional | Expected remote node name. |
| `rapid` | `object` | Optional | RAPID settings: `enabled`, `publish_all`, and a `channels` array of channel keys (not fields). |
| `argus` | `object` | Optional | ARGUS settings containing `enabled`. |
| `remember` | `boolean` | Optional | Persist the connection for automatic reconnection; defaults to true. |

## Response payload

**RemoteNode:** The connected node descriptor, including identity, endpoint, peer kind, connection state, metadata, and health counters.
