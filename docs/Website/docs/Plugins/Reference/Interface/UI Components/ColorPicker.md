---
title: "ColorPicker"
summary: "Color Picker using the host's theme-aware color selection presentation."
---

## Import

```ts
import { ColorPicker } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ColorPicker: HostComponent<ColorPickerProps>;
```

## ColorPickerProps

Theme-aware host color selector.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `onValueChange` | `(value: string) => void` | Optional |  |
| `ariaLabel` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `variant` | `"swatch" \| "field"` | Optional |  |
| `allowThemeColors` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
