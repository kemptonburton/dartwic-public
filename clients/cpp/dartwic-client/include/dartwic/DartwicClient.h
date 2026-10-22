#pragma once
#include <chrono>
#include <cstdint>
#include <functional>
#include <memory>
#include <nlohmann/json.hpp>
#include <optional>
#include <string>
#include <vector>

namespace DARTWIC::Client {
/** Engine connection settings. Requires C++20; construction does not open
 * sockets. */
struct ClientConfig {
  std::string host = "127.0.0.1";
  int port = 7000;
  std::string password;
};
/** Recorded-data query options. Timestamps are inclusive Unix nanoseconds; omit
 * bounds to query available history subject to server limits. */
struct HistoryQuery {
  std::optional<std::uint64_t> from;
  std::optional<std::uint64_t> to;
  std::optional<std::size_t> bucket_count;
  std::string bucket_mode = "average";
  std::chrono::milliseconds timeout{10000};
};
/** DARTWIC convenience API over the bundled TEMPEST client. Operations may run
 * concurrently; lifecycle calls must be serialized by the caller. */
class DartwicClient {
public:
  /** Save connection settings. Call connect before querying or subscribing. */
  explicit DartwicClient(ClientConfig config = {});
  /** Stop workers and unregister. Keep the client alive until callbacks return.
   */
  ~DartwicClient();
  DartwicClient(const DartwicClient &) = delete;
  DartwicClient &operator=(const DartwicClient &) = delete;
  /** Register, verify engine compatibility, and start telemetry/heartbeat
   * workers. Throws on failure. */
  void connect();
  /** Stop the connection and clear subscriptions. Call outside telemetry
   * callbacks. Safe to call repeatedly. */
  void disconnect();
  /** True when registered, compatible, and channel subscriptions have been
   * restored. This is local state, not a network probe. */
  bool connected() const;
  /** Raw operation payload. Server, transport, queue and timeout errors throw;
   * operations are never automatically replayed. */
  nlohmann::json operation(
      const std::string &name,
      nlohmann::json payload = nlohmann::json::object(),
      std::chrono::milliseconds timeout = std::chrono::milliseconds{5000});
  /** Search channel keys. An empty query matches any name; limit defaults to
   * 1000. */
  std::vector<std::string> searchChannels(const std::string &query = "",
                                          int limit = 1000);
  /** Read records keyed by name with exists/channel_data fields. Live values
   * are rounded by the engine to three decimals. */
  nlohmann::json getChannels(const std::vector<std::string> &channels);
  /** Read one live field; throws when the channel or field is missing. */
  nlohmann::json queryChannel(const std::string &channel,
                              const std::string &field = "value");
  /** Write a typed field under engine authority. Does not request operator
   * manual override. */
  void upsertChannel(const std::string &channel, nlohmann::json value,
                     const std::string &field = "value");
  /** List saved dataframe views with IDs and time ranges. */
  nlohmann::json listDataframes();
  /** Query recorded points for selected channels.
   * Returns full server statistics; integer timestamps retain 64-bit precision.
   */
  nlohmann::json queryChannelRange(const std::vector<std::string> &channels,
                                   const HistoryQuery &options = {});
  /** Bind a raw topic prefix; callback receives a telemetry envelope on the
   * receive worker. Keep callbacks short. Returns a token for unsubscribe. */
  std::uint64_t
  subscribeTelemetry(const std::string &prefix,
                     std::function<void(const nlohmann::json &)> handler);
  /** Enable an exact channel stream and deliver its snapshot on the caller
   * thread. Updates run on the receive worker; exceptions there are isolated.
   * Streams are restored after automatic reconnect. */
  std::uint64_t
  subscribeChannel(const std::string &channel,
                   std::function<void(const nlohmann::json &)> handler);
  /** Remove a local binding and release the last server channel reference.
   * Repeated removal is harmless; failed server removal throws so it can be
   * retried. */
  void unsubscribe(std::uint64_t token);

private:
  struct Impl;
  std::unique_ptr<Impl> impl_;
};
} // namespace DARTWIC::Client
