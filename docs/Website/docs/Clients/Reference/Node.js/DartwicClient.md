---
title: DartwicClient
summary: Node.js DARTWIC client. Helpers reject on failure; operation resolves a raw response envelope.
created: 2026-10-04T18:31
updated: 2026-10-14T22:39
---

```js
import {DartwicClient} from "@dartwic/dartwic.node-client";
```

## constructor

Create a client; optionally inject an existing TEMPEST client for testing or integration.

```js
constructor(tempest = new TempestClient())
```

## connect

Register with the engine and check compatibility. Call disconnect before reconnecting; no writes are retried.

```js
async connect(host = '127.0.0.1', port = 7000, password = '')
```

## disconnect

Release this session and all managed channel subscriptions. Await before calling connect again.

```js
async disconnect()
```

## isConnected

Return local connection state. Heartbeat failure clears it; call connect again after disconnect.

```js
isConnected()
```

## operation

Issue any TEMPEST operation and return its envelope. A timeout is not proof the server canceled the work.

```js
async operation(name, payload = {}, timeoutMs = 5000)
```

## searchChannels

Search live channel keys; returns an array of names. limit defaults to 1000.

```js
async searchChannels(query = '', limit = 1000)
```

## getChannels

Read live records keyed by name with exists and channel_data fields.

```js
async getChannels(channels)
```

## queryChannel

Read one live field, defaulting to value. Throws for a missing channel or field.

```js
async queryChannel(channel, field = 'value')
```

## upsertChannel

Write a typed channel value or metadata field. Engine authority applies; manual override is not requested.

```js
async upsertChannel(channel, value, field = 'value')
```

## listDataframes

List saved dataframe views with IDs and time ranges.

```js
async listDataframes()
```

## queryChannelRange

Query recorded series. Options: from/to integer timestamps, bucketCount, bucketMode (average/extrema), timeoutMs. Returns the complete server payload and preserves integer nanoseconds as bigint.

```js
async queryChannelRange(channels, options = {})
```

## subscribeTelemetry

Bind a raw topic prefix. Callback receives the telemetry envelope and topic suffix. Returns an idempotent local unsubscribe function.

```js
subscribeTelemetry(prefix, handler)
```

## subscribeChannel

Enable an exact channel stream and deliver its initial snapshot. Returns an async idempotent unsubscribe function; subscribe again after reconnect. Callback errors on updates are isolated by TEMPEST.

```js
async subscribeChannel(channel, handler)
```
