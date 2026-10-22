#include <tempest/Peer.h>
#include <algorithm>
#include <atomic>
#include <condition_variable>
#include <deque>
#include <future>
#include <iostream>
#include <limits>
#include <mutex>
#include <thread>

using namespace std::chrono_literals;
namespace {
void require(bool value, const char* description) {
    if (!value) throw std::runtime_error(description);
}

// A custom transport with no encoding, socket library or JSON dependency.
class MemoryTransport final : public TEMPEST::Transport {
public:
    std::weak_ptr<MemoryTransport> remote;
    std::atomic<bool> drop_telemetry{false};
    ~MemoryTransport() override { stop(); }
    void start(TEMPEST::TransportCallbacks value) override {
        { std::lock_guard lock(mutex); callbacks = std::move(value); running = true; }
        worker = std::thread([this] {
            std::unique_lock lock(mutex);
            while (running) {
                cv.wait(lock, [&] { return !running || !queue.empty(); });
                if (!running) break;
                auto message = std::move(queue.front()); queue.pop_front();
                auto callback = callbacks.on_message;
                lock.unlock();
                try { callback(std::move(message)); } catch (...) {}
                lock.lock();
            }
        });
        callbacks.on_state(TEMPEST::ConnectionState::Connected, {});
    }
    void send(TEMPEST::Message message) override {
        if (drop_telemetry && message.kind == TEMPEST::Message::Kind::Telemetry) return;
        auto target = remote.lock();
        if (!target) throw TEMPEST::DisconnectedError("Memory transport disconnected.");
        { std::lock_guard lock(target->mutex);
          if (!target->running) return;
          target->queue.push_back(std::move(message)); }
        target->cv.notify_one();
    }
    void stop() override {
        { std::lock_guard lock(mutex); running = false; queue.clear(); }
        cv.notify_all();
        if (worker.joinable()) worker.join();
        std::lock_guard lock(mutex); callbacks = {};
    }
private:
    std::mutex mutex;
    std::condition_variable cv;
    bool running = false;
    std::deque<TEMPEST::Message> queue;
    TEMPEST::TransportCallbacks callbacks;
    std::thread worker;
};
}

