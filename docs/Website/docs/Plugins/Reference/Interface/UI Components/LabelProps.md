---
title: "LabelProps"
summary: "Props accepted by a form label."
---

## Import

```ts
import type { LabelProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface LabelProps extends HostComponentProps {
    /** Identifier of the labeled form control. */
    htmlFor?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `htmlFor` | `string` | Optional | Identifier of the labeled form control. |
