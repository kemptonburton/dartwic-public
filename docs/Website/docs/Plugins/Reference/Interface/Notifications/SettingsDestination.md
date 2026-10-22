---
title: "SettingsDestination"
summary: "Explicit settings destination; nestedTab selects a page's internal tab."
---

## Import

```ts
import type { SettingsDestination } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SettingsDestination {
    section?: "options";
    tab: string;
    nestedTab?: string;
    pluginName?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `section` | `"options"` | Optional |  |
| `tab` | `string` | Required |  |
| `nestedTab` | `string` | Optional |  |
| `pluginName` | `string` | Optional |  |
