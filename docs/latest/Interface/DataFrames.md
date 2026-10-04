---
updated: 2026-06-23
created: 2026-06-23
---

DataFrames are named historical groupings for recorded channel data. They help operators and analysts find a set of related recorded channels without searching the entire channel history.

# What A DataFrame Is

A channel can carry a `data_frame` field. When DARTWIC records history for that channel, the dataframe name becomes a useful grouping for search, export, and review.

Use DataFrames when:

- you need recorded channels from the same run, device, test, subsystem, or workflow
- you want to open a related set of channels in the telemetry exporter
- you need to see which configured channels are recording and which are not
- you need to clean up old recorded data for a known group

# Search Results

The DataFrames page searches recorded and configured dataframe names through the engine.

Each result should help answer:

| Field | Meaning |
| --- | --- |
| dataframe name | The grouping name stored on channel metadata or recorded data. |
| recorded channel count | Channels that have historical samples in this dataframe. |
| configured channel count | Live or configured channels currently assigned to this dataframe. |
| oldest sample | Earliest recorded sample found for the dataframe. |
| newest sample | Latest recorded sample found for the dataframe. |
| status | Whether the dataframe is active, pending recording, or historical only. |

# Statuses

| Status | Meaning |
| --- | --- |
| active | At least one configured channel also has recorded data in this dataframe. |
| configured only | Channels are assigned to the dataframe, but no recorded samples were found yet. |
| recorded only | Historical data exists, but the matching channels are not currently configured or live. |
| empty or missing | No configured channel or recorded sample matched the search. |

These distinctions matter. A live channel can exist without history, and historical data can exist after the channel is no longer present in the running project.

# Detail View

Open a dataframe to inspect the channels inside it.

The detail view is used for:

- comparing recorded channels and configured channels
- opening selected channels in the telemetry exporter
- assigning selected live channels to a dataframe
- checking timestamp coverage before export
- removing recorded data for selected recorded channels when cleanup is intentional

Large dataframes are displayed in a windowed list so the interface stays usable. If only part of a long dataframe is visible, that is expected; search, filter, or scroll instead of assuming the dataset is small.

# Practical Workflow

1. Search for the dataframe by run, subsystem, device, or test name.
2. Open the dataframe detail view.
3. Confirm the channels you expect are recorded, configured, or both.
4. Query a small time range in the telemetry exporter.
5. Widen the range or export CSV only after the sample shape looks right.

# Read More

- [Telemetry Exporter](Telemetry%20Exporter.md)
- [Exporting Data](Exporting%20Data.md)
- [Channel Search](Channel%20Search.md)
- [Telemetry and History](../Engine/Telemetry%20and%20History.md)
- [Channels](../Engine/Channels.md)
