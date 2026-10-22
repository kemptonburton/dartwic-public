---
title: "SDK_API::recordEvent"
summary: "Creates or refreshes a correlated ARGUS event from a JSON declaration."
---

Supported fields include type, title, description, resolution, system, subsystem, channels, actions, payload, correlation_key, and auto_acknowledge_seconds. A stable correlation_key updates one event instead of creating a new event for each heartbeat.
Optional `graphs` accepts an array of graph groups. Each group may be an array of shorthand strings or an object with a `series` array and optional `title` / `window_seconds` fields. Shorthand series use `|channel|`, `>value`, `>=value`, `<value`, `<=value`, or `=value` and may append `@1` through `@5` to select a Y axis. Object series accept `channel_reference` (or `expression`) plus `y_axis`, `label`, and `color`. For example: `{"graphs":[["|temperature|@1",">100@1"],["|pressure|@1","=50@2"]]}`.

## Declaration

```cpp
virtual nlohmann::json recordEvent(nlohmann::json event) { return nlohmann::json::object(); }
```

## Parameters

| Name | Description |
| --- | --- |
| `event` | Event declaration to create or refresh. |

## Returns

The complete accepted ARGUS event record.
