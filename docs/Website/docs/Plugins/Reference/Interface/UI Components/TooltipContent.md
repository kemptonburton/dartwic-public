---
title: TooltipContent
summary: Tooltip Content using the host's short contextual help presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { TooltipContent } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const TooltipContent: HostComponent<TooltipContentProps>;
```

## TooltipContentProps

Props accepted by tooltip popup content.

```ts
export interface TooltipContentProps extends HostComponentProps {
    /** Preferred side of the trigger. */
    side?: "top" | "right" | "bottom" | "left";
    /** Distance from the trigger in pixels. */
    sideOffset?: number;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `side` | `"top" \| "right" \| "bottom" \| "left"` | Optional | Preferred side of the trigger. |
| `sideOffset` | `number` | Optional | Distance from the trigger in pixels. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
