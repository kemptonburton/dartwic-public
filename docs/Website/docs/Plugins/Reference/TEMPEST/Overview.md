---
title: "TEMPEST and Engine Protocol SDK Reference"
summary: "Messaging, optional transports and DARTWIC application semantics."
---

Core messaging and EngineProtocol have no JSON or socket dependency. Choose an encoding inside your transport; custom operations and telemetry use Peer directly.

| API family | Description |
| --- | --- |
| [Messaging](Messaging/Overview.md) | Codec-independent values, messages, transport and peer lifecycle. |
| [Engine Protocol](Engine%20Protocol/Overview.md) | Channel and ARGUS operations composed over a TEMPEST Peer. |
| [ZeroMQ](ZeroMQ/Overview.md) | Optional default socket transport and JSON boundary helpers. |
