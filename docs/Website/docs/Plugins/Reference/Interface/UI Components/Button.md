---
title: Button
summary: Button using the host's actions presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Button } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Button: HostComponent<ButtonProps>;
```

## ButtonProps

Props accepted by the standard host button.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
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
