---
title: "SettingsSnapshot"
summary: "Effective settings, overrides, leaf sources, and an opaque revision."
---

## Import

```ts
import type { SettingsSnapshot } from "@dartwic/interface-sdk/storage";
```

## Declaration

```ts
export interface SettingsSnapshot { effective: Record<string, any>; workspace: Record<string, any>; project: Record<string, any>; sources: Record<string, string>; revision: string; }
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `effective` | `Record<string, any>` | Required |  |
| `workspace` | `Record<string, any>` | Required |  |
| `project` | `Record<string, any>` | Required |  |
| `sources` | `Record<string, string>` | Required |  |
| `revision` | `string` | Required |  |
