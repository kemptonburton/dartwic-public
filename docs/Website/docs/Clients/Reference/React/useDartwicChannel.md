---
title: "useDartwicChannel"
summary: "Subscribes to one live channel."
---

## Import

```js
import { useDartwicChannel } from "@dartwic/dartwic.react-client";
```

## Declaration

```js
export function useDartwicChannel(channelName)
```

## Parameters

| Name | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| `channelName` | `string` | Required | — | Full RAPID channel name. |

## Returns

`object|undefined` — The latest channel payload, or undefined before data arrives.
