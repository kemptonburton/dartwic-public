---
title: Label
summary: Label using the host's form labels presentation.
created: 2026-08-04T17:38
updated: 2026-10-20T18:59
---

## Import

```ts
import { Label } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Label: HostComponent<LabelProps>;
```

## LabelProps

Props accepted by a form label.

```ts
export interface LabelProps extends HostComponentProps {
    /** Identifier of the labeled form control. */
    htmlFor?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | Optional | Identifier of the labeled form control. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
