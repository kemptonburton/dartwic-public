# DARTWIC

DARTWIC is a controls and data acquisition platform. This repository contains its public client libraries, SDK source, documentation, and release notes. The application implementation is closed source.

## Getting started

Download the Engine and Interface from [GitHub Releases](https://github.com/kemptonburton/dartwic-public/releases), then explore the examples:

- [Example workspace](https://github.com/kemptonburton/dartwic-example-workspace) — run a simulated test stand and follow the walkthroughs.
- [Example plugin](https://github.com/kemptonburton/dartwic-example-plugin) — start building Engine and Interface extensions with bundled SDKs.

Follow each repository's README for setup and compatible versions.

## Repository contents

| Folder | Contents |
| --- | --- |
| `sdk/` | Engine, Interface, and Engine Protocol SDK source. |
| [`clients/`](clients/README.md) | Standalone Python, Node.js, React, C++, and C++ TEMPEST peer clients. |
| `docs/Website/docs/` | Current documentation. |
| `docs/Website/releases/` | Release notes and attachments. |
| `media/readme/` | Screenshots used by the private application repository's main README. |

Each client folder includes its DARTWIC transport sources and install/build metadata. Download only the client you need and follow its README; third-party dependencies still need to be installed.

Each client and SDK has its own version tag, such as `python-client-v2.0.0` or `engine-sdk-v2.1.0`. Clone the tag for the exact source you need. Versioned ZIPs are also available on [GitHub Releases](https://github.com/kemptonburton/dartwic-public/releases).

The documentation folders contain the latest content. Git history and release tags preserve earlier revisions.

## Documentation

- [Documentation](https://kemptonburton.com/docs)
- [Release notes](https://kemptonburton.com/releases)
