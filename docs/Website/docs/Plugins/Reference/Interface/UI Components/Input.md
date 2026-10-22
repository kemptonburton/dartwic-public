---
title: Input
summary: Input using the host's text and native input fields presentation.
created: 2026-08-04T17:38
updated: 2026-10-20T18:59
---

## Import

```ts
import { Input } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Input: HostComponent<InputProps>;
```

## InputProps

Props accepted by the standard host input.

```ts
export interface InputProps extends HostComponentProps {
    /** Controlled input value. */
    value?: string | number;
    /** Initial uncontrolled value. */
    defaultValue?: string | number;
    /** Change event handler. */
    onChange?: HostEventHandler;
    /** Placeholder text shown while empty. */
    placeholder?: string;
    /** Native input type. */
    type?: string;
    /** Disables interaction. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string \| number` | Optional | Controlled input value. |
| `defaultValue` | `string \| number` | Optional | Initial uncontrolled value. |
| `onChange` | `HostEventHandler` | Optional | Change event handler. |
| `placeholder` | `string` | Optional | Placeholder text shown while empty. |
| `type` | `string` | Optional | Native input type. |
| `disabled` | `boolean` | Optional | Disables interaction. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
