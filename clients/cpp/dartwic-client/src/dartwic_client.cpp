#include <atomic>
#include <dartwic/DartwicClient.h>
#include <map>
#include <mutex>
#include "version.h"
#include <stdexcept>
#include <tempest/client/ClientConnection.h>
#include <thread>

namespace DARTWIC::Client {
namespace {
using json = nlohmann::json;
thread_local const void *callback_owner = nullptr;
void validateNames(const std::vector<std::string> &names) {
  if (names.empty())
    throw std::invalid_argument("At least one channel is required");
  for (const auto &name : names)
    if (name.empty())
      throw std::invalid_argument("Channel names cannot be empty");
}
} // namespace
struct DartwicClient::Impl {
  struct Subscription {
    std::string prefix;
    std::string channel;
    std::function<void(const json &)> handler;
  };
  std::unique_ptr<TEMPEST::Client::ClientConnection> transport;
  std::atomic<bool> ready{false};
  std::mutex mutex;
  std::map<std::uint64_t, Subscription> subscriptions;
  std::uint64_t next = 1;
  std::string connection_error;
  explicit Impl(const ClientConfig &config) {
    TEMPEST::Client::ConnectionConfig wire;
    wire.host = config.host;
    wire.base_port = config.port;
    wire.password = config.password;
    wire.registration = {{"dartwic_client_type", "cpp"},
                         {"dartwic_client_version", DARTWIC_CLIENT_VERSION}};
    wire.topics = {""};
    wire.heartbeat_operation = "dartwic/get-runtime-metadata";
    transport =
        std::make_unique<TEMPEST::Client::ClientConnection>(std::move(wire));
  }
  json payload(const std::string &name, json value = json::object(),
               std::chrono::milliseconds timeout = std::chrono::milliseconds{
                   5000}) {
    return transport->request(name, std::move(value), timeout);
  }
  void state(TEMPEST::Client::ConnectionState state) {
    ready = false;
    if (state != TEMPEST::Client::ConnectionState::Connected)
      return;
    try {
      const auto version = payload("dartwic/get-runtime-metadata")
                               .value("engineVersion", std::string{});
      if (!detail::versionAtLeast(version, DARTWIC_MIN_ENGINE_VERSION))
        throw std::runtime_error(std::string("Engine ") + DARTWIC_MIN_ENGINE_VERSION + " or newer required; got " +
                                 version);
      std::scoped_lock lock(mutex);
      std::map<std::string, bool> restored;
      for (const auto &[id, sub] : subscriptions) {
        if (!sub.channel.empty() && !restored[sub.channel]) {
          payload("dartwic/add-channel-to-telemetry",
                  {{"channel_name", sub.channel}});
          restored[sub.channel] = true;
        }
      }
      connection_error.clear();
      ready = true;
    } catch (const std::exception &error) {
      std::scoped_lock lock(mutex);
      connection_error = error.what();
    }
  }
  void telemetry(TEMPEST::Client::TopicMessage message) {
    std::vector<Subscription> dispatch;
    {
      std::scoped_lock lock(mutex);
      for (const auto &[id, sub] : subscriptions)
        if (sub.channel.empty() ? message.topic.starts_with(sub.prefix)
                                : message.topic == sub.prefix)
          dispatch.push_back(sub);
    }
    const json envelope = {{"sender", message.sender},
                           {"topic", message.topic},
                           {"error", message.error},
                           {"payload", message.payload},
                           {"timestamp", message.timestamp}};
    callback_owner = this;
    for (const auto &sub : dispatch)
      try {
        if (sub.channel.empty()) {
          sub.handler(envelope);
        } else if (message.payload.contains("channels") &&
                   message.payload.at("channels").contains(sub.channel)) {
          sub.handler(message.payload.at("channels").at(sub.channel));
        }
      } catch (...) {
      }
    callback_owner = nullptr;
  }
};
DartwicClient::DartwicClient(ClientConfig config)
    : impl_(std::make_unique<Impl>(config)) {}
DartwicClient::~DartwicClient() { disconnect(); }
void DartwicClient::connect() {
  if (impl_->transport->connected())
    throw std::logic_error("Already connected");
  impl_->transport->start(
      {[this](auto message) { impl_->telemetry(std::move(message)); },
       [this](auto state, auto) { impl_->state(state); }});
  if (!impl_->ready) {
    std::string error;
    {
      std::scoped_lock lock(impl_->mutex);
      error = impl_->connection_error;
    }
    disconnect();
    throw std::runtime_error(error);
  }
}
void DartwicClient::disconnect() {
  if (callback_owner == impl_.get())
    throw std::logic_error("Disconnect outside telemetry callbacks");
  impl_->ready = false;
  impl_->transport->stop();
  std::scoped_lock lock(impl_->mutex);
  impl_->subscriptions.clear();
}
bool DartwicClient::connected() const {
  return impl_->ready && impl_->transport->connected();
}
json DartwicClient::operation(const std::string &name, json payload,
                              std::chrono::milliseconds timeout) {
  if (!connected())
    throw std::runtime_error("DARTWIC client is not ready");
  if (timeout.count() <= 0)
    throw std::invalid_argument("Timeout must be positive");
  return impl_->transport->request(name, std::move(payload), timeout);
}
std::vector<std::string> DartwicClient::searchChannels(const std::string &query,
                                                       int limit) {
  return operation("rapid/search-channel-keys",
                   {{"query", query}, {"limit", limit}})
      .at("query_results")
      .get<std::vector<std::string>>();
}
json DartwicClient::getChannels(const std::vector<std::string> &channels) {
  validateNames(channels);
  return operation("rapid/get-channels-data", {{"channel_names", channels}})
      .at("channels");
}
json DartwicClient::queryChannel(const std::string &channel,
                                 const std::string &field) {
  const auto record = getChannels({channel}).at(channel);
  if (!record.value("exists", false))
    throw std::out_of_range("Missing channel: " + channel);
  return record.at("channel_data").at(field);
}
void DartwicClient::upsertChannel(const std::string &channel, json value,
                                  const std::string &field) {
  operation("rapid/upsert-channel-field", {{"channel_name", channel},
                                           {"field", field},
                                           {"value", std::move(value)}});
}
json DartwicClient::listDataframes() {
  return operation("rapid/dataframes/list", json::object()).at("frames");
}
json DartwicClient::queryChannelRange(const std::vector<std::string> &channels,
                                      const HistoryQuery &options) {
  validateNames(channels);
  if (options.from && options.to && *options.from > *options.to)
    throw std::invalid_argument("from must not exceed to");
  if (options.bucket_mode != "average" && options.bucket_mode != "extrema")
    throw std::invalid_argument("Invalid bucket mode");
  json payload = {{"series", channels}};
  if (options.from)
    payload["from"] = *options.from;
  if (options.to)
    payload["to"] = *options.to;
  if (options.bucket_count) {
    payload["bucket_count"] = *options.bucket_count;
    payload["bucket_mode"] = options.bucket_mode;
  }
  return operation("rapid/query-channel-range", payload, options.timeout);
}
std::uint64_t
DartwicClient::subscribeTelemetry(const std::string &prefix,
                                  std::function<void(const json &)> handler) {
  if (!handler)
    throw std::invalid_argument("A handler is required");
  std::scoped_lock lock(impl_->mutex);
  const auto id = impl_->next++;
  impl_->subscriptions.emplace(
      id, Impl::Subscription{prefix, {}, std::move(handler)});
  return id;
}
std::uint64_t
DartwicClient::subscribeChannel(const std::string &channel,
                                std::function<void(const json &)> handler) {
  validateNames({channel});
  if (!handler)
    throw std::invalid_argument("A handler is required");
  json snapshot;
  std::uint64_t id;
  {
    std::scoped_lock lock(impl_->mutex);
    bool first = true;
    for (const auto &[key, sub] : impl_->subscriptions)
      if (sub.channel == channel)
        first = false;
    snapshot = first ? operation("dartwic/add-channel-to-telemetry",
                                 {{"channel_name", channel}})
                           .at("snapshot")
                     : json{{"channel_name", channel}};
    if (!first)
      snapshot.update(getChannels({channel}).at(channel));
    id = impl_->next++;
    impl_->subscriptions.emplace(
        id, Impl::Subscription{"rapid/channels/snapshot", channel, handler});
  }
  try {
    handler(snapshot);
  } catch (...) {
    unsubscribe(id);
    throw;
  }
  return id;
}
void DartwicClient::unsubscribe(std::uint64_t token) {
  std::scoped_lock lock(impl_->mutex);
  const auto found = impl_->subscriptions.find(token);
  if (found == impl_->subscriptions.end())
    return;
  if (!found->second.channel.empty()) {
    std::size_t count = 0;
    for (const auto &[id, sub] : impl_->subscriptions)
      if (sub.channel == found->second.channel)
        ++count;
    if (count == 1 && connected())
      operation("dartwic/remove-channel-from-telemetry",
                {{"channel_name", found->second.channel}});
  }
  impl_->subscriptions.erase(found);
}
} // namespace DARTWIC::Client
