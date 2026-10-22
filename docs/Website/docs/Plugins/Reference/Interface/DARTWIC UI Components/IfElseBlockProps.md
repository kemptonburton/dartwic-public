---
title: "IfElseBlockProps"
summary: "Edits a conditional configuration block."
---

## Import

```ts
import type { IfElseBlockProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface IfElseBlockProps extends HostComponentProps {
    initialData: Record<string, unknown>;
    onDataChange: (data: Record<string, unknown>) => void;
    compact?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `initialData` | `Record<string, unknown>` | Required |  |
| `onDataChange` | `(data: Record<string, unknown>) => void` | Required |  |
| `compact` | `boolean` | Optional |  |
