---
title: SDK_API::promptNumerical
summary: Block the calling thread until a numerical response arrives.
created: 2026-10-28T22:20
updated: 2026-10-28T22:24
---

Uses the DCode argument order and graph syntax. No firing timeout; completion ends firing. Acknowledgement or stop_event_firing does not complete the wait. May allocate, lock, and wait indefinitely. Unlike a DCode timeline prompt, a C++ SDK call blocks its invoking thread.

## Declaration

```cpp
virtual double promptNumerical(const std::string& title, const std::string& description,
            nlohmann::json channels = nlohmann::json::array(), const std::string& resolution = "",
            int auto_acknowledge = 0, const std::string& system = "SOFTWARE",
            const std::string& subsystem = "DCODE") {
            throw std::runtime_error("ARGUS promptNumerical is not supported by this host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `title` | Workflow title. |
| `description` | Operator-facing body text. |
| `channels` | Flat series or nested graph groups, as in DCode. |
| `resolution` | Recommended operator action. |
| `auto_acknowledge` | Seconds before visual acknowledgement; zero disables it. |
| `system` | ARGUS system grouping; defaults to SOFTWARE. |
| `subsystem` | ARGUS subsystem grouping; defaults to DCODE. |

## Returns

Operator numeric response. Unsupported hosts and workflow failures throw.
