---
title: ComboboxSearch
summary: Searches a fixed option list using DARTWIC's standard host-owned combobox.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ComboboxSearch } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ComboboxSearch: HostComponent<ComboboxSearchProps>;
```

## ComboboxSearchProps

Props for the standard host-owned searchable list selector.

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

| Prop | Type | Requirement | Description |
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
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
