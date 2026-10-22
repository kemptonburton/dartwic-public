---
title: "ManualRefreshButtonProps"
summary: "Props for the standard refresh icon button."
---

## Import

```ts
import type { ManualRefreshButtonProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ManualRefreshButtonProps extends ButtonProps {
    /** Tooltip and accessible label. */
    tooltip?: string;
    /** Shows the spinning refresh state and disables the button. */
    isRefreshing?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `tooltip` | `string` | Optional | Tooltip and accessible label. |
| `isRefreshing` | `boolean` | Optional | Shows the spinning refresh state and disables the button. |
