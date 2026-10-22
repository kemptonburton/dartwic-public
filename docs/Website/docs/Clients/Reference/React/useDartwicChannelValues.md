---
title: "useDartwicChannelValues"
summary: "Subscribes to a selected set of live channels without rerendering for unrelated channel updates."
---

## Import

```js
import { useDartwicChannelValues } from "@dartwic/dartwic.react-client";
```

## Declaration

```js
export function useDartwicChannelValues(channelNames = [])
```

## Parameters

| Name | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| `channelNames` | `string\|string[]` | Optional | `[]` | Full RAPID channel names to select. |

## Returns

`object` — Selected channel payloads keyed by channel name.
