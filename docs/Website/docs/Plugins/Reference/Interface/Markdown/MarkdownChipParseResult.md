---
title: "MarkdownChipParseResult"
summary: "Matched source text and typed token returned by a chip parser."
---

## Import

```ts
import type { MarkdownChipParseResult } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownChipParseResult<Token = unknown> {
    raw: string;
    token: Token;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `raw` | `string` | Required |  |
| `token` | `Token` | Required |  |
