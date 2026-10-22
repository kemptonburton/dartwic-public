---
title: "SelectValueProps"
summary: "Props accepted by the selected-value display."
---

## Import

```ts
import type { SelectValueProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface SelectValueProps extends HostComponentProps {
    /** Content shown while no value is selected. */
    placeholder?: HostNode;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `placeholder` | `HostNode` | Optional | Content shown while no value is selected. |
