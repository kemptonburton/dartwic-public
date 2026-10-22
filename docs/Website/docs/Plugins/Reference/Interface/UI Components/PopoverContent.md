---
title: "PopoverContent"
summary: "Popover Content using the host's anchored content presentation."
---

## Import

```ts
import { PopoverContent } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const PopoverContent: HostComponent<PopoverContentProps>;
```

## PopoverContentProps

Positioning for anchored popover content.

```ts
export interface PopoverContentProps extends HostComponentProps {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | Optional |  |
| `align` | `"start" \| "center" \| "end"` | Optional |  |
| `sideOffset` | `number` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
