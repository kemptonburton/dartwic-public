---
title: "TabsTriggerProps"
summary: "Props accepted by a tab trigger."
---

## Import

```ts
import type { TabsTriggerProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TabsTriggerProps extends HostComponentProps {
    /** Tab value activated by the trigger. */
    value: string;
    /** Disables the trigger. */
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Tab value activated by the trigger. |
| `disabled` | `boolean` | Optional | Disables the trigger. |
