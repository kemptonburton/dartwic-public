---
title: "DialogTrigger"
summary: "Dialog Trigger using the host's modal workflows presentation."
---

## Import

```ts
import { DialogTrigger } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const DialogTrigger: HostComponent<AsChildTriggerProps>;
```

## AsChildTriggerProps

Trigger rendered through its child control when `asChild` is true.

```ts
export interface AsChildTriggerProps extends HostComponentProps {
    asChild?: boolean;
    disabled?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `asChild` | `boolean` | Optional |  |
| `disabled` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
