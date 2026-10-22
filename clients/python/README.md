# DARTWIC Python Client

Python 3.10+ API for connections, channels, telemetry, and recorded data. This folder includes its TEMPEST transport and installs independently of the private DARTWIC repository.

## Manual installation

Download **Python Client** from the DARTWIC Downloads page and extract the archive. This client is not published on PyPI. In your application's virtual environment, install the extracted directory containing `pyproject.toml`:

```sh
python -m pip install ./dartwic-python-client-2.0.0
```

Replace the path and version with your download, or run `python -m pip install .` from this folder copied from the public repository. Use the same Python environment to run your application. pip installs `pyzmq` automatically. No separate TEMPEST download is required.

## Usage

```python
import os
from dartwic_client import DartwicClient
with DartwicClient() as client:
    client.connect('127.0.0.1', 7000, os.getenv('DARTWIC_PASSWORD', ''))
    print(client.get_channel_keys('pressure'))
    data = client.query_channel_range(['demo_pressure'])
    print(data['channels']['demo_pressure']['values'])
```

After installation, use the same `from dartwic_client import DartwicClient` import for a source checkout or release download. Integer timestamps retain nanosecond precision; optional datetime views have Python datetime precision. Helpers raise on engine errors; `operation` preserves the TEMPEST envelope and supports every engine operation. See **Clients → Python Client** on the website for lifecycle, telemetry, dataframes, and generated reference documentation.

The transport's dedicated authenticated heartbeat checks session liveness independently of ordinary operation backlog. Compatibility is checked on connect. Heartbeats do not establish task timing or data freshness.
