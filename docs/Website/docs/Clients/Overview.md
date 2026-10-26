---
summary: Choose a client for analysis, dashboards, or external C++ nodes.
updated: 2026-10-26T14:16
created: 2026-09-06T14:47
---

Clients let your own application read data from a running DARTWIC Engine, send requests, and follow live updates. Use them for analysis scripts, external tools, or custom dashboards.

Choose the library for your application below. To add features inside DARTWIC itself, use a [plugin](../Plugins/Overview.md).

| You want to build… | Guide |
| --- | --- |
| An analysis script, live monitor, or plotting tool | [Python Client](Python%20Client.md) |
| A Node service, dashboard backend, or data export tool | [Node.js Client](Node.js%20Client.md) |
| A native application that reads and writes Engine data | [C++ Client](C%2B%2B%20Client.md) |
| A browser dashboard with live React components | [React Client](React%20Client.md) |
| A separate node that owns channels and accepts commands | [C++ TEMPEST Peer](C%2B%2B%20TEMPEST%20Peer.md) |

# Download and install locally

Download the matching client from [Downloads](/areas/dartwic/downloads), extract it, and follow its guide. Python uses a local pip install; Node.js and React use a locally packed npm archive; C++ uses CMake. The clients are distributed as release archives rather than through PyPI or npm.

You can also install from the [public client sources](https://github.com/kemptonburton/dartwic-public/tree/main/clients). Each folder includes its transport, README, and install/build metadata. Third-party dependencies are still required. A peer using Engine channels, events, and logs also needs the Engine Protocol SDK, as explained in its guide.

# Operations and telemetry

An **operation** asks the Engine to do something and returns a response, such as the current pressure or the result of a write. **Telemetry** delivers updates asynchronously while your application stays connected.

```text
Connect → Read, write, or subscribe → Handle results and updates → Disconnect
```

A successful write reports the operation's result; check equipment feedback when you need to confirm a physical action. If a request times out, the Engine may still have carried it out. Check the resulting state before retrying a command.

Clients obey the same [channel authority](../Engine/Channels%20and%20Control.md) as the Interface. Connection status alone does not establish data freshness; check source timestamps before relying on a cached reading. Put timing-critical reactions in [Engine tasks, calculations, or events](../Engine/Execution%20and%20Timing.md).

The client guides show connection settings, small examples, and cleanup for each language. [Using TEMPEST](../Engine/Advanced/Using%20TEMPEST.md) owns the raw protocol details; [Networking and Peers](../Engine/Networking%20and%20Peers.md) covers peer connections, including application-supplied transports.

## Compatibility

Use a client release that supports your Engine version. Clients also carry a bundled TEMPEST compatibility value; registration fails with `tempest_version_mismatch` if its communication format differs from the Engine's. Install a matching client release rather than changing that value yourself. Custom peer protocols can have an additional application-owned protocol version.