int main() {
    try {
        auto left = std::make_shared<MemoryTransport>();
        auto right = std::make_shared<MemoryTransport>();
        left->remote = right; right->remote = left;
        TEMPEST::Peer a({.node_name="a", .peer_id="tempest.peer", .protocol_id="tempest.peer", .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, left);
        TEMPEST::Peer b({.node_name="b", .peer_id="tempest.peer", .protocol_id="tempest.peer", .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, right);
        std::atomic<int> calls{0};
        b.registerOperation("echo", [&](const auto& args) { ++calls; return args; });
        a.registerOperation("reverse", [](const auto& args) { return args; });
        b.registerOperation("slow", [](const auto&) { std::this_thread::sleep_for(350ms); return TEMPEST::Value::Object{}; });
        b.registerOperation("failure", [](const auto&) -> TEMPEST::Value::Object {
            throw TEMPEST::RemoteError("bad arguments", "validation_error");
        });
        b.registerTelemetry({.topic = "status", .display_name = "Status", .description = "Current status", .category = "Example"});
        b.setTelemetryCatalogProvider([] {
            return std::vector<TEMPEST::TelemetryDescriptor>{
                {.topic = "engine/health", .category = "Engine"},
                {.topic = "status", .category = "Incorrect fallback"}};
        });
        a.start(); b.start(); a.waitUntilReady(); b.waitUntilReady();
        const auto catalog = a.call("tempest/operations/list").at("operations").array();
        require(std::any_of(catalog.begin(), catalog.end(), [](const auto& entry) {
            return entry.object().at("name") == TEMPEST::Value{"echo"};
        }), "registered command appears in catalog");
        const auto telemetry_catalog = a.call("tempest/telemetry/list").at("telemetry").array();
        require(std::any_of(telemetry_catalog.begin(), telemetry_catalog.end(), [](const auto& entry) {
            return entry.object().at("topic") == TEMPEST::Value{"status"}
                && entry.object().at("category") == TEMPEST::Value{"Example"};
        }), "declared telemetry appears before publication");
        require(std::any_of(telemetry_catalog.begin(), telemetry_catalog.end(), [](const auto& entry) {
            return entry.object().at("topic") == TEMPEST::Value{"engine/health"};
        }), "host telemetry catalog is visible to remote peers");
        require(a.remoteNode() == "b" && b.remoteNode() == "a", "registration identities");
        const TEMPEST::Value::Object args{
            {"maximum", std::numeric_limits<uint64_t>::max()},
            {"minimum", std::numeric_limits<int64_t>::min()},
            {"nested", TEMPEST::Value::Array{true, "text", TEMPEST::Value::Object{{"x", 1.25}}}}};
        require(a.call("echo", args) == args, "typed round trip");
        require(a.call("echo", args) == args && calls == 2, "identical invocations are distinct");
        require(b.call("reverse", args) == args, "bidirectional requests");
        std::promise<bool> callback;
        a.onTelemetry("status", [&](const auto& values) {
            callback.set_value(values == args && a.call("echo", values) == args);
        });
        b.publish("status", args);
        require(callback.get_future().get(), "telemetry callback can make synchronous request");
        std::promise<bool> fallback;
        a.setTelemetryFallback([&](const std::string& topic, const auto& values) { fallback.set_value(topic=="custom/unregistered-topic" && values==args); });
        b.publish("custom/unregistered-topic", args);
        require(fallback.get_future().get(), "generic telemetry fallback retains name and values");
        const auto observed_telemetry = a.call("tempest/telemetry/list").at("telemetry").array();
        require(std::none_of(observed_telemetry.begin(), observed_telemetry.end(), [](const auto& entry) {
            return entry.object().at("topic") == TEMPEST::Value{"custom/unregistered-topic"};
        }), "unregistered publications do not masquerade as declared telemetry");
        right->drop_telemetry = true;
        require(a.call("echo", args) == args, "operations do not depend on telemetry");
        try { a.call("missing"); require(false, "missing operation must fail"); }
        catch (const TEMPEST::RemoteError& e) { require(e.code() == "unsupported", "unsupported error code"); }
        try { a.call("failure"); require(false, "remote error must propagate"); }
        catch (const TEMPEST::RemoteError& e) { require(e.code() == "validation_error", "remote error code"); }
        try { a.call("slow", {}, 20ms); require(false, "slow request must time out"); }
        catch (const TEMPEST::TimeoutError&) {}
        std::this_thread::sleep_for(400ms);
        require(a.ready() && b.ready(), "heartbeats continue during slow command");
        require(a.call("echo", args) == args, "late reply cannot satisfy another request");
        auto first = std::async(std::launch::async, [&] { return a.call("echo", {{"index", 1}}); });
        auto second = std::async(std::launch::async, [&] { return a.call("echo", {{"index", 2}}); });
        require(first.get().at("index") == TEMPEST::Value(1), "first concurrent result");
        require(second.get().at("index") == TEMPEST::Value(2), "second concurrent result");
        auto pending = std::async(std::launch::async, [&] {
            try { a.call("slow", {}, 5s); return false; }
            catch (const TEMPEST::DisconnectedError&) { return true; }
        });
        std::this_thread::sleep_for(30ms);
        a.stop();
        require(pending.get(), "stop cancels pending requests");
        b.stop();
        auto mismatch_left = std::make_shared<MemoryTransport>();
        auto mismatch_right = std::make_shared<MemoryTransport>();
        mismatch_left->remote = mismatch_right; mismatch_right->remote = mismatch_left;
        TEMPEST::Peer c({.node_name="c", .peer_id="tempest.peer", .protocol_id="tempest.peer",
            .request_timeout=100ms, .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, mismatch_left);
        TEMPEST::Peer d({.node_name="d", .peer_id="other.peer", .protocol_id="tempest.peer",
            .request_timeout=100ms, .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, mismatch_right);
        c.start(); d.start();
        try { c.waitUntilReady(250ms); require(false, "mismatched peer definition must fail registration"); }
        catch (const TEMPEST::TimeoutError&) {}
        c.stop(); d.stop();
        auto version_left = std::make_shared<MemoryTransport>();
        auto version_right = std::make_shared<MemoryTransport>();
        version_left->remote = version_right; version_right->remote = version_left;
        TEMPEST::Peer e({.node_name="e", .peer_id="tempest.peer", .protocol_id="tempest.peer",
            .request_timeout=100ms, .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, version_left);
        TEMPEST::Peer f({.node_name="f", .peer_id="tempest.peer", .peer_version=2, .protocol_id="tempest.peer",
            .request_timeout=100ms, .heartbeat_interval=30ms, .heartbeat_timeout=200ms}, version_right);
        e.start(); f.start();
        try { e.waitUntilReady(250ms); require(false, "unsupported peer version must fail registration"); }
        catch (const TEMPEST::TimeoutError&) {}
        e.stop(); f.stop();
        std::cout << "TEMPEST messaging: typed values, registration, calls, telemetry, errors, deadlines, heartbeats and stop passed\n";
        return 0;
    } catch (const std::exception& e) {
        std::cerr << e.what() << '\n';
        return 1;
    }
}
