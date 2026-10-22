---
title: "SelectProps"
summary: "Props accepted by the select root."
---

## Import

```ts
import type { SelectProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SelectProps extends HostComponentProps {
    /** Controlled selected value. */
    value?: string;
    /** Initial uncontrolled selected value. */
    defaultValue?: string;
    /** Called with the newly selected value. */
    onValueChange?: (value: string) => void;
    /** Disables selection. */
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional | Controlled selected value. |
| `defaultValue` | `string` | Optional | Initial uncontrolled selected value. |
| `onValueChange` | `(value: string) => void` | Optional | Called with the newly selected value. |
| `disabled` | `boolean` | Optional | Disables selection. |
