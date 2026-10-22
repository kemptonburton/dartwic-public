---
title: "ComboboxSearchItem"
summary: "One searchable option displayed by the host-owned combobox."
---

## Import

```ts
import type { ComboboxSearchItem } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ComboboxSearchItem {
    value: string;
    label: HostNode;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required |  |
| `label` | `HostNode` | Required |  |
