---
title: "Dialog"
summary: "Dialog using the host's modal workflows presentation."
---

## Import

```ts
import { Dialog } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Dialog: HostComponent<DialogProps>;
```

## DialogProps

Open state for a host dialog.

```ts
export interface DialogProps extends HostComponentProps {
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
