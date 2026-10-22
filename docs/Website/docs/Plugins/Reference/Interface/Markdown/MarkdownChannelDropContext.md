---
title: MarkdownChannelDropContext
summary: Dropped channel, pointer position, and callback for inserting Markdown.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import type { MarkdownChannelDropContext } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownChannelDropContext {
    channelName: string;
    clientPosition?: {x: number; y: number};
    insertMarkdown(markdown: string): void;
    [name: string]: unknown;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channelName` | `string` | Required |  |
| `clientPosition` | `{x: number; y: number}` | Optional |  |
| `insertMarkdown` | `void` | Required |  |
