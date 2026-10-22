---
title: "ColorPickerProps"
summary: "Theme-aware host color selector."
---

## Import

```ts
import type { ColorPickerProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ColorPickerProps extends HostComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
    ariaLabel?: string;
    disabled?: boolean;
    variant?: "swatch" | "field";
    allowThemeColors?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `onValueChange` | `(value: string) => void` | Optional |  |
| `ariaLabel` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `variant` | `"swatch" \| "field"` | Optional |  |
| `allowThemeColors` | `boolean` | Optional |  |
