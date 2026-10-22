---
title: "Markdown"
summary: "Embed the host Markdown editor, define custom chips, and present collaborative document state."
---

| Export | Import path | Description |
| --- | --- | --- |
| [defineMarkdownChip](defineMarkdownChip.md) | `@dartwic/interface-sdk/markdown` | Defines a plugin-owned Markdown chip without exposing the host editor runtime. |
| [MarkdownChannelDropContext](MarkdownChannelDropContext.md) | `@dartwic/interface-sdk/markdown` | Dropped channel, pointer position, and callback for inserting Markdown. |
| [MarkdownChipDefinition](MarkdownChipDefinition.md) | `@dartwic/interface-sdk/markdown` | Parser, serializer, and render component for a plugin-owned Markdown chip. |
| [MarkdownChipParseResult](MarkdownChipParseResult.md) | `@dartwic/interface-sdk/markdown` | Matched source text and typed token returned by a chip parser. |
| [MarkdownChipRenderProps](MarkdownChipRenderProps.md) | `@dartwic/interface-sdk/markdown` | Parsed chip token and selection/edit callbacks supplied to its component. |
| [MarkdownDropAction](MarkdownDropAction.md) | `@dartwic/interface-sdk/markdown` | Labeled action offered when a channel is dropped into Markdown. |
| [MarkdownLineNumberMode](MarkdownLineNumberMode.md) | `@dartwic/interface-sdk/markdown` | Choose line numbers for all lines, checkboxes, or no lines. |
| [MarkdownMode](MarkdownMode.md) | `@dartwic/interface-sdk/markdown` | Select read-only viewing or Markdown editing. |
| [MarkdownRemoteParticipant](MarkdownRemoteParticipant.md) | `@dartwic/interface-sdk/markdown` | Remote participant identity, appearance, selection, and cursor presence. |
| [MarkdownRenderer](MarkdownRenderer.md) | `@dartwic/interface-sdk/markdown` | Shared host Markdown renderer. The host owns React, TipTap, and ProseMirror. |
| [MarkdownRendererHandle](MarkdownRendererHandle.md) | `@dartwic/interface-sdk/markdown` | Imperative access to Markdown content, remote edits, heading navigation, focus, and presence. |
| [MarkdownRendererProps](MarkdownRendererProps.md) | `@dartwic/interface-sdk/markdown` | Content, editing controls, chips, collaboration, and callbacks for the host Markdown renderer. |
| [MarkdownSelection](MarkdownSelection.md) | `@dartwic/interface-sdk/markdown` | Document selection offsets used for editing and participant presence. |
