---
title: "MenuItemProps"
summary: "Selectable dropdown or context menu action."
---

## Import

```ts
import type { MenuItemProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface MenuItemProps extends HostComponentProps {
    disabled?: boolean;
    inset?: boolean;
    onSelect?: HostEventHandler;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | Optional |  |
| `inset` | `boolean` | Optional |  |
| `onSelect` | `HostEventHandler` | Optional |  |
