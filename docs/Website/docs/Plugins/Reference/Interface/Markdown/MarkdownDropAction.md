---
title: "MarkdownDropAction"
summary: "Labeled action offered when a channel is dropped into Markdown."
---

## Import

```ts
import type { MarkdownDropAction } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownDropAction {
    id: string;
    label: string;
    icon?: HostNode;
    onSelect(): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `label` | `string` | Required |  |
| `icon` | `HostNode` | Optional |  |
| `onSelect` | `void` | Required |  |
