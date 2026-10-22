---
title: "Channels and Persistence"
summary: "Read, write, search, and persist channel data and channel definitions."
---

| Operation | Description |
| --- | --- |
| [`argus/history/start`](argus/history/start.md) | Queries event and log history in a detached job. |
| [`rapid/audit-channel-impact`](rapid/audit-channel-impact.md) | Audits channel ownership and project references before a channel, task, |
| [`rapid/channel-export-start`](rapid/channel-export-start.md) | Starts a client-owned background CSV export of raw channel samples. |
| [`rapid/dataframes/channels`](rapid/dataframes/channels.md) | Lists recorded channels overlapping one saved view. Counts are loaded only for the requested page. |
| [`rapid/dataframes/create`](rapid/dataframes/create.md) | Creates a historical dataframe from a recording selection. |
| [`rapid/dataframes/create-sample`](rapid/dataframes/create-sample.md) | Creates sample recordings, events, logs and historical dataframes. |
| [`rapid/dataframes/export-start`](rapid/dataframes/export-start.md) | Starts a cancellable ZIP export of a dataframe's selected records. |
| [`rapid/dataframes/get`](rapid/dataframes/get.md) | Returns a test dataframe. |
| [`rapid/dataframes/list`](rapid/dataframes/list.md) | Lists managed test dataframes. Pages are ordered by start time, then ID. Overview mode covers the full requested range without returning full frame records. |
| [`rapid/dataframes/remove`](rapid/dataframes/remove.md) | Removes a stored dataframe definition. |
| [`rapid/dataframes/start`](rapid/dataframes/start.md) | Starts a saved dataframe view at the engine clock. |
| [`rapid/dataframes/statistics-start`](rapid/dataframes/statistics-start.md) | Counts a saved dataframe and estimates logical recording payload size without reading channel sample values or formatting an export. |
| [`rapid/dataframes/stop`](rapid/dataframes/stop.md) | Closes a saved dataframe view at the engine clock. |
| [`rapid/dataframes/update`](rapid/dataframes/update.md) | Updates a stored historical dataframe selection. |
| [`rapid/delete-channel`](rapid/delete-channel.md) | Deletes channel. |
| [`rapid/delete-channels`](rapid/delete-channels.md) | Deletes multiple local channels in one protected RAPID configuration transaction. |
| [`rapid/get-channel-field-config`](rapid/get-channel-field-config.md) | Returns channel field config. |
| [`rapid/get-channel-keys`](rapid/get-channel-keys.md) | Returns channel keys. |
| [`rapid/get-channels-data`](rapid/get-channels-data.md) | Returns channels data. |
| [`rapid/get-fixed-configuration`](rapid/get-fixed-configuration.md) | Returns RAPID fixed-channel configuration and protection state. |
| [`rapid/get-persistence-diagnostics`](rapid/get-persistence-diagnostics.md) | Returns persistence diagnostics. |
| [`rapid/history/channels`](rapid/history/channels.md) | Queries channel history summaries in a detached job. |
| [`rapid/history/configure-retention`](rapid/history/configure-retention.md) | Saves automatic retention policy with nonnegative limits. |
| [`rapid/history/delete-preview`](rapid/history/delete-preview.md) | Builds a history cleanup preview without deleting recordings. |
| [`rapid/history/delete-start`](rapid/history/delete-start.md) | Applies a reviewed history cleanup preview. |
| [`rapid/history/jobs`](rapid/history/jobs.md) | Lists stored cleanup operations and maintenance status. |
| [`rapid/history/resume`](rapid/history/resume.md) | Resumes reclamation for a stored cleanup operation. |
| [`rapid/history/retention`](rapid/history/retention.md) | Reads automatic retention policy. |
| [`rapid/history/stores`](rapid/history/stores.md) | Lists recording stores and their history in a detached job. |
| [`rapid/list-channel-reference-candidates`](rapid/list-channel-reference-candidates.md) | Lists literal channel names used by project resources and live task |
| [`rapid/query-channel-last-recorded`](rapid/query-channel-last-recorded.md) | Queries channel last recorded. |
| [`rapid/query-channel-range`](rapid/query-channel-range.md) | Queries channel range. |
| [`rapid/query-channel-range-start`](rapid/query-channel-range-start.md) | Starts a cancellable, low-priority historical graph query job. |
| [`rapid/search-channel-keys`](rapid/search-channel-keys.md) | Searches channel keys. |
| [`rapid/set-fixed-configuration-sealed`](rapid/set-fixed-configuration-sealed.md) | Opens or protects RAPID's fixed-channel configuration after active task transactions finish. |
| [`rapid/upsert-channel-field`](rapid/upsert-channel-field.md) | Creates or updates a typed channel field. |
