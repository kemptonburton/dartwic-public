---
title: TabsTrigger
summary: Tabs Trigger using the host's tabbed content presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { TabsTrigger } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const TabsTrigger: HostComponent<TabsTriggerProps>;
```

## TabsTriggerProps

Props accepted by a tab trigger.

```ts
export interface TabsTriggerProps extends HostComponentProps {
    /** Tab value activated by the trigger. */
    value: string;
    /** Disables the trigger. */
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Tab value activated by the trigger. |
| `disabled` | `boolean` | Optional | Disables the trigger. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
