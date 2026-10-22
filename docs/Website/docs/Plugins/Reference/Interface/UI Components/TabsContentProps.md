---
title: "TabsContentProps"
summary: "Props accepted by a tab content panel."
---

## Import

```ts
import type { TabsContentProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TabsContentProps extends HostComponentProps {
    /** Tab value that displays this panel. */
    value: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required | Tab value that displays this panel. |
