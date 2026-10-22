---
summary: Connect Node.js tools, read and write channels, receive telemetry, and export recorded data.
updated: 2026-10-16T04:48
created: 2026-09-07T17:03
---

The Node.js client provides promise-based operations for services, dashboard backends, and analysis tools. Use Node.js 20 or newer; browser dashboards use the [React client](React%20Client.md).

## Download and install locally

Download **Node.js Client** from [Downloads](/areas/dartwic/downloads) and extract it. From your application's directory, pack the extracted release and install the resulting local archive. Replace the example path and version with your download:

```sh
npm pack ../packages/dartwic-node-client-2.0.0
npm install ./dartwic-dartwic.node-client-2.0.0.tgz
```

`npm pack` creates the `.tgz` in your current directory; it does not publish anything. The client is not published on npm. After this local installation, import it by its package name, `@dartwic/dartwic.node-client`, as shown below.

Keep the `.tgz` at the installed path for future dependency installs, including on other machines that use this project.

The release includes TEMPEST. npm installs `zeromq`, `json-bigint`, and `semver`; you do not need a second DARTWIC download. ZeroMQ uses native bindings, so platforms without a compatible prebuilt binding need the build tools required by `zeromq`.

## Connect

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

Pass the engine's base port; telemetry uses base port + 1. Connection registers the client and checks compatibility. Helpers reject on transport or operation errors.

A query-only connection does not receive unrelated broadcast telemetry. Telemetry subscriptions install the required socket topic prefixes alongside engine channel interest, so a data-analysis tool can query recording and selected diagnostics without also decoding every broadcast topic.

By default, liveness uses TEMPEST's dedicated authenticated heartbeat, separate from ordinary operation work. A successful heartbeat establishes protocol/session responsiveness; use operation timing and source timestamps to assess engine work and data freshness.

## Query channels

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

```js
const matches = await client.searchChannels('tank', 25);
if (matches.length) console.log(await client.getChannels(matches));
```

## Upsert channels

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

These are independent acknowledged writes; the loop is not an atomic bulk operation. Earlier writes remain applied if a later write fails. Engine authority applies, with no operator manual override. For owned remote channels, timestamped telemetry batches, and incoming driver commands, use [TEMPEST peer](../Engine/TEMPEST%20Peers.md).

## Subscribe and receive telemetry

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

To inspect raw envelopes, bind a prefix alongside a channel subscription:

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

## Example: find a dataframe and export recorded channels

This example finds `tank_run`, queries its recorded pressure channels and time range, and writes raw points to JSON:

```js
const {writeFile} = await import('node:fs/promises');
const frame = (await client.listDataframes()).find(item => item.name === 'tank_run');
if (!frame) throw new Error('No matching dataframe: tank_run');
const page = await client.operation('rapid/dataframes/channels', {id: frame.id, query: 'pressure', limit: 100});
const selected = page.payload.entries.filter(item => item.has_history).map(item => item.channel);
if (!selected.length) throw new Error('No recorded pressure channels');
const history = await client.queryChannelRange(selected, {
  from: frame.from_ns, to: frame.to_ns ?? BigInt(Date.now()) * 1_000_000n
});
await writeFile('pressure-history.json', JSON.stringify(history,
  (_, value) => typeof value === 'bigint' ? value.toString() : value, 2));
```

History contains a `channels` array and query statistics. Use bigint for nanosecond bounds beyond JavaScript's safe integer range. Catalog pages contain at most 200 entries; request more pages when needed. Use `bucketCount` for an aggregated preview when raw history exceeds the engine's point limit.

## Raw operations and connection loss

```js
const response = await client.operation('dartwic/get-runtime-metadata');
if (response.error) throw new Error(response.payload.error);
console.log(response.payload.engineVersion);
```

Unlike helpers, raw `operation` returns an envelope that must be checked. See [Using TEMPEST](../Engine/Using%20TEMPEST.md) for available operations.

`isConnected()` is local state. A registered heartbeat probe detects connection or session loss; it is not instantaneous. This client does not reconnect automatically: await `disconnect()`, call `connect()` again, then recreate managed channel subscriptions. Serialize connection lifecycle calls. Timed-out operations are never replayed automatically, and a timeout does not cancel work on the engine. Check resulting state before retrying writes.

See the generated [Node.js API reference](Reference/Node.js/Overview.md).
