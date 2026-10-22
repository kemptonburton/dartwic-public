---
title: FormattedValueControlProps
summary: Click-to-edit numeric value with a host popover.
created: 2026-10-11T21:36
updated: 2026-10-20T18:59
---

## Import

```ts
import type { FormattedValueControlProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface FormattedValueControlProps extends HostComponentProps {
    value: number;
    units?: string;
    label?: string;
    submitLabel?: string;
    disabled?: boolean;
    onCommit: (value: number) => unknown;
    variant?: "default" | "outline" | "ghost" | "link" | "secondary" | "destructive";
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
| `variant` | `"default" \| "outline" \| "ghost" \| "link" \| "secondary" \| "destructive"` | Optional |  |
