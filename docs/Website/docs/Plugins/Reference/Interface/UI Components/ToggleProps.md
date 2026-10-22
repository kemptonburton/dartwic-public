---
title: "ToggleProps"
summary: "Pressed-state toggle button."
---

## Import

```ts
import type { ToggleProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `pressed` | `boolean` | Optional |  |
| `defaultPressed` | `boolean` | Optional |  |
| `onPressedChange` | `(pressed: boolean) => void` | Optional |  |
| `variant` | `"default" \| "outline"` | Optional |  |
| `size` | `"default" \| "sm" \| "lg"` | Optional |  |
| `disabled` | `boolean` | Optional |  |
