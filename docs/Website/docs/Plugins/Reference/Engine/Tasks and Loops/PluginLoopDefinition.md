---
title: "PluginLoopDefinition"
summary: "Lifecycle callbacks and optional target frequency for a plugin-owned loop."
---

The loop is controlled by CAESAR and stops with the engine.

## Declaration

```cpp
struct PluginLoopDefinition {
        std::function<void()> on_start;
        std::function<void()> on_loop;
        std::function<void()> on_end;
        std::optional<double> target_frequency_hz;
    };
```

## Example

```cpp
dartwic->registerLoop("heartbeat", "Heartbeat", {
    .on_loop = []() { publishHeartbeat(); },
    .target_frequency_hz = 10.0,
});
```
