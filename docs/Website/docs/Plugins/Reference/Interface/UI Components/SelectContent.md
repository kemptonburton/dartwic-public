---
title: SelectContent
summary: Select Content using the host's single-choice fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { SelectContent } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const SelectContent: HostComponent<SelectContentProps>;
```

## SelectContentProps

Props accepted by select popup content.

```ts
export interface SelectContentProps extends HostComponentProps {
    /** Popup positioning strategy. */
    position?: "popper" | "item-aligned" | string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `position` | `"popper" \| "item-aligned" \| string` | Optional | Popup positioning strategy. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
