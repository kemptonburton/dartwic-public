---
title: "SeparatorProps"
summary: "Props accepted by a visual separator."
---

## Import

```ts
import type { SeparatorProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SeparatorProps extends HostComponentProps {
    /** Separator direction. */
    orientation?: "horizontal" | "vertical";
    /** Whether the separator is purely decorative. */
    decorative?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | Optional | Separator direction. |
| `decorative` | `boolean` | Optional | Whether the separator is purely decorative. |
