---
title: EngineProtocol
summary: Typed channel and ARGUS operations composed over an existing Peer.
created: 2026-09-26T01:43
updated: 2026-09-29T17:19
---

## API

Typed channel and ARGUS operations composed over an existing Peer. Construct before Peer.start; Peer owns transport and lifecycle. Operations wait for completion; telemetry is best effort.

Namespace: `DARTWIC`.

```cpp
#include <dartwic/EngineProtocol.h>
```

## Declaration

```cpp
class EngineProtocol {
public:
    explicit EngineProtocol(TEMPEST::Peer& peer);
    ~EngineProtocol();
    EngineProtocol(const EngineProtocol&) = delete;
    EngineProtocol& operator=(const EngineProtocol&) = delete;
    // Channel commands, snapshot queries and telemetry. Publish reports state without acknowledgement; upsert/remove/upsertBulk wait for the remote handler.
    class Channels {
    public:
        void upsert(ChannelUpsert request) const;
        void remove(ChannelRemove request) const;
        void upsertBulk(ChannelBulkUpsert request) const;
        ChannelQueryResult query(ChannelQuery request = {}) const;
        void publishTelemetry(ChannelTelemetry telemetry) const;
        void publishTelemetry(FixedGenerationTelemetry telemetry) const;
        void setHandlers(ChannelHandlers handlers) const;
    };
    // Event publication, queries and owner-directed actions. Prompt callbacks run on the operation worker when a response arrives.
    class Argus {
    public:
        void message(ArgusEvent event) const;
        void warning(ArgusEvent event) const;
        void error(ArgusEvent event) const;
        void abort(ArgusEvent event) const;
        void hold(ArgusEvent event) const;
        std::string prompt(ArgusEvent event, std::function<void(const ArgusAction&)> response = {}) const;
        void respond(std::string event_id, /** Map typed telemetry to its application object. */
        Value::Object payload) const;
        void updateStatus(std::string event_id, std::string status) const;
        void releaseHold(std::string event_id, /** Map typed telemetry to its application object. */
        Value::Object payload = {}) const;
        void remove(std::string event_id) const;
        ArgusQueryResult query(ArgusQuery request = {}) const;
        void publishTelemetry(ArgusEventTelemetry telemetry) const;
        void setHandlers(ArgusHandlers handlers) const;
    };
    // Query and publish named text streams. The receiver persists telemetry locally.
    class Logs {
    public:
        // Queries bounded log history from the peer, including optional UTC time filters.
        std::vector<LogEntry> query(LogQuery request = {}) const;
        // Lists the peer's available node/session/stream combinations.
        std::vector<LogStream> list() const;
        // Publishes one timestamped log entry to the peer.
        void publish(LogEntry entry) const;
        // Publishes a batch of timestamped log entries to the peer.
        void publishBatch(std::vector<LogEntry> entries) const;
        void setHandlers(LogHandlers handlers) const;
    };
    Channels& channels();
    const Channels& channels() const;
    Argus& argus();
    const Argus& argus() const;
    Logs& logs();
    const Logs& logs() const;
};
```
