---
title: "SliderProps"
summary: "Numeric range control; values are arrays even for a single thumb."
---

## Import

```ts
import type { SliderProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `number[]` | Optional |  |
| `defaultValue` | `number[]` | Optional |  |
| `onValueChange` | `(value: number[]) => void` | Optional |  |
| `onValueCommit` | `(value: number[]) => void` | Optional |  |
| `min` | `number` | Optional |  |
| `max` | `number` | Optional |  |
| `step` | `number` | Optional |  |
| `disabled` | `boolean` | Optional |  |
