---
title: "MarkdownRemoteParticipant"
summary: "Remote participant identity, appearance, selection, and cursor presence."
---

## Import

```ts
import type { MarkdownRemoteParticipant } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export interface MarkdownRemoteParticipant {
    clientId?: string;
    username?: string;
    displayName?: string;
    accentColor?: string;
    avatarImageSrc?: string;
    avatarFallbackText?: string;
    selection?: MarkdownSelection | null;
    cursorPosition?: {x: number; y: number} | null;
    presenceMode?: MarkdownMode;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `clientId` | `string` | Optional |  |
| `username` | `string` | Optional |  |
| `displayName` | `string` | Optional |  |
| `accentColor` | `string` | Optional |  |
| `avatarImageSrc` | `string` | Optional |  |
| `avatarFallbackText` | `string` | Optional |  |
| `selection` | `MarkdownSelection \| null` | Optional |  |
| `cursorPosition` | `{x: number; y: number} \| null` | Optional |  |
| `presenceMode` | `MarkdownMode` | Optional |  |
