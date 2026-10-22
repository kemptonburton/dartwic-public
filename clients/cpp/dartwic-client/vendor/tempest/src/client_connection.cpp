#include <tempest/client/ClientConnection.h>
#include <tempest/client/Wire.h>
#include <tempest/client/InternalVersions.h>

#include <algorithm>
#include <condition_variable>
#include <deque>
#include <exception>
#include <mutex>
#include <optional>
#include <thread>
#include <utility>
#include <zmq.hpp>

namespace TEMPEST::Client {
namespace {

std::uint64_t nowMs() {
    return static_cast<std::uint64_t>(std::chrono::duration_cast<std::chrono::milliseconds>(
        std::chrono::system_clock::now().time_since_epoch()).count());
}

} // namespace

struct ClientConnection::Impl {
    struct OperationJob {
        std::string client_id;
        std::string name;
        nlohmann::json payload;
        std::chrono::milliseconds timeout{5000};
        bool requires_connection = true;
        std::mutex mutex;
        std::condition_variable cv;
        bool completed = false;
        std::optional<nlohmann::json> result;
        std::exception_ptr error;
    };

    explicit Impl(ConnectionConfig value)
        : config(std::move(value)),
          operation_endpoint("tcp://" + config.host + ":" + std::to_string(config.base_port)),
          telemetry_endpoint("tcp://" + config.host + ":" + std::to_string(config.base_port + 1)) {
        if (config.max_queued_operations == 0) {
            throw std::invalid_argument("TEMPEST client operation queue capacity must be positive.");
        }
    }

    ConnectionConfig config;
    const std::string operation_endpoint;
    const std::string telemetry_endpoint;
    zmq::context_t context{1};

    mutable std::mutex state_mutex;
    ConnectionCallbacks callbacks;
    std::string client_id;
    std::string session_token;
    ConnectionState connection_state = ConnectionState::Disconnected;
    std::atomic<bool> running{false};
    std::atomic<bool> is_connected{false};
    std::atomic<std::uint64_t> socket_generation{1};

    std::mutex queue_mutex;
    std::condition_variable queue_cv;
    std::deque<std::shared_ptr<OperationJob>> operation_queue;
    std::atomic<bool> operation_running{false};
    std::thread operation_thread;
    std::thread telemetry_thread;
    std::thread heartbeat_thread;

    void notify(ConnectionState state, std::string message) {
        std::function<void(ConnectionState, std::string)> callback;
        {
            std::scoped_lock lock(state_mutex);
            connection_state = state;
            callback = callbacks.on_state;
        }
        if (callback) callback(state, std::move(message));
    }

    std::string currentClientId() const {
        std::scoped_lock lock(state_mutex);
        return client_id;
    }
    std::string currentSessionToken() const {
        std::scoped_lock lock(state_mutex);
        return session_token;
    }

    std::function<void(TopicMessage)> topicCallback() const {
        std::scoped_lock lock(state_mutex);
        return callbacks.on_topic;
    }

    std::unique_ptr<zmq::socket_t> makeDealer() {
        auto socket = std::make_unique<zmq::socket_t>(context, ZMQ_DEALER);
        socket->set(zmq::sockopt::linger, 0);
        socket->connect(operation_endpoint);
        return socket;
    }

    static nlohmann::json operationOnSocket(
        zmq::socket_t& socket,
        const std::string& client,
        const std::string& token,
        const std::string& name,
        const nlohmann::json& payload,
        std::chrono::milliseconds timeout,
        const std::atomic<bool>* keep_running
    ) {
        const auto timeout_count = static_cast<int>(std::max<std::int64_t>(1, timeout.count()));
        socket.set(zmq::sockopt::rcvtimeo, std::min(timeout_count, 50));
        socket.set(zmq::sockopt::sndtimeo, std::min(timeout_count, 250));
        const auto encoded = Wire::encode({client, name, payload, nowMs(), token}).dump();
        if (!socket.send(zmq::buffer(encoded), zmq::send_flags::none)) {
            throw DisconnectedError("TEMPEST operation send failed: " + name);
        }
        const auto deadline = std::chrono::steady_clock::now() + timeout;
        zmq::message_t message;
        while (!socket.recv(message, zmq::recv_flags::none)) {
            if (keep_running && !keep_running->load()) {
                throw DisconnectedError("TEMPEST operation canceled: " + name);
            }
            if (std::chrono::steady_clock::now() >= deadline) {
                throw RequestTimeoutError("TEMPEST operation timed out: " + name);
            }
        }
        nlohmann::json response;
        try {
            response = nlohmann::json::parse(message.to_string());
        } catch (const std::exception& error) {
            throw WireError(std::string("Invalid TEMPEST response: ") + error.what());
        }
        const auto decoded = Wire::decodeOperationResponse(response);
        if (decoded.error) {
            throw ClientError(decoded.payload
                .value("error", "TEMPEST operation failed."));
        }
        return decoded.payload;
    }

