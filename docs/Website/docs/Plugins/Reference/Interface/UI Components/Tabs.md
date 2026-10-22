---
title: Tabs
summary: Tabs using the host's tabbed content presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { Tabs } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Tabs: HostComponent<TabsProps>;
```

## TabsProps

Props accepted by the tabs root.

```ts
export interface TabsProps extends HostComponentProps {
    /** Controlled active tab value. */
    value?: string;
    /** Initial uncontrolled tab value. */
    defaultValue?: string;
    /** Called when the active tab changes. */
    onValueChange?: (value: string) => void;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional | Controlled active tab value. |
| `defaultValue` | `string` | Optional | Initial uncontrolled tab value. |
| `onValueChange` | `(value: string) => void` | Optional | Called when the active tab changes. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
