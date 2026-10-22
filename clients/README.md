# DARTWIC clients

These libraries connect external applications to DARTWIC. Each folder includes its DARTWIC transport sources and can be copied or downloaded without the private application repository or another client folder.

| Client | Folder | Requirements |
| --- | --- | --- |
| Python | [python](python) | Python 3.10+; pip installs pyzmq. |
| Node.js | [js/dartwic-node-client](js/dartwic-node-client) | Node 20+; npm installs dependencies. |
| React | [js/dartwic-react-client](js/dartwic-react-client) | React 18+ and a JSX/JSON-capable bundler. |
| C++ operations and data | [cpp/dartwic-client](cpp/dartwic-client) | C++20, CMake, cppzmq and nlohmann JSON. |
| C++ TEMPEST peer | [cpp/tempest-peer-client](cpp/tempest-peer-client) | C++20, CMake, cppzmq and nlohmann JSON. |

Follow each client's README to install it. Third-party dependencies still come from pip, npm or your C++ dependency manager. No separate TEMPEST download is required.

The ordinary C++ client calls engine operations and reads data. The TEMPEST peer client runs a node with its own operations and telemetry. DARTWIC-specific peer messages are available separately in the [Engine Protocol SDK](../sdk/dartwic-engine-protocol).

Versioned ZIP downloads are available through [DARTWIC Downloads](https://kemptonburton.com/areas/dartwic/downloads). Client sources use individual release tags such as `python-client-v2.0.0` in this repository. See the [client guides](../docs/Website/docs/Clients/Overview.md) for usage and API references.
