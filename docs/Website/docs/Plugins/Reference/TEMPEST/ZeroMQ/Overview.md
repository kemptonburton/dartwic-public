---
title: ZeroMQ Reference
summary: Optional default socket transport and JSON boundary helpers.
created: 2026-09-26T01:43
updated: 2026-10-04T04:52
---

C++20 target: `TEMPEST::Peer`.

| API | Description |
| --- | --- |
| [ZmqPeerConfig](ZmqPeerConfig.md) | Default ZeroMQ connection and advertised endpoints. |
| [PeerDeclaration](PeerDeclaration.md) | Explicit connection contract declared before an incoming peer is constructed. |
| [makeZmqTransport](makeZmqTransport.md) | Create the optional standalone ZeroMQ transport with four socket roles and JSON encoding. |
| [ZmqPeerHub](ZmqPeerHub.md) | Reuse an engine server ROUTER/PUB and own one shared SUB plus one DEALER per logical peer connection. |
| [fromObject](fromObject.md) | Convert an application object to a JSON object. |
| [validate](validate.md) | Reject nonfinite doubles anywhere in an application value. |
| [validateObject](validateObject.md) | Validate all values in an application object. |
| [fromValue](fromValue.md) | Convert application values to JSON at an optional adapter boundary. |
| [toValue](toValue.md) | Convert JSON to typed application values, retaining signed and unsigned integer precision. |
| [toObject](toObject.md) | Convert a JSON object to an application object, rejecting other JSON types. |
| [parseValue](parseValue.md) | Build one application tree directly, without an intermediate JSON DOM. |
