---
title: "DropdownMenu"
summary: "Dropdown Menu using the host's action menus presentation."
---

## Import

```ts
import { DropdownMenu } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const DropdownMenu: HostComponent<MenuRootProps>;
```

## MenuRootProps

Controlled state for a dropdown menu.

```ts
export interface MenuRootProps extends HostComponentProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | Optional |  |
| `defaultOpen` | `boolean` | Optional |  |
| `onOpenChange` | `(open: boolean) => void` | Optional |  |
| `modal` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
