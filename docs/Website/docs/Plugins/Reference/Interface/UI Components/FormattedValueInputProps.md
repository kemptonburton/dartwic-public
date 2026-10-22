---
title: FormattedValueInputProps
summary: Numeric value editor selected by a Units formatting directive.
created: 2026-10-11T21:36
updated: 2026-10-20T18:59
---

## Import

```ts
import type { FormattedValueInputProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface FormattedValueInputProps extends HostComponentProps {
    value: number;
    units?: string;
    label?: string;
    submitLabel?: string;
    disabled?: boolean;
    onCommit: (value: number) => unknown;
    onCancel?: () => void;
    trailingAction?: HostNode;
    compact?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `number` | Required |  |
| `units` | `string` | Optional |  |
| `label` | `string` | Optional |  |
| `submitLabel` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `onCommit` | `(value: number) => unknown` | Required |  |
| `onCancel` | `() => void` | Optional |  |
| `trailingAction` | `HostNode` | Optional |  |
| `compact` | `boolean` | Optional |  |
