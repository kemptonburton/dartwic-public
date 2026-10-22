---
title: dartwic/updates/stage/start
summary: |-
  Resolves, downloads, verifies, and stages an official engine release as a detached job.
  Only the release tag and version are accepted from the caller; URLs and paths are resolved by the engine.
created: 2026-09-04T17:13
updated: 2026-10-20T18:59
---

- **Category:** Engine Updates

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `tag` | `string` | Required | Official GitHub release tag. |
| `version` | `string` | Required | Engine version from that release. |

## Response payload

**DetachedJob:** Detached staging job descriptor.
