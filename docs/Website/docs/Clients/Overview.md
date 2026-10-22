---
summary: Choose a client for analysis, dashboards, or external C++ nodes.
updated: 2026-10-22T11:28
created: 2026-09-06T14:47
---

Clients connect another application to a running DARTWIC engine. Use the DARTWIC libraries for channel-aware helpers, or TEMPEST directly when you need the transport's lower-level operation and telemetry APIs.

The [public client sources](https://github.com/kemptonburton/dartwic-public/tree/main/clients) can also be downloaded directly. Each client folder includes its transport and install/build metadata; follow its README. Third-party dependencies are still required.

| Client | Best fit | Connection |
| --- | --- | --- |
| [Python](Python%20Client.md) | Channel discovery, recorded ranges, and analysis scripts. | TEMPEST ZeroMQ, engine base port and base port + 1. |
| [Node.js](Node.js%20Client.md) | Node services, live data, and recorded-data analysis. | TEMPEST ZeroMQ, base port and base port + 1. |
| [C++](C%2B%2B%20Client.md) | Native analysis tools and ordinary engine operations. | Bundled TEMPEST ZeroMQ with automatic reconnect. |
| [React](React%20Client.md) | Custom browser dashboards with live channel state. | TEMPEST web endpoint, derived from the engine base port. |
| [C++ TEMPEST peer](C%2B%2B%20TEMPEST%20Peer.md) | External nodes exchanging channels, commands, and ARGUS events. | `TEMPEST::Peer` and the engine protocol. |
| [Custom TEMPEST peer application](../Engine/TEMPEST%20Peers.md) | An external node using your own frame delivery. | Engine protocol with an application-supplied transport. |

## Download and install locally

DARTWIC clients are distributed as release archives through [Downloads](/areas/dartwic/downloads). Download the client you need, extract it, and follow its guide to install it locally. They are not currently published on PyPI or npm.

| Client | Install the downloaded release |
| --- | --- |
| Python | Use pip with the path to the extracted package directory. |
| Node.js and React | Use `npm pack` on the extracted directory, then `npm install` the resulting local `.tgz` file in your application. |
| C++ and C++ TEMPEST peer | Build and install the extracted source with CMake, then link the installed target. |

Each DARTWIC client archive bundles its TEMPEST transport. pip and npm still fetch third-party dependencies; C++ dependency requirements are listed in the guides. The public source folders and release ZIPs contain the same installable library sources; packaging adds release metadata.

The client release records its minimum Engine version for capabilities it uses. The SDK supplies its bundled TEMPEST compatibility value. Registration fails with `tempest_version_mismatch` when the client's communication format and the Engine's format differ. Install a client release built for that TEMPEST value. Engine peers use the same TEMPEST value; an application-defined peer protocol can have an additional protocol version owned by that application.

## Operations and telemetry

An operation requests work and returns a response. Telemetry arrives asynchronously. Check a response's error before reading its payload; a timeout does not prove a state-changing operation failed to execute. Query the resulting state before retrying a command.

External clients obey the same [command authority](../Engine/Commanding%20and%20Control.md) as the interface. Timing-critical reactions belong in the engine's [inline calculations or events](../Engine/Execution%20and%20Timing.md), not a dashboard refresh loop.

See [Using TEMPEST](../Engine/Using%20TEMPEST.md) for endpoint, envelope, telemetry, and detached-job contracts.
