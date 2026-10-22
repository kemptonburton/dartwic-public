---
title: "ComboboxSearchProps"
summary: "Props for the standard host-owned searchable list selector."
---

## Import

```ts
import type { ComboboxSearchProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ComboboxSearchProps extends HostComponentProps {
    items: ComboboxSearchItem[];
    initialValue?: string;
    placeholder?: string;
    commandSearchPlaceholder?: string;
    commandSearchEmptyPlaceholder?: string;
    overrideValue?: HostNode;
    onSelect?: (value: string) => void;
    unSelectable?: boolean;
    popoverContentClassName?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `items` | `ComboboxSearchItem[]` | Required |  |
| `initialValue` | `string` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `commandSearchPlaceholder` | `string` | Optional |  |
| `commandSearchEmptyPlaceholder` | `string` | Optional |  |
| `overrideValue` | `HostNode` | Optional |  |
| `onSelect` | `(value: string) => void` | Optional |  |
| `unSelectable` | `boolean` | Optional |  |
| `popoverContentClassName` | `string` | Optional |  |
