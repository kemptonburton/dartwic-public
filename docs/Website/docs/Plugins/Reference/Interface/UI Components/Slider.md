---
title: Slider
summary: Slider using the host's numeric ranges presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { Slider } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Slider: HostComponent<SliderProps>;
```

## SliderProps

Numeric range control; values are arrays even for a single thumb.

```ts
export interface SliderProps extends HostComponentProps {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    onValueCommit?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `number[]` | Optional |  |
| `defaultValue` | `number[]` | Optional |  |
| `onValueChange` | `(value: number[]) => void` | Optional |  |
| `onValueCommit` | `(value: number[]) => void` | Optional |  |
| `min` | `number` | Optional |  |
| `max` | `number` | Optional |  |
| `step` | `number` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
