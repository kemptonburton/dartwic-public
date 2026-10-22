---
title: TooltipTrigger
summary: Tooltip Trigger using the host's short contextual help presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { TooltipTrigger } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const TooltipTrigger: HostComponent<TooltipTriggerProps>;
```

## TooltipTriggerProps

Props accepted by a tooltip trigger.

```ts
export interface TooltipTriggerProps extends HostComponentProps {
    /** Render through the host's slot component. */
    asChild?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | Optional | Render through the host's slot component. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
