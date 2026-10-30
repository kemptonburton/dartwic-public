#include <tempest/Peer.h>
#include <tempest/JsonValue.h>
#include <tempest/ZmqPeer.h>
#include <tempest/InternalVersions.h>
#include <chrono>
#include <cstdlib>
#include <iostream>
#include <syncstream>
#include <thread>

// Run against an Engine with the peer_demo plugin from the companion guide.
int main(int argc, char** argv) {
    try {
        const char* password = std::getenv("DARTWIC_PASSWORD");
        if (!password) throw std::runtime_error("Set DARTWIC_PASSWORD first.");
        TEMPEST::ZmqPeerConfig connection;
        connection.password = password;
        if (argc > 1) connection.host = argv[1];
        if (argc > 2) connection.port = std::stoi(argv[2]);
        // On different machines, supply this application's reachable local address.
        if (argc > 3) {
            connection.bind_host = "0.0.0.0";
            connection.advertised_host = argv[3];
        }
        TEMPEST::Peer peer({
            .node_name="CUSTOM_APP", .peer_id="tempest.peer",
            .protocol_id="tempest.peer", .protocol_version=TEMPEST::COMPATIBILITY_VERSION
        }, TEMPEST::makeZmqTransport(connection));

        // Receive commands: the Engine can call this application's handler.
        peer.registerOperation("demo/echo", [](const TEMPEST::Value::Object& args) {
            std::osyncstream(std::cout) << "Received command: " << TEMPEST::Json::fromObject(args).dump() << '\n';
            return args;
        });
        // Receive telemetry from the Engine plugin.
        peer.onTelemetry("peer_demo.status", [](const TEMPEST::Value::Object& data) {
            std::osyncstream(std::cout) << "Received telemetry: " << TEMPEST::Json::fromObject(data).dump() << '\n';
        });
        peer.start();
        peer.waitUntilReady();
        for (int sample = 0; sample < 10; ++sample) {
            // Send telemetry; the Engine relays this topic to its ordinary clients.
            peer.publish("demo/reading", {{"sample", sample}, {"temperature", 24.5}});
            // Send a command; each loop is a new explicit request, not a retry.
            const auto reply = peer.call("peer_demo.exchange", {{"sample", sample}}, std::chrono::seconds{5});
            std::osyncstream(std::cout) << "Command reply: " << TEMPEST::Json::fromObject(reply).dump() << '\n';
            std::this_thread::sleep_for(std::chrono::milliseconds{200});
        }
        peer.stop();
    } catch (const std::exception& error) {
        std::cerr << error.what() << '\n';
        return 1;
    }
}
