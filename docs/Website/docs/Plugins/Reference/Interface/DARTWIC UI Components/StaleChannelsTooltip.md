---
title: StaleChannelsTooltip
summary: Display details about stale channel data.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { StaleChannelsTooltip } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const StaleChannelsTooltip: HostComponent<StaleChannelsTooltipProps>;
```

## StaleChannelsTooltipProps

Shows stale or missing channel context.

```ts
export interface StaleChannelsTooltipProps extends HostComponentProps {
    channelValuePaths?: string[];
    channelNames?: string[];
    notFoundChannelNames?: string[];
    contextTitle?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `channelValuePaths` | `string[]` | Optional |  |
| `channelNames` | `string[]` | Optional |  |
| `notFoundChannelNames` | `string[]` | Optional |  |
| `contextTitle` | `string` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
