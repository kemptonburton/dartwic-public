---
title: dartwic/update-client-info
summary: Stores the requesting client's public profile and updates its connection metadata.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Clients and Telemetry

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `client_info` | `object` | Required | Public profile object. `client_username` is required; supported display fields include `client_name`, `avatar_image_src`, `avatar_image_placeholder_text`, `client_category`, `client_role`, and `node_name`. |
| `client_metadata` | `object` | Optional | Additional connection metadata merged into the requesting client's server-side data. |

## Response payload

This operation returns an empty payload (`{}`).

## Errors

- `client_info` is missing, is not an object, or has no `client_username`; or `client_metadata` is not an object.
