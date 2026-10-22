---
title: "InputProps"
summary: "Props accepted by the standard host input."
---

## Import

```ts
import type { InputProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface InputProps extends HostComponentProps {
    /** Controlled input value. */
    value?: string | number;
    /** Initial uncontrolled value. */
    defaultValue?: string | number;
    /** Change event handler. */
    onChange?: HostEventHandler;
    /** Placeholder text shown while empty. */
    placeholder?: string;
    /** Native input type. */
    type?: string;
    /** Disables interaction. */
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | Optional | Controlled input value. |
| `defaultValue` | `string \| number` | Optional | Initial uncontrolled value. |
| `onChange` | `HostEventHandler` | Optional | Change event handler. |
| `placeholder` | `string` | Optional | Placeholder text shown while empty. |
| `type` | `string` | Optional | Native input type. |
| `disabled` | `boolean` | Optional | Disables interaction. |
