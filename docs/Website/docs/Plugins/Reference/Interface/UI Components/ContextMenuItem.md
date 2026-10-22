---
title: ContextMenuItem
summary: Context Menu Item using the host's context actions presentation.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ContextMenuItem } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ContextMenuItem: HostComponent<MenuItemProps>;
```

## MenuItemProps

Selectable dropdown or context menu action.

```ts
export interface MenuItemProps extends HostComponentProps {
    disabled?: boolean;
    inset?: boolean;
    onSelect?: HostEventHandler;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | Optional |  |
| `inset` | `boolean` | Optional |  |
| `onSelect` | `HostEventHandler` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
