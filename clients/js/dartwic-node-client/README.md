# DARTWIC Node.js Client

A Node.js wrapper around TEMPEST for live channels, telemetry, and recorded data. Node 20+ is required.

## Manual installation

Copy this folder from the public repository or extract its release ZIP. No other DARTWIC source folder is required.

Download **Node.js Client** from the DARTWIC Downloads page and extract the archive. This client is not published on npm. Run these commands from your application's directory, replacing the path and version with your extracted release:

```sh
npm pack ../packages/dartwic-node-client-2.0.0
npm install ./dartwic-dartwic.node-client-2.0.0.tgz
```

Packing creates a local `.tgz`; it does not publish the package. Keep the archive at the installed path for future dependency installs. This folder includes TEMPEST; npm installs `zeromq`, `json-bigint`, and `semver`. After installation, use the package-name import below.

## Usage

```js
import {DartwicClient} from '@dartwic/dartwic.node-client';
const client = new DartwicClient();
try {
  await client.connect('127.0.0.1', 7000, process.env.DARTWIC_PASSWORD ?? '');
  console.log(await client.searchChannels('pressure'));
  console.log(await client.queryChannelRange(['demo_pressure']));
} finally { await client.disconnect(); }
```

History timestamps above JavaScript's safe integer range are `bigint`. Use bigint nanoseconds as bounds; `JSON.stringify` needs a bigint replacer when exporting results. Convenience methods throw; raw `operation` returns an envelope with `error` and `payload`. No state-changing request is automatically retried. See the website's **Clients â†’ Node.js Client** guide and generated reference for subscriptions and examples.

Query-only clients do not receive unrelated broadcast telemetry. Telemetry helpers install the required topic-prefix handlers and engine channel interest; removing the last handler removes that socket prefix. Explicit catch-all handlers remain supported by the underlying TEMPEST client.

The transport's dedicated authenticated heartbeat checks session liveness independently of ordinary operation backlog. Compatibility is checked on connect. Heartbeats do not establish task timing or data freshness.
