---
title: "StaleChannelsTooltipProps"
summary: "Shows stale or missing channel context."
---

## Import

```ts
import type { StaleChannelsTooltipProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface StaleChannelsTooltipProps extends HostComponentProps {
    channelValuePaths?: string[];
    channelNames?: string[];
    notFoundChannelNames?: string[];
    contextTitle?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channelValuePaths` | `string[]` | Optional |  |
| `channelNames` | `string[]` | Optional |  |
| `notFoundChannelNames` | `string[]` | Optional |  |
| `contextTitle` | `string` | Optional |  |
