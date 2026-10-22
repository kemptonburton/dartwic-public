---
title: TabsContent
summary: Tabs Content using the host's tabbed content presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { TabsContent } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const TabsContent: HostComponent<TabsContentProps>;
```

## TabsContentProps

Props accepted by a tab content panel.

```ts
export interface TabsContentProps extends HostComponentProps {
    /** Tab value that displays this panel. */
    value: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Tab value that displays this panel. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
