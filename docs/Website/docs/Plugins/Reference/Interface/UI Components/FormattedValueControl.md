---
title: FormattedValueControl
summary: Formatted Value Control using the host's formatted numeric editing presentation.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

## Import

```ts
import { FormattedValueControl } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const FormattedValueControl: HostComponent<FormattedValueControlProps>;
```

## FormattedValueControlProps

Click-to-edit numeric value with a host popover.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `number` | Required |  |
| `units` | `string` | Optional |  |
| `label` | `string` | Optional |  |
| `submitLabel` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `onCommit` | `(value: number) => unknown` | Required |  |
| `variant` | `"default" \| "outline" \| "ghost" \| "link" \| "secondary" \| "destructive"` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
