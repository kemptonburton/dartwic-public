---
title: Checkbox
summary: Checkbox using the host's boolean fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Checkbox } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Checkbox: HostComponent<CheckboxProps>;
```

## CheckboxProps

Props accepted by the host checkbox.

```ts
export interface CheckboxProps extends HostComponentProps {
    /** Controlled checked state. */
    checked?: boolean | "indeterminate";
    /** Initial uncontrolled checked state. */
    defaultChecked?: boolean;
    /** Called when the checked state changes. */
    onCheckedChange?: (checked: boolean | "indeterminate") => void;
    /** Disables interaction. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| "indeterminate"` | Optional | Controlled checked state. |
| `defaultChecked` | `boolean` | Optional | Initial uncontrolled checked state. |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | Optional | Called when the checked state changes. |
| `disabled` | `boolean` | Optional | Disables interaction. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
