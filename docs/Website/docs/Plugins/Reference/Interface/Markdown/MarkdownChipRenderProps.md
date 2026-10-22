---
title: "MarkdownChipRenderProps"
summary: "Parsed chip token and selection/edit callbacks supplied to its component."
---

## Import

```ts
import type { MarkdownChipRenderProps } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownChipRenderProps<Token = unknown> {
    token: Token;
    tokenId: string;
    canEdit: boolean;
    mode: MarkdownMode;
    commandEnabled: boolean;
    selected: boolean;
    select(): void;
    clearSelection(): void;
    updateToken(nextToken: Token): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `token` | `Token` | Required |  |
| `tokenId` | `string` | Required |  |
| `canEdit` | `boolean` | Required |  |
| `mode` | `MarkdownMode` | Required |  |
| `commandEnabled` | `boolean` | Required |  |
| `selected` | `boolean` | Required |  |
| `select` | `void` | Required |  |
| `clearSelection` | `void` | Required |  |
| `updateToken` | `void` | Required |  |
