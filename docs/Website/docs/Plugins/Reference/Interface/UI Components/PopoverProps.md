---
title: "PopoverProps"
summary: "Open state for an anchored host popover."
---

## Import

```ts
import type { PopoverProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface PopoverProps extends HostComponentProps {
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
