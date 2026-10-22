---
title: "MarkdownSelection"
summary: "Document selection offsets used for editing and participant presence."
---

## Import

```ts
import type { MarkdownSelection } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownSelection {
    from: number;
    to: number;
    anchor?: number;
    head?: number;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `from` | `number` | Required |  |
| `to` | `number` | Required |  |
| `anchor` | `number` | Optional |  |
| `head` | `number` | Optional |  |
