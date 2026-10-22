---
title: "Operations"
summary: "Register plugin-owned TEMPEST operation handlers. These remain plugin extensions, not official DARTWIC operations."
---

| Declaration | Description |
| --- | --- |
| [SDK_API::callPinnedTempest](SDK_API-callPinnedTempest.md) | Calls a saved pinned operation on the current engine or a connected remote node once. |
| [SDK_API::callTempest](SDK_API-callTempest.md) | Calls a registered TEMPEST operation on the current node or a connected peer. |
| [OperationArgumentDefinition](OperationArgumentDefinition.md) | A typed argument in a peer-visible command descriptor. |
| [OperationDefinition](OperationDefinition.md) | Registers an executable plugin operation and its operator-facing metadata. |
| [OperationHandler](OperationHandler.md) | Handler for a plugin-defined TEMPEST extension operation. |
| [SDK_API::publishTelemetry](SDK_API-publishTelemetry.md) | Publishes telemetry on a plugin-qualified topic to connected clients and peers. |
| [SDK_API::registerOperation](SDK_API-registerOperation.md) | Registers a plugin extension operation; it does not become an official DARTWIC operation. |
| [SDK_API::registerTelemetry](SDK_API-registerTelemetry.md) | Registers a plugin-local telemetry topic for the runtime catalog. |
| [TelemetryDefinition](TelemetryDefinition.md) | Declares an operator-visible telemetry topic before its first publication. |
