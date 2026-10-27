---
title: EngineProtocol
summary: Typed application contract over Peer.
created: 2026-10-04T18:31
updated: 2026-10-27T14:24
---

## API

Typed application contract over Peer. No application storage is allocated. Commands wait; telemetry is best effort.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
class EngineProtocol {
public:
    explicit EngineProtocol(TEMPEST::Peer &peer);
    ~EngineProtocol();
    EngineProtocol(const EngineProtocol &) = delete;
    EngineProtocol &operator=(const EngineProtocol &) = delete;
    class Channels {
    public:
        void upsert(std::string channel, ChannelFields fields) const;
        void upsert(ChannelChanges changes) const;
        void upsert(ChannelUpsertRequest request) const;
        void remove(std::string channel) const;
        void remove(ChannelRemoveRequest request) const;
        ChannelQueryResult query(ChannelQuery request = {}) const;
        ChannelQueryResult query(std::initializer_list<std::string> channels) const;
        void publishChannelTelemetry(ChannelUpdate update) const;
        void publishChannelTelemetry(ChannelUpdates updates) const;
        void publishSnapshotTelemetry(ChannelSnapshot snapshot) const;
        void setHandlers(ChannelHandlers handlers) const;
    };
    class Argus {
    public:
        std::string publishEventTelemetry(ArgusEvent event) const;
        void publishSnapshotTelemetry(ArgusBoardSnapshot snapshot) const;
        ArgusQueryResult query(ArgusQuery request = {}) const;
        ArgusActionResult updateStatus(std::string event_id,
                                           std::string status) const;
        ArgusActionResult respondToPrompt(std::string event_id,
                                              Value::Object response) const;
        ArgusActionResult releaseHold(std::string event_id,
                                          Value::Object response = {}) const;
        ArgusActionResult remove(std::string event_id) const;
        void setHandlers(ArgusHandlers handlers) const;
    };
    class Logs {
    public:
        std::vector<LogEntry> query(LogQuery request = {}) const;
        std::vector<LogStream> list() const;
        void publishLogTelemetry(LogEntry entry) const;
        void publishLogTelemetry(std::vector<LogEntry> entries) const;
        void setHandlers(LogHandlers handlers) const;
    };
    Channels &channels();
    const Channels &channels() const;
    Argus &argus();
    const Argus &argus() const;
    Logs &logs();
    const Logs &logs() const;
};
```
