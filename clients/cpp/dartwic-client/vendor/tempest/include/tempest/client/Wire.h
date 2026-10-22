#pragma once

#include <cstdint>
#include <nlohmann/json.hpp>
#include <string>

namespace TEMPEST::Client::Wire {

struct OperationRequest {
    std::string client_id;
    std::string operation;
    nlohmann::json payload = nlohmann::json::object();
    std::uint64_t timestamp = 0;
    std::string session_token;
};

struct OperationResponse {
    std::string client_id;
    std::string operation;
    bool error = false;
    nlohmann::json payload = nlohmann::json::object();
    std::uint64_t timestamp = 0;
};

struct TelemetryEnvelope {
    std::string sender;
    std::string topic;
    bool error = false;
    nlohmann::json payload = nlohmann::json::object();
    std::uint64_t timestamp = 0;
};

inline nlohmann::json encode(const OperationRequest& value) {
    return {
        {"clientId", value.client_id},
        {"name", value.operation},
        {"payload", value.payload},
        {"timestamp", value.timestamp},
        {"sessionToken", value.session_token}
    };
}

inline OperationResponse decodeOperationResponse(const nlohmann::json& value) {
    return {
        value.value("clientId", std::string{}),
        value.value("name", std::string{}),
        value.value("error", false),
        value.value("payload", nlohmann::json::object()),
        value.value("timestamp", std::uint64_t{0})
    };
}

inline TelemetryEnvelope decodeTelemetry(
    const nlohmann::json& value,
    std::string received_topic = {}
) {
    return {
        value.value("sender", std::string{}),
        value.value("topic", std::move(received_topic)),
        value.value("error", false),
        value.value("payload", value),
        value.value("timestamp", std::uint64_t{0})
    };
}

} // namespace TEMPEST::Client::Wire
