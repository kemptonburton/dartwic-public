---
title: ManualRefreshButton
summary: Renders the standard refresh icon button with an in-progress state.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { ManualRefreshButton } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ManualRefreshButton: HostComponent<ManualRefreshButtonProps>;
```

## ManualRefreshButtonProps

Props for the standard refresh icon button.

```ts
export interface ManualRefreshButtonProps extends ButtonProps {
    /** Tooltip and accessible label. */
    tooltip?: string;
    /** Shows the spinning refresh state and disables the button. */
    isRefreshing?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `tooltip` | `string` | Optional | Tooltip and accessible label. |
| `isRefreshing` | `boolean` | Optional | Shows the spinning refresh state and disables the button. |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | Optional | Visual style preset. |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | Optional | Size preset. |
| `asChild` | `boolean` | Optional | Render through the host's slot component. |
| `onClick` | `HostEventHandler` | Optional | Click event handler. |
| `disabled` | `boolean` | Optional | Disables interaction. |
| `type` | `"button" \| "submit" \| "reset" \| string` | Optional | Native button type. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
