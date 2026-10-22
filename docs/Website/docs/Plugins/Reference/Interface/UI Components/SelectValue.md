---
title: SelectValue
summary: Select Value using the host's single-choice fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { SelectValue } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const SelectValue: HostComponent<SelectValueProps>;
```

## SelectValueProps

Props accepted by the selected-value display.

```ts
export interface SelectValueProps extends HostComponentProps {
    /** Content shown while no value is selected. */
    placeholder?: HostNode;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `placeholder` | `HostNode` | Optional | Content shown while no value is selected. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
