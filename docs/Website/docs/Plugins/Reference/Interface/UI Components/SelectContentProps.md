---
title: "SelectContentProps"
summary: "Props accepted by select popup content."
---

## Import

```ts
import type { SelectContentProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SelectContentProps extends HostComponentProps {
    /** Popup positioning strategy. */
    position?: "popper" | "item-aligned" | string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `position` | `"popper" \| "item-aligned" \| string` | Optional | Popup positioning strategy. |
