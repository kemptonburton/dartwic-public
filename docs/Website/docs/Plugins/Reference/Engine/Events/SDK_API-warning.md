---
title: SDK_API::warning
summary: Report an ARGUS warning using the same arguments and defaults as DCode.
created: 2026-10-28T22:20
updated: 2026-10-28T22:24
---

Reports synchronously to the in-memory event path; recording and telemetry are asynchronous. Does not stop tasks, command equipment, or wait for acknowledgement. May allocate and lock. Invalid arguments or host failures throw; a numeric result is not an event ID or durability guarantee.

## Declaration

```cpp
virtual int warning(const std::string& title, const std::string& description,
            nlohmann::json channels = nlohmann::json::array(), const std::string& resolution = "",
            int auto_acknowledge = 0,
            double firing_timeout_seconds = 5, const std::string& system = "SOFTWARE",
            const std::string& subsystem = "DCODE") {
            return reportEvent("warning", title, description, channels, resolution, auto_acknowledge,
                firing_timeout_seconds, system, subsystem);
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `title` | Event identity within system/subsystem; use distinct titles for distinct modules. |
| `description` | Operator-facing body text. |
| `channels` | Flat series or nested graph groups, including \|channel\|@1 and >100@1. |
| `resolution` | Recommended operator action. |
| `auto_acknowledge` | Seconds before visual acknowledgement; zero disables it. |
| `firing_timeout_seconds` | Finite nonnegative inactivity timeout; defaults to 5. Zero requires stop_event_firing. |
| `system` | ARGUS system grouping; defaults to SOFTWARE. |
| `subsystem` | ARGUS subsystem grouping; defaults to DCODE, matching DCode. |

## Returns

Numeric host result, normally 1; not an event ID.

## Example

```cpp
api.warning("Device connection", "Device disconnected", {"|temperature|"}, "Check connection", 0, 5);
```
