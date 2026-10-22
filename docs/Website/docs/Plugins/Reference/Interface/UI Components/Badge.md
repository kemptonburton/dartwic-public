---
title: Badge
summary: Badge using the host's compact status labels presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { Badge } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Badge: HostComponent<BadgeProps>;
```

## BadgeProps

Compact host status label.

```ts
export interface BadgeProps extends HostComponentProps {
    asChild?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
