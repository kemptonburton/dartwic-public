---
summary: Inspect clients, remote nodes, and the connections between them.
created: 2026-08-03T15:41
updated: 2026-10-29T18:29
---

Your Interface can be connected to one Engine while that Engine communicates with other computers and devices. **Network Map** draws those connections so you can see who is connected and investigate where communication is failing. A **node** is a named process in that system, such as a DARTWIC Engine.

Open Network Map and select a node for its details or a connection for its traffic. **Fit view** brings the map back into view.

![An Interface client connected to its Engine, with telemetry reception rate shown on the link.](../Engine/_attachments/Pasted%20image%2020261029010339.png)

# Clients and Peers

An operator's Interface is a **client**: it requests information and sends commands to the Engine. If that Engine also needs measurements from a second Engine, connect the second one as a **peer** so the two can exchange data and commands. Client and peer links are separate; select the one you want to inspect. See [Clients](../Engine/Networking%20and%20Peers.md#clients) and [Peers](../Engine/Networking%20and%20Peers.md#peers) for the networking model.

## Connect and Reconnect

For example, your test-stand Engine can share measurements with a ground-station Engine through a peer connection. You need the remote Engine's address, its configured TEMPEST connection port, and its password. Give the Engines distinct node names and separate ports if they run on one computer. Start the remote Engine, then:

1. As an administrator, choose **Add peer** or the cable control on the Engine node.
2. Select **Engine Protocol Peer — TEMPEST TCP** for another DARTWIC Engine.
3. Enter its **TEMPEST IP**, base **TEMPEST Port**, and **Password**, then **Add peer**.
4. Check the resulting connection state; acceptance of the request can precede connection.

![The Engine's peer control and the traffic panel below the map.](../Engine/_attachments/Pasted%20image%2020261027231656.png)

**TEMPEST Protocol Peer — TEMPEST TCP** supports generic custom messages without DARTWIC's channel/event integration. Plugins can add other types; see [Connection Types](../Engine/Networking%20and%20Peers.md#connection-types).

Remote channels appear under their node in Channels, for example `TEST_STAND:tank_pressure`. The prefix identifies which Engine owns the signal, keeping it separate from a local channel with the same name. Use that full name when choosing channels for a graph or schematic.

To export recorded peer channels, events, or logs, open **Data** on the Engine holding those recordings and [export the selected range](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats). A peer's live snapshots do not provide its complete source archive; see [Event and Log Recording](../Engine/Recording%20and%20Telemetry.md#event-and-log-recording).

# Operations and Telemetry

When you click a control, the Interface sends an **operation**, a request for the Engine to do something and return a result. **Telemetry** carries updates back, such as channel readings. Inspecting both helps distinguish a rejected command from a command whose resulting measurement has not arrived.

Select a link and use **Operations**, **Telemetry**, or **Connections** to filter its traffic panel. Select a message for its payload; check the response when investigating a failed command.

**Telemetry RX** or **DOWNLINK** shows delivery activity. Check channel source timestamps separately: traffic does not prove new sensor measurements. See [Remote Channel Freshness](../Engine/Networking%20and%20Peers.md#remote-channel-freshness) and [Peer Diagnostics](../Engine/Diagnostics%20and%20Troubleshooting.md#peer-connections).

# Disconnection and Recovery

If the remote computer goes offline, you may still see the last measurements it sent. Treat them as earlier observations until communication resumes; the retained number does not establish that the device is still in that state.

A **Remote node connection failed** event gives the failure reason. To remove the peer, use **Disconnect** and read the confirmation: it also removes the saved target, which must be added again to reconnect.

To disconnect your Interface from its Engine, use the node menu instead. [First Session](../Getting%20Started/First%20Session.md#connecting-to-an-existing-engine) covers login and discovery.
