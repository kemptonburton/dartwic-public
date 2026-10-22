#include <tempest/ZmqPeer.h>
#include <iostream>
int main(int argc, char** argv) {
    TEMPEST::ZmqPeerConfig transport;
    if (argc > 1) transport.host = argv[1];
    if (argc > 2) transport.port = std::stoi(argv[2]);
    TEMPEST::Peer peer({.node_name="example", .peer_id="tempest.peer", .protocol_id="tempest.peer"}, TEMPEST::makeZmqTransport(transport));
    peer.registerOperation("example/echo", [](const auto& arguments) { return arguments; });
    peer.onTelemetry("example/status", [](const auto&) { std::cout << "Status received\n"; });
    peer.start(); peer.waitUntilReady();
    peer.publish("example/status", {{"ready", true}});
    peer.stop();
}
