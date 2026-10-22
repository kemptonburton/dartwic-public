#pragma once

#include <atomic>
#include <chrono>
#include <cstddef>
#include <functional>
#include <memory>
#include <nlohmann/json.hpp>
#include <stdexcept>
#include <string>
#include <vector>

namespace TEMPEST::Client {

class ClientError : public std::runtime_error {
    using std::runtime_error::runtime_error;
};
class DisconnectedError : public ClientError {
    using ClientError::ClientError;
};
class RequestTimeoutError : public ClientError {
    using ClientError::ClientError;
};
class QueueFullError : public ClientError {
    using ClientError::ClientError;
};
class WireError : public ClientError {
    using ClientError::ClientError;
};

enum class ConnectionState {
    Disconnected,
    Connecting,
    Connected,
    Reconnecting,
    Stopping
};

struct TopicMessage {
    std::string sender;
    std::string topic;
    bool error = false;
    nlohmann::json payload = nlohmann::json::object();
    std::uint64_t timestamp = 0;
};

struct ConnectionConfig {
    std::string host = "127.0.0.1";
    int base_port = 7200;
    std::string password = "admin";
    nlohmann::json registration = nlohmann::json::object();
    std::vector<std::string> topics;
    std::chrono::milliseconds heartbeat_interval{1000};
    std::chrono::milliseconds heartbeat_timeout{5000};
    std::chrono::milliseconds reconnect_initial_delay{100};
    std::chrono::milliseconds reconnect_max_delay{5000};
    std::size_t max_queued_operations = 4096;
    // Wrappers may use a registered operation to detect server-side session expiry.
    std::string heartbeat_operation = "heartbeat";
};

struct ConnectionCallbacks {
    std::function<void(TopicMessage)> on_topic;
    std::function<void(ConnectionState, std::string)> on_state;
};

/**
 * Lightweight client-side TEMPEST connection.
 *
 * The operation DEALER, telemetry SUB, and heartbeat DEALER are each confined
 * to their owning worker thread. Callers may issue operations concurrently;
 * they are serialized through a bounded queue onto the persistent operation
 * socket. Topic callbacks run on the SUB worker and should return promptly.
 */
class ClientConnection {
public:
    explicit ClientConnection(ConnectionConfig config);
    ~ClientConnection();

    ClientConnection(const ClientConnection&) = delete;
    ClientConnection& operator=(const ClientConnection&) = delete;

    void start(ConnectionCallbacks callbacks);
    void stop();

    nlohmann::json request(
        std::string operation,
        nlohmann::json payload,
        std::chrono::milliseconds timeout = std::chrono::milliseconds{5000}
    );

    bool connected() const noexcept;
    ConnectionState state() const noexcept;
    std::string clientId() const;

private:
    struct Impl;
    std::unique_ptr<Impl> impl_;
};

} // namespace TEMPEST::Client
