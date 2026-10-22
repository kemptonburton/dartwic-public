---
title: AccordionItem
summary: Accordion Item using the host's expandable sections presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { AccordionItem } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const AccordionItem: HostComponent<AccordionItemProps>;
```

## AccordionItemProps

Value identifying an accordion section.

```ts
export interface AccordionItemProps extends HostComponentProps {
    value: string;
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required |  |
| `disabled` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
