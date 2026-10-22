---
title: "InterfaceContributions"
summary: "Contributions grouped by supported interface extension point."
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
| `settingsPanels` | `InterfaceContributionEntry[]` | Required |  |
| `popupUis` | `InterfaceContributionEntry[]` | Required |  |
