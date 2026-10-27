#include <dartwic/PeerClient.h>
#include <iostream>
int main(int argc, char** argv) {
    DARTWIC::PeerClientConfig config{.node_name="example"};
    if (argc > 1) config.host = argv[1];
    if (argc > 2) config.port = std::stoi(argv[2]);
    if (argc > 3) config.password = argv[3];
    DARTWIC::PeerClient peer(config);
    peer.channels().setHandlers({.upsertCommand=[](const DARTWIC::ChannelUpsertRequest& command) {
        for (const auto& change : command.changes) std::cout << "Command: " << change.channel << '\n';
    }});
    peer.registerOperation("example/echo", [](const auto& arguments) { return arguments; });
    peer.start();
    peer.waitUntilReady();
    peer.channels().publishChannelTelemetry({.channel="temperature", .fields={.value=21.5,.units="C"}});
    peer.stop();
}
