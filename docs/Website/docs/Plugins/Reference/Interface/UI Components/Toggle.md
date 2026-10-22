---
title: Toggle
summary: Toggle using the host's pressed-state actions presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { Toggle } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Toggle: HostComponent<ToggleProps>;
```

## ToggleProps

Pressed-state toggle button.

```ts
export interface ToggleProps extends HostComponentProps {
    pressed?: boolean;
    defaultPressed?: boolean;
    onPressedChange?: (pressed: boolean) => void;
    variant?: "default" | "outline";
    size?: "default" | "sm" | "lg";
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | Optional |  |
| `defaultPressed` | `boolean` | Optional |  |
| `onPressedChange` | `(pressed: boolean) => void` | Optional |  |
| `variant` | `"default" \| "outline"` | Optional |  |
| `size` | `"default" \| "sm" \| "lg"` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
