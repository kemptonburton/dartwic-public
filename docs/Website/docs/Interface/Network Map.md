---
summary: Inspect clients, remote nodes, and the connections between them.
created: 2026-08-03T15:41
updated: 2026-10-27T13:52
---

Open **Network Map** from the left navigation to see the engine serving your interface, its connected clients, and remote nodes linked through [TEMPEST Peer](../Engine/Networking%20and%20Peers.md).

![Network Map showing an interface, its engine, and a remote peer.](../_attachments/network-map.png)

The interface-to-engine connection and the engine-to-peer link are separate connections. Select the connection you want to inspect or configure.

# Nodes, clients, and peers

| Item | Meaning |
| --- | --- |
| Engine node | The runtime your interface is connected to, with node name, version, endpoint, and load metrics. |
| Client | A connected interface or tool. Client identity helps explain command provenance. |
| Remote node | A peer linked through TEMPEST peer, with connection and traffic information. |
| Telemetry / operation link | Activity between an interface or client and the engine. |
| Uplink / downlink | Payload traffic in the direction shown for the selected node or peer. Transport counters are measured where available; fallback application-payload estimates are labelled. |

Use the map's **fit view** control after opening or resizing the resource. Select a node or its connection control to inspect or manage the link. Connection options depend on whether the node is local, connected, or remembered.

Connection and traffic readings update periodically. Check received snapshots and source timestamps alongside the connection badge.

# Connect and reconnect

Choose a **Connection type**, then its settings. **DARTWIC — ZeroMQ** uses the remote Engine or C++ peer endpoint. A registered link adds an option such as **DARTWIC — Radio Link**; device integrations add their own option, such as **F Prime — CCSDS**. Each option shows only its relevant connection fields. The [TEMPEST peer guide](../Engine/Networking%20and%20Peers.md) explains telemetry, commands, and recovery.

A remembered node is a saved target, not proof of a live connection. **Disconnect** stops the current link; **forget** also removes the saved target. Reconnect remembered targets when the peer becomes available again.

# Remote channel diagnostics

| Symptom | Check next |
| --- | --- |
| Expected peer absent | Active project and saved TEMPEST peer connections. |
| Peer offline | Remote engine, endpoint, password, and transport error. |
| Connected but no signals | Whether received snapshots advance, and whether the peer supports channel snapshots and its sharing filter includes the signals. |
| Signals stale | Their timestamps, source task, and driver status in [Channels](Channels.md). |
| Command ineffective | Owning-node prefix and command authority at that node. |

Traffic counters update periodically and exclude framing and link overhead. Inspect received-frame/snapshot progress and queue/drop evidence as well as the connection badge. Complete unchanged snapshots still count as reception; a changing value is not required for a healthy link. Neither an online badge nor a nonzero Mbps value guarantees a particular channel is fresh or a command reached hardware.

Select a peer to inspect its Network traffic and connection details. Traffic observation runs while that view is watched; it is not a permanent archive of every message. A **Remote node connection failed** ARGUS event covers failed configured connections and unexpected disconnects, includes the actual reason, and resolves after reconnection. Deliberately removing a connection stays quiet.
