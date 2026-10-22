---
title: IfElseBlock
summary: Edit conditional branch configuration with the host component.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { IfElseBlock } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const IfElseBlock: HostComponent<IfElseBlockProps>;
```

## IfElseBlockProps

Edits a conditional configuration block.

```ts
export interface IfElseBlockProps extends HostComponentProps {
    initialData: Record<string, unknown>;
    onDataChange: (data: Record<string, unknown>) => void;
    compact?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `initialData` | `Record<string, unknown>` | Required |  |
| `onDataChange` | `(data: Record<string, unknown>) => void` | Required |  |
| `compact` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
