---
title: dartwic/files/changed
summary: Invalidates editor template dependencies after project script files change.
created: 2026-10-04T18:31
updated: 2026-10-04T21:09
---

- **Category:** Projects and Files
- **Direction:** Server → clients

## Delivery

Published for changed script files while a script or YAML editor is open.

## Payload

| Field | Type | Presence | Description |
| --- | --- | --- | --- |
| `paths` | `array<string>` | Always | Changed project-relative file paths. |
