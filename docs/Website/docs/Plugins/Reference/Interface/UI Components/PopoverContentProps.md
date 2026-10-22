---
title: "PopoverContentProps"
summary: "Positioning for anchored popover content."
---

## Import

```ts
import type { PopoverContentProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface PopoverContentProps extends HostComponentProps {
    side?: "top" | "right" | "bottom" | "left";
    align?: "start" | "center" | "end";
    sideOffset?: number;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | Optional |  |
| `align` | `"start" \| "center" \| "end"` | Optional |  |
| `sideOffset` | `number` | Optional |  |
