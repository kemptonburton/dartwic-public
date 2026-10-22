---
title: "DartwicProvider"
summary: "Provides a shared DARTWIC client connection and live channel store to a React subtree."
---

## Import

```js
import { DartwicProvider } from "@dartwic/dartwic.react-client";
```

## Declaration

```js
export function DartwicProvider({
    children,
    implementHeartbeat = true,
    logger = console,
    onError = null,
})
```

## Parameters

| Name | Type | Requirement | Default | Description |
| --- | --- | --- | --- | --- |
| `props` | `object` | Required | — | Provider properties. |
| `props.children` | `React.ReactNode` | Required | — | Components that can access the DARTWIC context. |
| `props.implementHeartbeat` | `boolean` | Optional | `true` | Enables TEMPEST heartbeat handling. |
| `props.logger` | `object` | Optional | `console` | Logger passed to the TEMPEST web client. |
| `props.onError` | `function\|null` | Optional | `null` | Called when the TEMPEST client reports an error. |

## Returns

`React.ReactElement` — The context provider for the wrapped subtree.
