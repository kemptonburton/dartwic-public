---
title: CommandGroup
summary: Command Group using the host's searchable commands and choices presentation.
created: 2026-10-11T21:36
updated: 2026-10-11T21:44
---

## Import

```ts
import { CommandGroup } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const CommandGroup: HostComponent<HostComponentProps>;
```

## HostComponentProps

Shared presentation and native pass-through props accepted by host components.

```ts
export interface HostComponentProps {
    /** Additional Tailwind or host CSS classes. */
    className?: string;
    /** Child content rendered by the host component. */
    children?: HostNode;
    /** Optional DOM identifier. */
    id?: string;
    /** Inline style values passed to the host component. */
    style?: Record<string, unknown>;
    [name: string]: unknown;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
