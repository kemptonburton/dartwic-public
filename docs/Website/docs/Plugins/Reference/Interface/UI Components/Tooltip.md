---
title: Tooltip
summary: Tooltip using the host's short contextual help presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Tooltip } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Tooltip: HostComponent<TooltipProps>;
```

## TooltipProps

Props accepted by the tooltip root.

```ts
export interface TooltipProps extends HostComponentProps {
    /** Delay before opening, in milliseconds. */
    delayDuration?: number;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `delayDuration` | `number` | Optional | Delay before opening, in milliseconds. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
