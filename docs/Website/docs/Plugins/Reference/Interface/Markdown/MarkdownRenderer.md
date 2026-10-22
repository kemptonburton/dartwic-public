---
title: MarkdownRenderer
summary: Shared host Markdown renderer. The host owns React, TipTap, and ProseMirror.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { MarkdownRenderer } from "@dartwic/interface-sdk/markdown";
```

## Declaration

```ts
export const MarkdownRenderer: HostComponent<MarkdownRendererProps>;
```

## MarkdownRendererProps

Content, editing controls, chips, collaboration, and callbacks for the host Markdown renderer.

```ts
export interface MarkdownRendererProps {
    [name: string]: unknown;
    value: string;
    mode?: MarkdownMode;
    editable?: boolean;
    lightweight?: boolean;
    chips?: MarkdownChipDefinition[];
    getChannelDropActions?: (context: MarkdownChannelDropContext) => MarkdownDropAction[];
    editorRef?: {current: MarkdownRendererHandle | null};
    defaultOrigin?: string;
    commandEnabled?: boolean;
    lineNumberMode?: MarkdownLineNumberMode;
    showToolbar?: boolean;
    showToc?: boolean;
    showGutter?: boolean;
    tocOpen?: boolean;
    closeTocOnHeadingClick?: boolean;
    onTocOpenChange?: (open: boolean) => void;
    onModeChange?: (mode: MarkdownMode) => void;
    onCommandEnabledChange?: (enabled: boolean) => void;
    onLineNumberModeChange?: (mode: MarkdownLineNumberMode) => void;
    onMarkdownChange?: (markdown: string) => void;
    onTransactionBatch?: HostEventHandler;
    onPresenceChange?: (selection: MarkdownSelection) => void;
    onViewCursorPresenceChange?: (position: {x: number; y: number} | null) => void;
    onUndoRedoStateChange?: HostEventHandler;
    onFocusChange?: (focused: boolean) => void;
    onSelectedTokenChange?: (tokenId: string | null) => void;
    remoteParticipants?: Record<string, MarkdownRemoteParticipant>;
    className?: string;
    titleText?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `value` | `string` | Required |  |
| `mode` | `MarkdownMode` | Optional |  |
| `editable` | `boolean` | Optional |  |
| `lightweight` | `boolean` | Optional |  |
| `chips` | `MarkdownChipDefinition[]` | Optional |  |
| `getChannelDropActions` | `(context: MarkdownChannelDropContext) => MarkdownDropAction[]` | Optional |  |
| `editorRef` | `{current: MarkdownRendererHandle \| null}` | Optional |  |
| `defaultOrigin` | `string` | Optional |  |
| `commandEnabled` | `boolean` | Optional |  |
| `lineNumberMode` | `MarkdownLineNumberMode` | Optional |  |
| `showToolbar` | `boolean` | Optional |  |
| `showToc` | `boolean` | Optional |  |
| `showGutter` | `boolean` | Optional |  |
| `tocOpen` | `boolean` | Optional |  |
| `closeTocOnHeadingClick` | `boolean` | Optional |  |
| `onTocOpenChange` | `(open: boolean) => void` | Optional |  |
| `onModeChange` | `(mode: MarkdownMode) => void` | Optional |  |
| `onCommandEnabledChange` | `(enabled: boolean) => void` | Optional |  |
| `onLineNumberModeChange` | `(mode: MarkdownLineNumberMode) => void` | Optional |  |
| `onMarkdownChange` | `(markdown: string) => void` | Optional |  |
| `onTransactionBatch` | `HostEventHandler` | Optional |  |
| `onPresenceChange` | `(selection: MarkdownSelection) => void` | Optional |  |
| `onViewCursorPresenceChange` | `(position: {x: number; y: number} \| null) => void` | Optional |  |
| `onUndoRedoStateChange` | `HostEventHandler` | Optional |  |
| `onFocusChange` | `(focused: boolean) => void` | Optional |  |
| `onSelectedTokenChange` | `(tokenId: string \| null) => void` | Optional |  |
| `remoteParticipants` | `Record<string, MarkdownRemoteParticipant>` | Optional |  |
| `className` | `string` | Optional |  |
| `titleText` | `string` | Optional |  |
