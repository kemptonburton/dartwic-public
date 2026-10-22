---
title: TEMPEST Peer Reference
summary: Optional peer messaging for external applications.
created: 2026-09-26T01:43
updated: 2026-10-04T04:46
---

C++20 targets: `TEMPEST::Messaging` for custom transports; `TEMPEST::Peer` for ZeroMQ.

Compose `DARTWIC::EngineProtocol` only when channel and ARGUS semantics are needed. Ordinary TEMPEST clients keep their existing socket roles.

| API | Description |
| --- | --- |
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
| [ZmqPeerConfig](ZmqPeerConfig.md) | Default ZeroMQ connection and advertised endpoints. |
| [PeerDeclaration](PeerDeclaration.md) | Explicit connection contract declared before an incoming peer is constructed. |
| [makeZmqTransport](makeZmqTransport.md) | Create the optional standalone ZeroMQ transport with four socket roles and JSON encoding. |
| [ZmqPeerHub](ZmqPeerHub.md) | Reuse an engine server ROUTER/PUB and own one shared SUB plus one DEALER per logical peer connection. |
