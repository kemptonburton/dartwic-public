---
summary: Inspect clients, remote nodes, and the connections between them.
created: 2026-08-03T15:41
updated: 2026-10-30T02:58
---

**Network Map** shows connections between your Interface, Engine, and other nodes. Open it from the left sidebar, then select a node for details or a connection for traffic. Use **fit view** to bring the map back into view.

![](_attachments/Pasted%20image%2020261030023719.png)

# Connections

Your connected **Engine** sits in the center. [Operators](#operators) using desktop or web Interfaces appear **on the left**, with their profiles and connection details.

[Clients](#clients) appear **below the Engine**. These include Python analysis scripts, Node.js services, C++ applications, and other tools that use a client library or custom client implementation.

[Peers](#peers) appear **on the right**. They can be other DARTWIC Engines, custom applications exposing their own data and commands, or device and flight-computer connections supplied by plugins.

![](_attachments/Pasted%20image%2020261030024815.png)

# Clients and Peers

See [Networking and Peers](../Engine/Networking%20and%20Peers.md#clients) for registration and session details; the guides below cover using or building each connection.

## Clients

Use [Python](../Clients/Python%20Client.md) for scripts and analysis, [Node.js](../Clients/Node.js%20Client.md) for services, [C++](../Clients/C%2B%2B%20Client.md) for native applications, or [React](../Clients/React%20Client.md) for browser dashboards. To implement your own client or client library, follow [Custom Client](../Engine/Advanced/Using%20TEMPEST.md#custom-client).

## Operators

Operator commands carry user identity and can explicitly take or release manual channel control where permitted; ordinary clients cannot. See [Control Authority](../Engine/Channels%20and%20Control.md#control-authority) and [Overrides](../Engine/Channels%20and%20Control.md#overrides).

Your own application can also connect as an operator: include a non-empty `interface_type` and its `username` in the `register_client` metadata. For an existing application, supply those fields through its registration layer when reconnecting; they are not options exposed by every high-level client library. [Custom Client](../Engine/Advanced/Using%20TEMPEST.md#custom-client) covers the registration flow. Operator identity does not grant administrator access; [registration permissions](../Engine/Networking%20and%20Peers.md#registration-and-permissions) still apply.

## Peers

Use a [C++ Engine Protocol Peer](../Clients/C%2B%2B%20Engine%20Protocol%20Peer.md) to share DARTWIC channels, events, and logs, or a [C++ TEMPEST Protocol Peer](../Clients/C%2B%2B%20TEMPEST%20Protocol%20Peer.md) for custom messages. [Building a Custom Peer](../Plugins/Building%20a%20Custom%20Peer.md) covers plugin-provided transports and device protocol bridges.

## Connect and Reconnect a Peer

As an administrator, choose **Add peer** or the cable control on the Engine node. For another DARTWIC Engine, select **Engine Protocol Peer — TEMPEST TCP**, enter its **TEMPEST IP**, base **TEMPEST Port**, and **Password**, then choose **Add peer**. The remote Engine must be running; check the resulting connection state.

![](_attachments/Pasted%20image%2020261030025303.png)

Give Engines distinct node names and separate ports when running on one computer. Other protocols use different connection types; see [Connection Types](../Engine/Networking%20and%20Peers.md#connection-types) and [Peer Connections](../Engine/Networking%20and%20Peers.md#peer-connections).

Remote channels appear with their owner's prefix, such as `TEST_STAND:tank_pressure`. Use the full name in graphs and schematics. Export saved peer data through [Data](DataFrames%2C%20Databases%2C%20and%20Exporting%20Data.md#export-formats).

# Viewing Network Traffic

The Engine uses a subsystem of DARTWIC for communication, called TEMPEST, which speaks to clients and peers in a certain way.

**Operations** are requests and responses; **telemetry** carries updates such as channel readings. You can select a client or peer, and filter its traffic with **Operations**, **Telemetry**, or **Connections**, then select a message to inspect its payload.

![](_attachments/Pasted%20image%2020261030025231.png)

You can also select the radio icon next to the node in the Node Bar to see its network activity.

**Telemetry RX** or **DOWNLINK** shows delivery activity, but channel timestamps tell you whether measurements are fresh. See [Operations and Telemetry](../Engine/Networking%20and%20Peers.md#operations-and-telemetry) and [Remote Channel Freshness](../Engine/Networking%20and%20Peers.md#remote-channel-freshness) for details.

# Sending Network Traffic

Viewing the network traffic also allows you to view the registered operation and telemetry list for that TEMPEST peer or client. Selecting one will open up a side panel and you can configure arguments, and send a registered operation or telemetry payload manually.

![](_attachments/Pasted%20image%2020261030025538.png)

## Pinned Operations

You can also save a configured operation payload a a Pinned Operation, by saving a name and pressing the pin button. 

![](_attachments/Pasted%20image%2020261030025750.png)

Pinning an operation allows you to manually call operations easier with preconfigured arguments and one send button.

## Send from DCode

You can also send operations through DCode.

With an Engine peer named `TEST_STAND` connected, open a DCode script and activate this read-only request for its runtime information:

```dcode
result = tempest_operation("TEST_STAND", "dartwic/get-runtime-metadata", {})
```

Replace `TEST_STAND` with your connected node's name. The call waits for a response; select that peer's network traffic to inspect the request and reply. [TEMPEST Operations in DCode](../DCode/Modules%20and%20Native%20Functions.md#tempest-operations) explains arguments and saved operations; [tempest_publish](../DCode/Reference/DCode%20Functions/function-tempest_publish.md) sends custom telemetry instead.

# Disconnection and Recovery

A **Remote node connection failed** event explains connection failures. Last received values can remain visible while disconnected; treat them as earlier observations.

A peer's **Disconnect** action also removes its saved target, so you must add it again to reconnect. To disconnect only your Interface from its Engine, use the navbar's node menu. See [Disconnection and Recovery](../Engine/Networking%20and%20Peers.md#disconnection-and-recovery).
