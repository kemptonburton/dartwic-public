---
title: "ButtonProps"
summary: "Props accepted by the standard host button."
---

## Import

```ts
import type { ButtonProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ButtonProps extends HostComponentProps {
    /** Visual style preset. */
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
    /** Size preset. */
    size?: "default" | "sm" | "lg" | "icon";
    /** Render through the host's slot component. */
    asChild?: boolean;
    /** Click event handler. */
    onClick?: HostEventHandler;
    /** Disables interaction. */
    disabled?: boolean;
    /** Native button type. */
    type?: "button" | "submit" | "reset" | string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "destructive" \| "outline" \| "secondary" \| "ghost" \| "link"` | Optional | Visual style preset. |
| `size` | `"default" \| "sm" \| "lg" \| "icon"` | Optional | Size preset. |
| `asChild` | `boolean` | Optional | Render through the host's slot component. |
| `onClick` | `HostEventHandler` | Optional | Click event handler. |
| `disabled` | `boolean` | Optional | Disables interaction. |
| `type` | `"button" \| "submit" \| "reset" \| string` | Optional | Native button type. |
