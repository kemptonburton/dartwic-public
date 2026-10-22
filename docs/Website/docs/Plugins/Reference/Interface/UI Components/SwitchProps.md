---
title: "SwitchProps"
summary: "Props accepted by the host switch."
---

## Import

```ts
import type { SwitchProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SwitchProps extends HostComponentProps {
    /** Controlled checked state. */
    checked?: boolean;
    /** Initial uncontrolled checked state. */
    defaultChecked?: boolean;
    /** Called when the checked state changes. */
    onCheckedChange?: (checked: boolean) => void;
    /** Disables interaction. */
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | Optional | Controlled checked state. |
| `defaultChecked` | `boolean` | Optional | Initial uncontrolled checked state. |
| `onCheckedChange` | `(checked: boolean) => void` | Optional | Called when the checked state changes. |
| `disabled` | `boolean` | Optional | Disables interaction. |
