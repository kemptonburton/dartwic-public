---
title: SchematicChannelDropContext
summary: Metadata supplied for channel insertion and existing-node drops.
created: 2026-11-12T15:51
updated: 2026-11-13T00:56
---

## Import

```ts
import type { SchematicChannelDropContext } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicChannelDropContext {
    channelName: string;
    channelReference?: string;
    channelData?: any;
    allChannels?: Record<string, any>;
    pair: {command_channel: string; state_channel: string};
    makeRowId(): string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channelName` | `string` | Required |  |
| `channelReference` | `string` | Optional |  |
| `channelData` | `any` | Optional |  |
| `allChannels` | `Record<string, any>` | Optional |  |
| `pair` | `{command_channel: string; state_channel: string}` | Required |  |
| `makeRowId` | `string` | Required |  |
