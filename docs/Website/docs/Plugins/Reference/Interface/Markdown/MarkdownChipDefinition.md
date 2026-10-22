---
title: "MarkdownChipDefinition"
summary: "Parser, serializer, and render component for a plugin-owned Markdown chip."
---

## Import

```ts
import type { MarkdownChipDefinition } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownChipDefinition<Token = unknown> {
    id: string;
    prefix?: string;
    start?(source: string): number;
    parse(source: string): MarkdownChipParseResult<Token> | null | undefined;
    serialize(token: Token): string;
    component: (props: MarkdownChipRenderProps<Token>) => HostNode;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `prefix` | `string` | Optional |  |
| `start` | `number` | Optional |  |
| `parse` | `MarkdownChipParseResult<Token> \| null \| undefined` | Required |  |
| `serialize` | `string` | Required |  |
| `component` | `(props: MarkdownChipRenderProps<Token>) => HostNode` | Required |  |
