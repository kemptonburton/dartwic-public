---
summary: Connect a React dashboard and subscribe to channel state.
updated: 2026-10-14T22:35
created: 2026-08-03T15:41
---

The React client supplies a provider, connection helpers, and a shared channel store. Use it in an external dashboard; an interface plugin should use the host's SDK connection instead.

## Download and install locally

Download and extract **React Client** from [Downloads](/areas/dartwic/downloads). From your React project's directory, pack the extracted release and install the resulting local archive. Replace the example path and version with your download:

```sh
npm pack ../packages/dartwic-react-client-2.0.0
npm install ./dartwic-dartwic.react-client-2.0.0.tgz
```

`npm pack` creates the `.tgz` in your current directory; it does not publish anything. The client is not published on npm. After this local installation, import it by its package name, `@dartwic/dartwic.react-client`, as shown below.

Keep the `.tgz` at the installed path for future dependency installs, including on other machines that use this project.

The release bundles its TEMPEST web transport. React 18 or newer is a peer dependency. Use a bundler that handles JSX and JSON imports from the client source.

## Connect

The example uses a button to connect. Add the query, write, and telemetry examples below to components inside this provider. Enter the configured engine password when connecting; it is not stored by this component.

```jsx
import React, { useState } from "react";
import {
  DartwicProvider, useDartwic,
} from "@dartwic/dartwic.react-client";

function Dashboard() {
  const { connect, disconnect, telemetryConnected } = useDartwic();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("Disconnected");

  async function open() {
    setStatus("Connecting");
    try {
      await connect("127.0.0.1", 7000, password);
      setPassword("");
      setStatus("Connected");
    } catch (error) {
      await disconnect().catch(() => {});
      setStatus(error.message);
    }
  }

  async function close() {
    await disconnect();
    setStatus("Disconnected");
  }

  return (
    <main>
      <input aria-label="Engine password" type="password" value={password}
        onChange={(event) => setPassword(event.target.value)} />
      <button onClick={open} disabled={status === "Connecting" || status === "Connected"}>
        Connect
      </button>
      <button onClick={close}>Disconnect</button>
      <p>{status}</p>
      <p>Live telemetry: {telemetryConnected ? "connected" : "unavailable"}</p>
    </main>
  );
}

export default function App() {
  return <DartwicProvider><Dashboard /></DartwicProvider>;
}
```

Pass the engine **base port**, not base port + 2; the web client derives its endpoint. The engine must be reachable from the browser, and the web transport must be accessible. An HTTPS-hosted dashboard also needs a browser-compatible secure transport deployment; browsers can reject mixed-content connections.

If the engine explicitly rejects an operation because the client session expired, the bundled web transport re-registers and retries that rejected operation once. A timeout or lost response has an unknown owner-side outcome and is not retried this way. After re-registration, the provider restores its channel subscriptions; applications should refresh any view-owned history queries that need current data.

## Query channels

Inside a component under `DartwicProvider`, get `operation` from `useDartwic()` and call it from an event handler after connecting:

```jsx
const { operation } = useDartwic();

async function readChannels() {
  const response = await operation("rapid/get-channels-data", {
    channel_names: ["tank_pressure", "tank_temperature"],
  });
  if (response.error) throw new Error(response.payload.error);
  for (const [name, record] of Object.entries(response.payload.channels)) {
    if (record.exists) console.log(name, record.channel_data.value);
  }
}
```

This is a one-time read. Missing records have `exists: false`; this endpoint rounds live values to three decimals. Use the hooks below for a dashboard that stays current.

## Search channels

```jsx
async function findChannels() {
  const response = await operation("rapid/search-channel-keys", {query: "tank", limit: 25});
  if (response.error) throw new Error(response.payload.error);
  return response.payload.query_results;
}
```

Use the returned names to populate a channel picker or pass them to a batch query.

## Upsert channels

```jsx
const { upsertChannel } = useDartwic();

async function saveSetpoint() {
  const response = await upsertChannel("tank_setpoint", 2.5);
  if (response.error) throw new Error(response.payload.error);
}
```

Call `saveSetpoint` from an explicit user action such as a button. `upsertChannel(name, value, field)` also writes metadata fields. Writes obey [engine authority](../Engine/Commanding%20and%20Control.md); handle errors in your UI. To write several fields, await each call and check every response; those writes are not one atomic batch.

## Subscribe and receive telemetry

Mount this component after connection succeeds. It enables two streams and releases them when unmounted:

```jsx
import {useEffect, useState} from 'react';
import {useDartwic, useDartwicChannel} from '@dartwic/dartwic.react-client';

function TankMonitor() {
  const {addChannelsToTelemetry, removeChannelsFromTelemetry} = useDartwic();
  const pressure = useDartwicChannel('tank_pressure');
  const temperature = useDartwicChannel('tank_temperature');
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    addChannelsToTelemetry(['tank_pressure', 'tank_temperature'])
      .then(response => {if (response.error && active) setError(response.payload.error);})
      .catch(error => {if (active) setError(error.message);});
    return () => {
      active = false;
      void removeChannelsFromTelemetry(['tank_pressure', 'tank_temperature']).catch(console.error);
    };
  }, [addChannelsToTelemetry, removeChannelsFromTelemetry]);
  return <section>
    {error && <p role="alert">{error}</p>}
    <pre>{JSON.stringify({pressure, temperature}, null, 2)}</pre>
  </section>;
}
```

The hooks read the shared store; they do not enable telemetry themselves. Inspect missing and stale state rather than rendering absent values as zero. Raw callbacks are also available with `bindTelemetryHandler(prefix, handler)` and `unbindTelemetryHandler(prefix, handler)`; a prefix binding alone does not enable an engine stream.

## Example: find a recording for a dashboard preview

Use a button handler to list saved views, find recorded channels in one range, and fetch an aggregated preview:

```jsx
async function loadPreview() {
  const frames = await operation('rapid/dataframes/list', {});
  if (frames.error) throw new Error(frames.payload.error);
  const frame = frames.payload.frames.find(item => item.name === 'tank_run');
  if (!frame) throw new Error('No tank_run dataframe');
  const page = await operation('rapid/dataframes/channels', {id: frame.id, query: 'pressure', limit: 100});
  if (page.error) throw new Error(page.payload.error);
  const series = page.payload.entries.filter(item => item.has_history).map(item => item.channel);
  const history = await operation('rapid/query-channel-range', {
    series, from: Number(frame.from_ns) / 1e6, to: Number(frame.to_ns ?? Date.now() * 1e6) / 1e6,
    bucket_count: 500, bucket_mode: 'average'
  });
  if (history.error) throw new Error(history.payload.error);
  return history.payload.channels;
}
```

This returns a reduced preview for a chart, not every recorded sample. Omit `bucket_count`/`bucket_mode` for raw history subject to the engine's point limit; narrow the interval if the request is too large. The current browser transport parses ordinary JavaScript numbers, so nanosecond timestamps may lose integer precision. Use the Python, Node.js, or C++ client for exact timestamp analysis.

## Connection and subscription lifecycle

The provider tracks desired subscriptions for reconnect. The local `status` in the connection form reports the last requested action; use `telemetryConnected` to show transport loss and avoid presenting cached values as live. Explicit `disconnect()` clears desired subscriptions and the channel store. Connect and subscribe again for a new session. Keep connection ownership at application level so removing one widget does not disconnect the others.

Telemetry and React rendering are asynchronous. See the [channel hook](Reference/React/useDartwicChannel.md), [provider](Reference/React/DartwicProvider.md), and [Using TEMPEST](../Engine/Using%20TEMPEST.md) references for full response and operation contracts.
