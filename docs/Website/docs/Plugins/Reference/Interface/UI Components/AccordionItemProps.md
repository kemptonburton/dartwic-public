---
title: "AccordionItemProps"
summary: "Value identifying an accordion section."
---

## Import

```ts
import type { AccordionItemProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface AccordionItemProps extends HostComponentProps {
    value: string;
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required |  |
| `disabled` | `boolean` | Optional |  |
