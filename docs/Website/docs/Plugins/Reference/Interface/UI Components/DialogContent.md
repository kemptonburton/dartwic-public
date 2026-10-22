---
title: "DialogContent"
summary: "Dialog Content using the host's modal workflows presentation."
---

## Import

```ts
import { DialogContent } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const DialogContent: HostComponent<DialogContentProps>;
```

## DialogContentProps

Styled dialog body.

```ts
export interface DialogContentProps extends HostComponentProps {
    /** Hide the built-in close button when the workflow supplies its own. */
    hideClose?: boolean;
    /** Classes for the built-in close button. */
    closeClassName?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `hideClose` | `boolean` | Optional | Hide the built-in close button when the workflow supplies its own. |
| `closeClassName` | `string` | Optional | Classes for the built-in close button. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
