---
title: InterfaceContributions
summary: Contributions grouped by supported interface extension point.
created: 2026-08-04T17:38
updated: 2026-11-13T00:56
---

## Import

```ts
import type { InterfaceContributions } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface InterfaceContributions {
    valueFormats: InterfaceContributionEntry[];
    taskUis: InterfaceContributionEntry[];
    moduleUis: InterfaceContributionEntry[];
    resources: InterfaceContributionEntry[];
    schematicNodes: InterfaceContributionEntry[];
    schematicNodePresets?: InterfaceContributionEntry[];
    settingsPanels: InterfaceContributionEntry[];
    popupUis: InterfaceContributionEntry[];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `valueFormats` | `InterfaceContributionEntry[]` | Required |  |
| `taskUis` | `InterfaceContributionEntry[]` | Required |  |
| `moduleUis` | `InterfaceContributionEntry[]` | Required |  |
| `resources` | `InterfaceContributionEntry[]` | Required |  |
| `schematicNodes` | `InterfaceContributionEntry[]` | Required |  |
| `schematicNodePresets` | `InterfaceContributionEntry[]` | Optional |  |
| `settingsPanels` | `InterfaceContributionEntry[]` | Required |  |
| `popupUis` | `InterfaceContributionEntry[]` | Required |  |
