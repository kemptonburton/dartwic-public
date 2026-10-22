---
title: ScrollBar
summary: Scroll Bar using the host's styled scrolling presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { ScrollBar } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ScrollBar: HostComponent<ScrollBarProps>;
```

## ScrollBarProps

Props accepted by a scroll bar.

```ts
export interface ScrollBarProps extends HostComponentProps {
    /** Scroll-bar direction. */
    orientation?: "horizontal" | "vertical";
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | Optional | Scroll-bar direction. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
