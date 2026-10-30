---
title: "SDK_API::stop_event_firing"
summary: "End the locally owned event's current firing without resolving or deleting it. Synchronous state and declared-event reactions complete before return; persistence and telemetry remain asynchronous. Repeated or absent stops return false."
---

## Declaration

```cpp
virtual bool stop_event_firing(const std::string& title, const std::string& system = "SOFTWARE",
            const std::string& subsystem = "DCODE") { return false; }
```

## Parameters

| Name | Description |
| --- | --- |
| `title` | Event title. |
| `system` | Event system. |
| `subsystem` | Event subsystem. |
