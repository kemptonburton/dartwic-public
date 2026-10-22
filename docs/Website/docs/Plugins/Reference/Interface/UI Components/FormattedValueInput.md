---
title: FormattedValueInput
summary: Formatted Value Input using the host's formatted numeric editing presentation.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

## Import

```ts
import { FormattedValueInput } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const FormattedValueInput: HostComponent<FormattedValueInputProps>;
```

## FormattedValueInputProps

Numeric value editor selected by a Units formatting directive.

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

| Prop | Type | Requirement | Description |
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
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
