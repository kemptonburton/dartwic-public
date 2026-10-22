---
title: "CommandInputProps"
summary: "Search field inside a host command menu."
---

## Import

```ts
import type { CommandInputProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface CommandInputProps extends HostComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `onValueChange` | `(value: string) => void` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
