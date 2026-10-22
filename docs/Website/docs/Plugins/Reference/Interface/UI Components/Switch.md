---
title: Switch
summary: Switch using the host's boolean settings presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Switch } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Switch: HostComponent<SwitchProps>;
```

## SwitchProps

Props accepted by the host switch.

```ts
export interface SwitchProps extends HostComponentProps {
    /** Controlled checked state. */
    checked?: boolean;
    /** Initial uncontrolled checked state. */
    defaultChecked?: boolean;
    /** Called when the checked state changes. */
    onCheckedChange?: (checked: boolean) => void;
    /** Disables interaction. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `checked` | `boolean` | Optional | Controlled checked state. |
| `defaultChecked` | `boolean` | Optional | Initial uncontrolled checked state. |
| `onCheckedChange` | `(checked: boolean) => void` | Optional | Called when the checked state changes. |
| `disabled` | `boolean` | Optional | Disables interaction. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
