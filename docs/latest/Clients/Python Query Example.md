---
updated: 2026-06-23
created: 2026-06-23
---

This example shows the normal Python workflow: connect, find the data, and query a bounded range.

# Example

```python
from dartwic_client import DartwicClient

client = DartwicClient()
client.connect(ip="127.0.0.1", port=7000, password="")

frames = client.search_channel_dataframes(query="engine", limit=10)
keys = client.get_channel_keys(query="rpm", limit=25)

result = client.query_channel_range(
    series="engine/rpm/value",
    from_timestamp=1714600000,
    to_timestamp=1714603600,
    bucket_count=500,
)

print(result["points"])
client.disconnect()
```

# Why This Shape Works

- it confirms connectivity first
- it narrows the dataset before the range query
- it uses bucketing for a practical export size

# Related Reading

- [Python Client](Python%20Client.md)
- [Python Client Reference](Reference/Python/Overview.md)
- [Telemetry Exporter](../Interface/Telemetry%20Exporter.md)
- [Telemetry and History](../Engine/Telemetry%20and%20History.md)
