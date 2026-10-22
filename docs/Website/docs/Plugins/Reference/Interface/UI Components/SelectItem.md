---
title: SelectItem
summary: Select Item using the host's single-choice fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { SelectItem } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const SelectItem: HostComponent<SelectItemProps>;
```

## SelectItemProps

Props accepted by a selectable item.

```ts
export interface SelectItemProps extends HostComponentProps {
    /** Value produced when this item is selected. */
    value: string;
    /** Disables this item. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Value produced when this item is selected. |
| `disabled` | `boolean` | Optional | Disables this item. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
