---
title: "ScrollBarProps"
summary: "Props accepted by a scroll bar."
---

## Import

```ts
import type { ScrollBarProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ScrollBarProps extends HostComponentProps {
    /** Scroll-bar direction. */
    orientation?: "horizontal" | "vertical";
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | Optional | Scroll-bar direction. |
