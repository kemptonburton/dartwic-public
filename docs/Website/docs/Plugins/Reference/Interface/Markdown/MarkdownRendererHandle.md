---
title: "MarkdownRendererHandle"
summary: "Imperative access to Markdown content, remote edits, heading navigation, focus, and presence."
---

## Import

```ts
import type { MarkdownRendererHandle } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownRendererHandle {
    getMarkdown(): string;
    setMarkdown(markdown: string): void;
    applyRemoteEdits(changeBatches?: unknown[], fallbackMarkdown?: string | null): boolean;
    focusHeading(idOrPosition: string | number): void;
    getPresenceSnapshot(): MarkdownSelection | null;
    hasFocus(): boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `getMarkdown` | `string` | Required |  |
| `setMarkdown` | `void` | Required |  |
| `applyRemoteEdits` | `boolean` | Required |  |
| `focusHeading` | `void` | Required |  |
| `getPresenceSnapshot` | `MarkdownSelection \| null` | Required |  |
| `hasFocus` | `boolean` | Required |  |
