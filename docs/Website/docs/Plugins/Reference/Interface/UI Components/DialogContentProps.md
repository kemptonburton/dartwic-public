---
title: "DialogContentProps"
summary: "Styled dialog body."
---

## Import

```ts
import type { DialogContentProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface DialogContentProps extends HostComponentProps {
    /** Hide the built-in close button when the workflow supplies its own. */
    hideClose?: boolean;
    /** Classes for the built-in close button. */
    closeClassName?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `hideClose` | `boolean` | Optional | Hide the built-in close button when the workflow supplies its own. |
| `closeClassName` | `string` | Optional | Classes for the built-in close button. |
