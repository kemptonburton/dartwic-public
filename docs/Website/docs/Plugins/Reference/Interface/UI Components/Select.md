---
title: Select
summary: Select using the host's single-choice fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Select } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Select: HostComponent<SelectProps>;
```

## SelectProps

Props accepted by the select root.

```ts
export interface SelectProps extends HostComponentProps {
    /** Controlled selected value. */
    value?: string;
    /** Initial uncontrolled selected value. */
    defaultValue?: string;
    /** Called with the newly selected value. */
    onValueChange?: (value: string) => void;
    /** Disables selection. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional | Controlled selected value. |
| `defaultValue` | `string` | Optional | Initial uncontrolled selected value. |
| `onValueChange` | `(value: string) => void` | Optional | Called with the newly selected value. |
| `disabled` | `boolean` | Optional | Disables selection. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
