---
summary: Connect TEMPEST peers and use their channels while connected or offline.
updated: 2026-10-14T17:39
created: 2026-09-06T14:36
---

TEMPEST peers exchange supported channel snapshots, ARGUS events, and commands between named nodes. The built-in `tempest.engine` peer connects two DARTWIC engines. Plugins can register other peer types with `registerPeer`; the [example workspace walkthroughs](../Getting%20Started/Example%20Workspace.md) show engine-to-engine, native C++ flight, and custom transport connections.

## Connect two engines

Give each workspace a distinct node name, such as `GROUND` and `TEST_STAND`. Start both engines on different ports. In **Network Map**, add a `tempest.engine` connection to the other engine's host and base port, enter its password, and choose the channels to publish.

A remote channel appears as `TEST_STAND:tank_pressure`, keeping it distinct from a local `tank_pressure`. Use that qualified name in searches, schematic bindings, DCode references, and client requests. Writes are routed to the owning node and still obey its channel authority.

The same connection can be configured through [`tempest/peers/connect`](Reference/TEMPEST/Operations/tempest/peers/connect.md). Its `rapid.publish_all` setting controls which local channels are sent; when false, list channel keys in `rapid.channels`. Enable ARGUS separately. A remembered connection is retried on later starts; its credentials belong to the local instance settings, not the portable workspace.

## Check what is arriving

A full peer snapshot updates the remote channels and removes any that the owner has deleted. Compare an advancing counter or timestamp with the connection diagnostics before depending on a reading.

Built-in engine peers send complete owned-channel and ARGUS board snapshots at 5 Hz, including unchanged records. This is link delivery, not the source's acquisition or task rate. Plugin transports define which streams they support. The runnable flight peer exchanges channels, commands, ARGUS events, and logs in both native and custom modes.

## Disconnect and reconnect

Stop the remote engine or peer process during a disposable exercise. Its last known channels stay in RAPID with their values and fields. Channel Search marks them **Not Found**, and commands to that peer fail until it reconnects. The records also survive an engine restart through RAPID's channel snapshot. A retained pressure value is not a new pressure measurement.

Start the remote process again and confirm new snapshots arrive. Do not replay a timed-out command automatically: inspect the resulting state first. A configured peer remains the owner of its cached channels while offline.

If a peer is removed or renamed, open **Channel Cleanup** from Channel Search or the References page. Review the channels with no current owner or references, then apply the Project action. A possible reference or incomplete provider scan keeps the affected channel out of the deletion list.

Peer protocol topics use the `tempest-peer/channels/` and `tempest-peer/argus/` prefixes. Public engine operations use `tempest/peers/`. The engine's channel status and data responses include `available` separately from `exists` so clients can display cached offline data without treating the channel as commandable.

Use [Network Map](../Interface/Network%20Map.md) to inspect connection state, received snapshots, timestamps, and queue/drop evidence. A connection badge alone cannot establish that snapshots are arriving. Missing-snapshot warnings depend on the peer protocol and enabled streams; a transport that does not supply a stream has no expectation for it.
