---
title: tempest/peers/get-runtime-metadata
summary: Returns runtime metadata.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** TEMPEST peers

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `kind` | `string` | Peer kind (`engine`). |
| `node_name` | `string` | RAPID node name advertised to remote engines. |
| `channel_stream_version` | `integer` | Live channel stream protocol version. |
| `peer_revision` | `integer` | Latest TEMPEST peers revision. |
| `server_time_ms` | `integer` | Server wall-clock time in Unix-epoch milliseconds. |
