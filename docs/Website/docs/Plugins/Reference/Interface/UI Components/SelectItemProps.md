---
title: "SelectItemProps"
summary: "Props accepted by a selectable item."
---

## Import

```ts
import type { SelectItemProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SelectItemProps extends HostComponentProps {
    /** Value produced when this item is selected. */
    value: string;
    /** Disables this item. */
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Value produced when this item is selected. |
| `disabled` | `boolean` | Optional | Disables this item. |
