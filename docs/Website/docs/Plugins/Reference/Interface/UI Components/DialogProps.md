---
title: "DialogProps"
summary: "Open state for a host dialog."
---

## Import

```ts
import type { DialogProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface DialogProps extends HostComponentProps {
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
