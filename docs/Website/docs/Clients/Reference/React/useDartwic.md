---
title: useDartwic
summary: Returns the DARTWIC client context for the nearest DartwicProvider.
created: 2026-08-03T15:41
updated: 2026-09-26T14:51
---

## Import

```js
import { useDartwic } from "@dartwic/dartwic.react-client";
```

## Declaration

```js
export function useDartwic()
```

## Returns

`DartwicContextValue` — Client operations, connection state, and channel subscription helpers.

## Context value

| Field | Type | Description |
| --- | --- | --- |
| `client` | `TempestWebClient` | Underlying TEMPEST web client. |
| `channelStore` | `object` | Subscription store used by the channel hooks. |
| `channels` | `object` | Current live channel payloads keyed by channel name. |
| `telemetryConnected` | `boolean` | Whether the TEMPEST telemetry transport is connected. |
| `telemetryConnectionChangedAt` | `number\|null` | Wall-clock milliseconds of the latest connection transition. |
| `telemetryReceiveHz` | `number\|null` | Effective cadence of telemetry probe frames received by this client. |
| `lastOperation` | `object\|null` | Result summary for the most recently tracked operation. |
| `connect` | `function` | Connects to an engine and verifies runtime compatibility. |
| `disconnect` | `function` | Disconnects and clears local channel state. |
| `operation` | `function` | Calls a TEMPEST operation. |
| `bindTelemetryHandler` | `function` | Registers a telemetry handler for a topic prefix. |
| `unbindTelemetryHandler` | `function` | Removes a telemetry handler. |
| `sendTelemetry` | `function` | Publishes a telemetry message. |
| `addChannelToTelemetry` | `function` | Subscribes to one RAPID channel. |
| `addChannelsToTelemetry` | `function` | Subscribes to multiple RAPID channels. |
| `removeChannelFromTelemetry` | `function` | Unsubscribes from one RAPID channel. |
| `removeChannelsFromTelemetry` | `function` | Unsubscribes from multiple RAPID channels. |
| `queryChannelRange` | `function` | Queries recorded values for one channel. |
| `upsertChannel` | `function` | Writes a value or metadata field by flat RAPID channel name. |
