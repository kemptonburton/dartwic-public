#include <cstdlib>
#include <dartwic/DartwicClient.h>
#include <iostream>
int main() {
  DARTWIC::Client::ClientConfig config;
  if (const char *password = std::getenv("DARTWIC_PASSWORD"))
    config.password = password;
  try {
    DARTWIC::Client::DartwicClient client(config);
    client.connect();
    const auto channels = client.searchChannels("demo");
    if (!channels.empty())
      std::cout << client.getChannels(channels).dump(2) << '\n';
    DARTWIC::Client::HistoryQuery query;
    // Add from/to nanoseconds to bound a long recording; bucket_count is
    // optional.
    std::cout << client.queryChannelRange({"demo_pressure"}, query).dump(2)
              << '\n';
  } catch (const std::exception &error) {
    std::cerr << error.what() << '\n';
    return 1;
  }
}
