---
title: "TooltipTriggerProps"
summary: "Props accepted by a tooltip trigger."
---

## Import

```ts
import type { TooltipTriggerProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TooltipTriggerProps extends HostComponentProps {
    /** Render through the host's slot component. */
    asChild?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | Optional | Render through the host's slot component. |
