---
title: "defineMarkdownChip"
summary: "Defines a plugin-owned Markdown chip without exposing the host editor runtime."
---

## Import

```ts
import { defineMarkdownChip } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export function defineMarkdownChip<Token = unknown>(definition: MarkdownChipDefinition<Token>): MarkdownChipDefinition<Token> {
    if (!definition || typeof definition !== "object") {
        throw new Error("defineMarkdownChip(...) requires a definition.");
    }
    if (!String(definition.id ?? "").trim()) {
        throw new Error("A Markdown chip id is required.");
    }
    if (typeof definition.parse !== "function" || typeof definition.serialize !== "function" || typeof definition.component !== "function") {
        throw new Error(`Markdown chip '${definition.id}' requires parse, serialize, and component functions.`);
    }
    return definition;
}
```
