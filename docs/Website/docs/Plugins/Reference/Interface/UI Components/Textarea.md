---
title: Textarea
summary: Textarea using the host's multiline input presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { Textarea } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const Textarea: HostComponent<TextareaProps>;
```

## TextareaProps

Controlled multiline text field.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Optional |  |
| `defaultValue` | `string` | Optional |  |
| `onChange` | `HostEventHandler` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `rows` | `number` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
