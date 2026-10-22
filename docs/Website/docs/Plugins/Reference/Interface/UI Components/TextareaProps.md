---
title: "TextareaProps"
summary: "Controlled multiline text field."
---

## Import

```ts
import type { TextareaProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TextareaProps extends HostComponentProps {
    value?: string;
    defaultValue?: string;
    onChange?: HostEventHandler;
    placeholder?: string;
    disabled?: boolean;
    rows?: number;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `defaultValue` | `string` | Optional |  |
| `onChange` | `HostEventHandler` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `rows` | `number` | Optional |  |