    static void complete(
        const std::shared_ptr<OperationJob>& job,
        std::optional<nlohmann::json> result,
        std::exception_ptr error = {}
    ) {
        {
            std::scoped_lock lock(job->mutex);
            job->result = std::move(result);
            job->error = std::move(error);
            job->completed = true;
        }
        job->cv.notify_all();
    }

    void startOperationWorker() {
        operation_running.store(true);
        operation_thread = std::thread([this] { operationLoop(); });
    }

    void stopOperationWorker() {
        if (!operation_running.exchange(false)) return;
        std::deque<std::shared_ptr<OperationJob>> abandoned;
        {
            std::scoped_lock lock(queue_mutex);
            abandoned.swap(operation_queue);
        }
        const auto error = std::make_exception_ptr(
            DisconnectedError("TEMPEST operation worker stopped."));
        for (const auto& job : abandoned) complete(job, std::nullopt, error);
        queue_cv.notify_all();
        if (operation_thread.joinable()) operation_thread.join();
    }

    void operationLoop() {
        std::unique_ptr<zmq::socket_t> socket;
        std::uint64_t generation = 0;
        while (operation_running.load()) {
            std::shared_ptr<OperationJob> job;
            {
                std::unique_lock lock(queue_mutex);
                queue_cv.wait(lock, [&] {
                    return !operation_running.load() || !operation_queue.empty();
                });
                if (!operation_running.load()) break;
                job = std::move(operation_queue.front());
                operation_queue.pop_front();
            }
            if (job->requires_connection && !is_connected.load()) {
                complete(job, std::nullopt, std::make_exception_ptr(
                    DisconnectedError("TEMPEST disconnected before sending an operation.")));
                continue;
            }
            try {
                const auto requested_generation = socket_generation.load(std::memory_order_acquire);
                if (!socket || generation != requested_generation) {
                    socket = makeDealer();
                    generation = requested_generation;
                }
                complete(job, operationOnSocket(
                    *socket, job->client_id, currentSessionToken(), job->name, job->payload, job->timeout,
                    &operation_running));
            } catch (...) {
                const auto error = std::current_exception();
                socket.reset();
                if (job->requires_connection) markDisconnected("TEMPEST operation failed.");
                complete(job, std::nullopt, error);
            }
        }
    }

    nlohmann::json operation(
        std::string client,
        std::string name,
        nlohmann::json payload,
        std::chrono::milliseconds timeout,
        bool requires_connection
    ) {
        if (!operation_running.load()) {
            throw DisconnectedError("TEMPEST operation worker is not running.");
        }
        if (requires_connection && !is_connected.load()) {
            throw DisconnectedError("TEMPEST client is disconnected.");
        }
        auto job = std::make_shared<OperationJob>();
        job->client_id = std::move(client);
        job->name = std::move(name);
        job->payload = std::move(payload);
        job->timeout = timeout;
        job->requires_connection = requires_connection;
        {
            std::scoped_lock lock(queue_mutex);
            if (!operation_running.load()) {
                throw DisconnectedError("TEMPEST operation worker is not running.");
            }
            if (operation_queue.size() >= config.max_queued_operations) {
                throw QueueFullError("TEMPEST operation queue is full.");
            }
            operation_queue.push_back(job);
        }
        queue_cv.notify_one();
        std::unique_lock lock(job->mutex);
        job->cv.wait(lock, [&] { return job->completed || !operation_running.load(); });
        if (!job->completed) throw DisconnectedError("TEMPEST operation worker stopped.");
        if (job->error) std::rethrow_exception(job->error);
        return std::move(*job->result);
    }

    void registerClient() {
        auto registration = config.registration.is_object()
            ? config.registration
            : nlohmann::json::object();
        registration["serverPassword"] = config.password;
        registration["tempestCompatibilityVersion"] = TEMPEST::Client::COMPATIBILITY_VERSION;
        if (!registration.contains("username")) registration["username"] = "tempest-client";
        const auto response = operation(
            {}, "register_client", std::move(registration),
            std::chrono::milliseconds{5000}, false);
        auto id = response.value("clientId", std::string{});
        if (id.empty()) {
            id = response.value("payload", nlohmann::json::object())
                .value("clientId", std::string{});
        }
        if (id.empty()) throw WireError("TEMPEST registration did not return a client id.");
        std::scoped_lock lock(state_mutex);
        client_id = std::move(id);
        session_token = response.value("sessionToken", std::string{});
    }

    void markDisconnected(std::string reason) {
        if (!is_connected.exchange(false)) return;
        socket_generation.fetch_add(1, std::memory_order_release);
        notify(ConnectionState::Reconnecting, std::move(reason));
    }

