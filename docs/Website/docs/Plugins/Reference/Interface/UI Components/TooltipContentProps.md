---
title: "TooltipContentProps"
summary: "Props accepted by tooltip popup content."
---

## Import

```ts
import type { TooltipContentProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TooltipContentProps extends HostComponentProps {
    /** Preferred side of the trigger. */
    side?: "top" | "right" | "bottom" | "left";
    /** Distance from the trigger in pixels. */
    sideOffset?: number;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | Optional | Preferred side of the trigger. |
| `sideOffset` | `number` | Optional | Distance from the trigger in pixels. |
