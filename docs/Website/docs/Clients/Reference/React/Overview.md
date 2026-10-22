---
title: "React Client Reference"
summary: "React context and hooks for DARTWIC connections and live RAPID channel data."
---

| Export | Description |
| --- | --- |
| [DartwicContext](DartwicContext.md) | / /** React context populated by DartwicProvider. Prefer useDartwic and the channel hooks in application components. |
| [DartwicProvider](DartwicProvider.md) | Provides a shared DARTWIC client connection and live channel store to a React subtree. |
| [useDartwic](useDartwic.md) | Returns the DARTWIC client context for the nearest DartwicProvider. |
| [useDartwicChannel](useDartwicChannel.md) | Subscribes to one live channel. |
| [useDartwicChannels](useDartwicChannels.md) | Subscribes to the complete live channel snapshot. |
| [useDartwicChannelValues](useDartwicChannelValues.md) | Subscribes to a selected set of live channels without rerendering for unrelated channel updates. |
