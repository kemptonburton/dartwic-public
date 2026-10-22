---
title: "CheckboxProps"
summary: "Props accepted by the host checkbox."
---

## Import

```ts
import type { CheckboxProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `checked` | `boolean \| "indeterminate"` | Optional | Controlled checked state. |
| `defaultChecked` | `boolean` | Optional | Initial uncontrolled checked state. |
| `onCheckedChange` | `(checked: boolean \| "indeterminate") => void` | Optional | Called when the checked state changes. |
| `disabled` | `boolean` | Optional | Disables interaction. |
