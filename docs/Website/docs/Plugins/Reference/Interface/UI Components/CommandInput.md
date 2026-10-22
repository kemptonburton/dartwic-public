---
title: "CommandInput"
summary: "Command Input using the host's searchable commands and choices presentation."
---

## Import

```ts
import { CommandInput } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const CommandInput: HostComponent<CommandInputProps>;
```

## CommandInputProps

Search field inside a host command menu.

```ts
export interface CommandInputProps extends HostComponentProps {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `onValueChange` | `(value: string) => void` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
