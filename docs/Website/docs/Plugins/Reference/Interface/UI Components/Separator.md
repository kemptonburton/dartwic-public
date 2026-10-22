---
title: Separator
summary: Separator using the host's visual divisions presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Separator } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Separator: HostComponent<SeparatorProps>;
```

## SeparatorProps

Props accepted by a visual separator.

```ts
export interface SeparatorProps extends HostComponentProps {
    /** Separator direction. */
    orientation?: "horizontal" | "vertical";
    /** Whether the separator is purely decorative. */
    decorative?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `orientation` | `"horizontal" \| "vertical"` | Optional | Separator direction. |
| `decorative` | `boolean` | Optional | Whether the separator is purely decorative. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
