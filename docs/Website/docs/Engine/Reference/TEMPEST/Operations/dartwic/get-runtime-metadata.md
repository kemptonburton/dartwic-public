---
title: dartwic/get-runtime-metadata
summary: Returns runtime metadata.
created: 2026-08-03T16:00
updated: 2026-10-20T18:59
---

- **Category:** Engine Runtime

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `engineVersion` | `string` | Running engine version. |
| `enginePlatform` | `string` | Runtime operating-system key. |
| `engineArchitecture` | `string` | Runtime processor architecture. |
| `engineBuildId` | `string` | Unique engine build identifier. |
| `updaterProtocolVersion` | `integer` | Supported updater protocol version. |
| `enginePluginsDir` | `string` | Absolute engine-plugin directory. |
| `workspaceRootDirectory` | `string` | Absolute workspace root directory. |
| `globalDataDirectory` | `string` | Absolute global-data directory. |
| `activeProject` | `Project` | Active project `name` and absolute `path`. |
| `projects` | `array<Project>` | Available projects, each with `name`, `path`, and `is_active`. |
| `license` | `object` | Current license and entitlement status. |
| `dartwicClientType` | `string` | Registered DARTWIC client type for the requester. |
| `dartwicClientVersion` | `string` | Registered DARTWIC client version for the requester. |
| `interfaceType` | `string` | Registered interface type for the requester. |
| `interfaceVersion` | `string` | Registered interface version for the requester. |