    void telemetryLoop() {
        zmq::socket_t socket(context, ZMQ_SUB);
        socket.set(zmq::sockopt::linger, 0);
        socket.set(zmq::sockopt::rcvtimeo, 250);
        socket.connect(telemetry_endpoint);
        for (const auto& topic : config.topics) {
            socket.set(zmq::sockopt::subscribe, topic);
        }
        while (running.load()) {
            try {
                zmq::message_t topic_frame;
                zmq::message_t payload_frame;
                if (!socket.recv(topic_frame, zmq::recv_flags::none)) continue;
                if (!socket.recv(payload_frame, zmq::recv_flags::none)) continue;
                const auto wire = nlohmann::json::parse(payload_frame.to_string());
                const auto decoded = Wire::decodeTelemetry(wire, topic_frame.to_string());
                if (decoded.payload.is_object()) {
                    const auto target = decoded.payload.value("client_id", std::string{});
                    if (!target.empty() && target != currentClientId()) continue;
                }
                TopicMessage message{
                    decoded.sender,
                    decoded.topic,
                    decoded.error,
                    decoded.payload,
                    decoded.timestamp
                };
                if (auto callback = topicCallback()) callback(std::move(message));
            } catch (...) {
                if (!running.load()) break;
            }
        }
    }

    void heartbeatLoop() {
        auto delay = config.reconnect_initial_delay;
        std::unique_ptr<zmq::socket_t> socket;
        while (running.load()) {
            if (is_connected.load()) {
                try {
                    if (!socket) socket = makeDealer();
                    operationOnSocket(
                        *socket, currentClientId(), currentSessionToken(), config.heartbeat_operation, nlohmann::json::object(),
                        config.heartbeat_timeout, &running);
                } catch (...) {
                    socket.reset();
                    markDisconnected("TEMPEST heartbeat failed.");
                }
                interruptibleWait(config.heartbeat_interval);
                continue;
            }
            socket.reset();
            interruptibleWait(delay);
            if (!running.load()) break;
            try {
                registerClient();
                is_connected.store(true);
                delay = config.reconnect_initial_delay;
                notify(ConnectionState::Connected, {});
            } catch (...) {
                delay = std::min(delay * 2, config.reconnect_max_delay);
                notify(ConnectionState::Reconnecting, "TEMPEST reconnect attempt failed.");
            }
        }
    }

    void interruptibleWait(std::chrono::milliseconds duration) const {
        for (auto elapsed = std::chrono::milliseconds{0};
             elapsed < duration && running.load();
             elapsed += std::chrono::milliseconds{25}) {
            std::this_thread::sleep_for(std::min(std::chrono::milliseconds{25}, duration - elapsed));
        }
    }

    void start(ConnectionCallbacks value) {
        if (running.exchange(true)) return;
        {
            std::scoped_lock lock(state_mutex);
            callbacks = std::move(value);
        }
        notify(ConnectionState::Connecting, {});
        startOperationWorker();
        try {
            registerClient();
        } catch (...) {
            running.store(false);
            stopOperationWorker();
            notify(ConnectionState::Disconnected, "TEMPEST registration failed.");
            throw;
        }
        is_connected.store(true);
        telemetry_thread = std::thread([this] { telemetryLoop(); });
        heartbeat_thread = std::thread([this] { heartbeatLoop(); });
        notify(ConnectionState::Connected, {});
    }

    void stop() {
        if (!running.exchange(false)) return;
        notify(ConnectionState::Stopping, {});
        is_connected.store(false);
        if (telemetry_thread.joinable()) telemetry_thread.join();
        if (heartbeat_thread.joinable()) heartbeat_thread.join();
        const auto id = currentClientId();
        if (!id.empty()) {
            try {
                operation(id, "unregister_client", nlohmann::json::object(),
                    std::chrono::milliseconds{500}, false);
            } catch (...) {
            }
        }
        stopOperationWorker();
        {
            std::scoped_lock lock(state_mutex);
            client_id.clear();
            session_token.clear();
        }
        notify(ConnectionState::Disconnected, {});
        std::scoped_lock lock(state_mutex);
        callbacks = {};
    }
};

ClientConnection::ClientConnection(ConnectionConfig config)
    : impl_(std::make_unique<Impl>(std::move(config))) {}

ClientConnection::~ClientConnection() {
    stop();
}

void ClientConnection::start(ConnectionCallbacks callbacks) {
    impl_->start(std::move(callbacks));
}

void ClientConnection::stop() {
    if (impl_) impl_->stop();
}

nlohmann::json ClientConnection::request(
    std::string operation,
    nlohmann::json payload,
    std::chrono::milliseconds timeout
) {
    return impl_->operation(
        impl_->currentClientId(), std::move(operation), std::move(payload), timeout, true);
}

bool ClientConnection::connected() const noexcept {
    return impl_->is_connected.load();
}

ConnectionState ClientConnection::state() const noexcept {
    std::scoped_lock lock(impl_->state_mutex);
    return impl_->connection_state;
}

std::string ClientConnection::clientId() const {
    return impl_->currentClientId();
}

} // namespace TEMPEST::Client
