# DARTWIC React client

React provider and channel hooks with an included TEMPEST web transport. Copy this folder from the public repository or extract the React Client download. It needs no other DARTWIC package.

From this folder, run `npm pack`, then install the resulting `.tgz` from your application's directory:

```sh
npm install ../packages/dartwic-dartwic.react-client-2.0.0.tgz
```

Keep that archive available for future installs. React 18+ is a peer dependency. Your bundler must handle JSX and JSON imports from this package. This client is not published on npm.

```jsx
import {useState} from 'react';
import {DartwicProvider, useDartwic} from '@dartwic/dartwic.react-client';

function Dashboard() {
  const {connect, disconnect, telemetryConnected} = useDartwic();
  const [error, setError] = useState('');
  async function open() {
    try {
      const response = await connect('127.0.0.1', 7000, 'password');
      if (response.error) throw new Error(response.payload.error);
      setError('');
    } catch (error) { setError(error.message); }
  }
  return <>
    <button onClick={open}>Connect</button>
    <button onClick={() => void disconnect()}>Disconnect</button>
    <p>{telemetryConnected ? 'Connected' : 'Disconnected'}</p>
    {error && <p role="alert">{error}</p>}
  </>;
}

export default function App() {
  return <DartwicProvider><Dashboard /></DartwicProvider>;
}
```

`connect` checks the engine's minimum supported version. `operation` returns a TEMPEST response envelope; check `response.error`. Use `addChannelToTelemetry` / `removeChannelFromTelemetry` or their plural forms to manage streams. `useDartwicChannel`, `useDartwicChannels` and `useDartwicChannelValues` read the shared channel store. Cached values and a connected transport do not prove fresh measurements.

The raw web transport is also exported from `@dartwic/dartwic.react-client/transport`. See the website's **Clients → React Client** guide for subscriptions, history, reconnect and connection ownership.
