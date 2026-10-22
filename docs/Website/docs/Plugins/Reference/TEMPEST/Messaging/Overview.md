---
title: Messaging Reference
summary: Codec-independent values, messages, transport and peer lifecycle.
created: 2026-09-26T01:43
updated: 2026-10-04T04:52
---

C++20 target: `TEMPEST::Messaging`.

| API | Description |
| --- | --- |
| [Value](Value.md) | Application values independent of encoding: null, bool, exact signed/unsigned 64-bit integers, double, string, array, or object. |
| [ConnectionState](ConnectionState.md) | Peer lifecycle state; Connected means registration completed. |
| [Message](Message.md) | Operations, replies and telemetry share this in-memory envelope. |
| [TransportCallbacks](TransportCallbacks.md) | Delivery callbacks supplied by Peer. |
| [TransportPath](TransportPath.md) | One observed transport path. |
| [Transport](Transport.md) | Implement start, send and stop for custom framing and I/O. |
| [TransportPtr](TransportPtr.md) | Shared ownership of an application transport. |
| [SerializedTelemetryTransport](SerializedTelemetryTransport.md) | Optional adapter optimization for complete, replaceable telemetry snapshots. |
| [AllowedRoles](AllowedRoles.md) | Authorization roles permitted to invoke an operation. |
| [Error](Error.md) | Base messaging failure. |
| [DisconnectedError](DisconnectedError.md) | The connection ended before the operation completed. |
| [TimeoutError](TimeoutError.md) | The single request deadline expired; remote completion is unknown. |
| [QueueFullError](QueueFullError.md) | A bounded request or transport queue rejected the operation. |
| [RemoteError](RemoteError.md) | Remote operation failure with a machine-readable code. |
| [PeerConfig](PeerConfig.md) | Explicit peer and protocol identity, deadlines and bounded queue limits. |
| [OperationArgument](OperationArgument.md) | Metadata for a callable operation. |
| [OperationDescriptor](OperationDescriptor.md) | A peer-visible command with typed argument metadata. |
| [operationDescriptorValue](operationDescriptorValue.md) | Encode one descriptor as a codec-independent TEMPEST object. |
| [TelemetryDescriptor](TelemetryDescriptor.md) | A peer-visible telemetry topic. |
| [telemetryDescriptorValue](telemetryDescriptorValue.md) | Encode a telemetry descriptor as a codec-independent TEMPEST object. |
| [Peer](Peer.md) | Generic operations and telemetry over a Transport, with no DARTWIC, JSON or socket dependency. |
