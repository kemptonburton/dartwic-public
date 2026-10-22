---
title: "MenuRootProps"
summary: "Controlled state for a dropdown menu."
---

## Import

```ts
import type { MenuRootProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface MenuRootProps extends HostComponentProps {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | Optional |  |
| `defaultOpen` | `boolean` | Optional |  |
| `onOpenChange` | `(open: boolean) => void` | Optional |  |
| `modal` | `boolean` | Optional |  |
