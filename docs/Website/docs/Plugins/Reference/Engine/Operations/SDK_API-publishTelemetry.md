---
title: "SDK_API::publishTelemetry"
summary: "Publishes telemetry on a plugin-qualified topic to connected clients and peers. Delivery is best effort; subscribers may miss samples while disconnected."
---

## Declaration

```cpp
virtual void publishTelemetry(const std::string& topic, const nlohmann::json& payload) {
            throw std::runtime_error("TEMPEST telemetry is unavailable in this SDK host.");
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `topic` | Plugin-local topic name. |
| `payload` | Object containing the telemetry values. |
