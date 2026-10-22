---
title: Engine Protocol Reference
summary: Channel and ARGUS operations composed over a TEMPEST Peer.
created: 2026-10-04T18:31
updated: 2026-10-12T14:00
---

C++20 target: `DARTWIC::EngineProtocol`.

| API | Description |
| --- | --- |
| [Value](Value.md) | Application value type shared with TEMPEST; no wire codec is implied. |
| [ChannelSample](ChannelSample.md) | One channel value with its RAPID timestamp in nanoseconds. |
| [ChannelUpsert](ChannelUpsert.md) | Channel field write or telemetry update, including optional snapshot data and owner/session/revision lineage. |
| [ChannelRemove](ChannelRemove.md) | Channel deletion identified by owner and channel, with optional session/revision lineage. |
| [ChannelBulkUpsert](ChannelBulkUpsert.md) | Batch of timestamped samples for one channel. |
| [ChannelQuery](ChannelQuery.md) | Channel keys and requested fields for a synchronous peer snapshot query. |
| [ChannelSnapshot](ChannelSnapshot.md) | One channel returned by a query, with its data and owner/session/revision lineage. |
| [ChannelQueryResult](ChannelQueryResult.md) | Channel snapshots returned by a peer query handler. |
| [FixedGenerationWrite](FixedGenerationWrite.md) | One field write within a fixed-generation telemetry batch. |
| [FixedGenerationTelemetry](FixedGenerationTelemetry.md) | Writes belonging to one source generation, with a source timestamp and relay route. |
| [ChannelTelemetry](ChannelTelemetry.md) | One-way channel upsert, removal, or bulk update. |
| [ChannelSnapshotTelemetry](ChannelSnapshotTelemetry.md) | Complete current channel records sent by one engine peer. |
| [ArgusEvent](ArgusEvent.md) | ARGUS event identity, presentation, ownership, channel references, and details. |
| [ArgusQuery](ArgusQuery.md) | ARGUS event selection by identity, status, type, owner, time range, limit, and additional filters. |
| [ArgusQueryResult](ArgusQueryResult.md) | ARGUS events returned by a peer, with result and total counts. |
| [ArgusAction](ArgusAction.md) | Action on an ARGUS event. |
| [ArgusActionResult](ArgusActionResult.md) | Event identity and result fields returned by an ARGUS action handler. |
| [ArgusEventTelemetry](ArgusEventTelemetry.md) | One-way ARGUS event creation, update, or removal, with ownership and relay route. |
| [ChannelHandlers](ChannelHandlers.md) | Application handlers for incoming channel commands, queries, and telemetry. |
| [ArgusHandlers](ArgusHandlers.md) | Application handlers for incoming ARGUS queries, actions, and telemetry. |
| [LogEntry](LogEntry.md) | Text output from one process stream. |
| [LogQuery](LogQuery.md) | Selects one node, process session, and stream, with optional sequence, text, channel, level, and UTC nanosecond time filters. |
| [LogStream](LogStream.md) | Identifies one originating node, process session, and named log source. |
| [LogHandlers](LogHandlers.md) | Callbacks through which an EngineProtocol peer serves log history and receives live logs. |
| [EngineRequest](EngineRequest.md) | Requests supported by the DARTWIC application contract. |
| [EngineTelemetry](EngineTelemetry.md) | Telemetry supported by the DARTWIC application contract. |
| [ARGUS_UPDATE_EVENT_STATUS_OPERATION](ARGUS_UPDATE_EVENT_STATUS_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_RESPOND_TO_PROMPT_OPERATION](ARGUS_RESPOND_TO_PROMPT_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_RELEASE_HOLD_OPERATION](ARGUS_RELEASE_HOLD_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_DELETE_EVENT_OPERATION](ARGUS_DELETE_EVENT_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [version](version.md) | TEMPEST compatibility version supplied by the SDK. |
| [operation](operation.md) | Map a typed request to its TEMPEST operation name. |
| [arguments](arguments.md) | Map a typed request to its argument object. |
| [request](request.md) | Validate and parse a TEMPEST operation argument object. |
| [result](result.md) | Map a typed result to its TEMPEST response object. |
| [channelResult](channelResult.md) | Parse a channel snapshot response. |
| [argusResult](argusResult.md) | Parse an ARGUS query response. |
| [actionResult](actionResult.md) | Parse an ARGUS action response. |
| [topic](topic.md) | Map typed telemetry to its TEMPEST topic. |
| [payload](payload.md) | Map typed telemetry to its application object. |
| [telemetry](telemetry.md) | Parse a known topic and its application object. |
| [EngineProtocol](EngineProtocol.md) | Typed channel and ARGUS operations composed over an existing Peer. |
