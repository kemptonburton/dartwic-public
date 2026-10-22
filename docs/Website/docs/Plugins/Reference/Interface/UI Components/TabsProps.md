---
title: "TabsProps"
summary: "Props accepted by the tabs root."
---

## Import

```ts
import type { TabsProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TabsProps extends HostComponentProps {
    /** Controlled active tab value. */
    value?: string;
    /** Initial uncontrolled tab value. */
    defaultValue?: string;
    /** Called when the active tab changes. */
    onValueChange?: (value: string) => void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional | Controlled active tab value. |
| `defaultValue` | `string` | Optional | Initial uncontrolled tab value. |
| `onValueChange` | `(value: string) => void` | Optional | Called when the active tab changes. |
