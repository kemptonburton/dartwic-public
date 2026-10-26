---
summary: Connect Node.js tools, read and write channels, receive telemetry, and export recorded data.
updated: 2026-10-26T14:16
created: 2026-09-07T17:03
---

The Node.js client connects a service or command-line tool to a running DARTWIC Engine. Use it to read and write channels, receive live data, or export recorded samples. Its calls return promises, so await their results before using the data or continuing dependent work.

Use Node.js 20 or newer. For components running in a browser, use the [React client](React%20Client.md).

# Download and install locally

Download **Node.js Client** from [Downloads](/areas/dartwic/downloads) and extract it. From your application's directory, pack the extracted release and install the resulting local archive. Replace the example path and version with your download:

```sh
npm pack ../packages/dartwic-node-client-2.0.0
npm install ./dartwic-dartwic.node-client-2.0.0.tgz
```

`npm pack` creates the `.tgz` in your current directory; it does not publish anything. The client is not published on npm. After this local installation, import it by its package name, `@dartwic/dartwic.node-client`, as shown below.

Keep the `.tgz` at the installed path for future dependency installs, including on other machines that use this project.

The release includes TEMPEST. npm installs `zeromq`, `json-bigint`, and `semver`; you do not need a second DARTWIC download. ZeroMQ uses native bindings, so platforms without a compatible prebuilt binding need the build tools required by `zeromq`.

# Connection settings

You need a running Engine, its address, its **base port**, and its password. [First Session](../Getting%20Started/First%20Session.md) covers Engine setup. The example uses `127.0.0.1:7000` and reads the password from the `DARTWIC_PASSWORD` environment variable. Telemetry uses base port + 1.

Replace the channel names below with names from your Engine.

# Connect

Save this as `analysis.mjs` and set `DARTWIC_PASSWORD`. Put the following examples inside the connected `try` block:

```js
import {DartwicClient} from '@dartwic/dartwic.node-client';
const client = new DartwicClient();
try {
  await client.connect('127.0.0.1', 7000, process.env.DARTWIC_PASSWORD);
  // Query, write, or subscribe here.
} finally {
  await client.disconnect();
}
```

Connection registers the client and checks compatibility. Helpers reject on transport or operation errors.

# Choose what your application does

The examples below show common uses. See the [Node.js API reference](Reference/Node.js/Overview.md) for the full current API, arguments, and return values. Choose the parts your application needs.

## Query channels

Read a single field or fetch several current channel records:

```js
console.log(await client.queryChannel('tank_pressure'));
console.log(await client.queryChannel('tank_pressure', 'units'));
const records = await client.getChannels(['tank_pressure', 'tank_temperature']);
for (const [name, record] of Object.entries(records)) {
  if (record.exists) console.log(name, record.channel_data.value);
}
```

A single read rejects for a missing channel or field; batch reads expose `exists`. The engine rounds live `value` fields to three decimals in this endpoint.

## Search channels

Find names for a picker or a later batch read:

```js
const matches = await client.searchChannels('tank', 25);
if (matches.length) console.log(await client.getChannels(matches));
```

## Write channels

Create or update a channel field, such as an analysis result and its units:

```js
await client.upsertChannel('analysis_result', 42);
await client.upsertChannel('analysis_result', 'bar', 'units');
```

A device adapter can submit a set of readings without creating a separate helper for every signal:

```js
const readings = {adapter_pressure: 2.5, adapter_temperature: 23.5};
for (const [channel, value] of Object.entries(readings)) {
  await client.upsertChannel(channel, value);
}
```

These are independent acknowledged writes; the loop is not an atomic bulk operation. Earlier writes remain applied if a later write fails. Engine authority applies, with no operator manual override. For owned remote channels, timestamped telemetry batches, and incoming driver commands, use [TEMPEST peer](../Engine/Networking%20and%20Peers.md).

## Subscribe and receive telemetry

Receive an initial snapshot and subsequent updates, then release the stream:

```js
const stop = await client.subscribeChannel('tank_pressure', snapshot => {
  if (snapshot.exists) console.log(snapshot.channel_data.value);
});
try {
  await new Promise(resolve => setTimeout(resolve, 10_000));
} finally {
  await stop();
}
```

Setup delivers an initial snapshot; asynchronous updates may overlap an awaited initial callback. Multiple listeners share one server reference. The stop function is idempotent. Keep callbacks short: awaited callbacks delay later delivery. Update callback failures are logged and isolated; an initial callback failure rejects setup.

## Inspect raw telemetry

Use a prefix handler when you need the message envelope. Bind it alongside a channel subscription:

```js
const stopRaw = client.subscribeTelemetry('rapid/channels/', (message, suffix) => {
  console.log(suffix, message.payload);
});
const stopChannel = await client.subscribeChannel('tank_pressure', () => {});
try {
  await new Promise(resolve => setTimeout(resolve, 10_000));
} finally {
  await stopChannel();
  stopRaw();
}
```

The raw binding only installs a local handler; it does not enable publication on the engine.

## Query and export recorded history

A dataframe is a saved time range over recorded data. This example finds `tank_run`, queries its recorded pressure channels and time range, and writes raw points to JSON:

```js
const {writeFile} = await import('node:fs/promises');
const frame = (await client.listDataframes()).find(item => item.name === 'tank_run');
if (!frame) throw new Error('No matching dataframe: tank_run');
const page = await client.operation('rapid/dataframes/channels', {id: frame.id, query: 'pressure', limit: 100});
if (page.error) throw new Error(page.payload.error);
const selected = page.payload.entries.filter(item => item.has_history).map(item => item.channel);
if (!selected.length) throw new Error('No recorded pressure channels');
const history = await client.queryChannelRange(selected, {
  from: frame.from_ns, to: frame.to_ns || BigInt(Date.now()) * 1_000_000n
});
await writeFile('pressure-history.json', JSON.stringify(history,
  (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
```

History contains a `channels` array and query statistics. Use bigint for nanosecond bounds beyond JavaScript's safe integer range. Catalog pages contain at most 200 entries; request more pages when needed. Use `bucketCount` for an aggregated preview when raw history exceeds the engine's point limit.

## Call other operations

Use `operation` for Engine or plugin operations without a convenience helper. Unlike helpers, it returns a response envelope that you must check:

```js
const response = await client.operation('dartwic/get-runtime-metadata');
if (response.error) throw new Error(response.payload.error);
console.log(response.payload.engineVersion);
```

The [operation reference](../Engine/Reference/TEMPEST/Operations/Overview.md) lists Engine endpoints and their payloads.

# Connection lifecycle

Heartbeats check session responsiveness; use source timestamps and operation timing to assess data freshness and Engine work. A query-only connection avoids unrelated broadcast telemetry. Subscriptions enable the topic prefixes and channel interest they need.

`isConnected()` is local state. A registered heartbeat probe detects connection or session loss; it is not instantaneous. This client does not reconnect automatically: await `disconnect()`, call `connect()` again, then recreate managed channel subscriptions. Serialize connection lifecycle calls. Timed-out operations are never replayed automatically, and a timeout does not cancel work on the engine. Check resulting state before retrying writes.

# Run and inspect

After setting `DARTWIC_PASSWORD`, run the file from your application directory:

```sh
node analysis.mjs
```

Start with a known channel read, then check that a subscription reports changes. The export example needs a `tank_run` dataframe containing recorded pressure samples; inspect `pressure-history.json` after it finishes. Nanosecond timestamps are written as strings so JSON can preserve them. See [Recording and Retention](../Engine/Recording%20and%20Retention.md) for recording setup.

# Reference

- [Node.js API reference](Reference/Node.js/DartwicClient.md) — Connection, channel, subscription, and history methods.
- [Engine operations](../Engine/Reference/TEMPEST/Operations/Overview.md) — Endpoints available through `operation`.
