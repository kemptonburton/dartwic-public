---
title: Engine Protocol Reference
summary: Channel and ARGUS operations composed over a TEMPEST Peer.
created: 2026-10-04T18:31
updated: 2026-10-27T13:57
---

C++20 target: `DARTWIC::EngineProtocol`.

| API | Description |
| --- | --- |
| [Value](Value.md) | Application values shared with TEMPEST, independent of wire encoding. |
| [ChannelFields](ChannelFields.md) | Optional fields; omitted values leave existing data unchanged. |
| [ChannelChange](ChannelChange.md) | A requested change to one channel. |
| [ChannelChanges](ChannelChanges.md) | One or more requested channel field changes. |
| [ChannelUpsertRequest](ChannelUpsertRequest.md) | Owner-directed batch; execution is synchronous but not atomic. |
| [ChannelRemoveRequest](ChannelRemoveRequest.md) | Owner-directed deletion of one channel. |
| [ChannelQuery](ChannelQuery.md) | Current channel names and optional field selection; empty selections mean all. |
| [ChannelUpdate](ChannelUpdate.md) | An observed record; local publications fill missing source lineage automatically. |
| [ChannelUpdates](ChannelUpdates.md) | Observed channel records, including repeated timestamped samples. |
| [ChannelQueryResult](ChannelQueryResult.md) | Matching current channel records returned by a synchronous query. |
| [ChannelSnapshot](ChannelSnapshot.md) | Complete shared selection; an empty selection clears the receiver's mirror. |
| [EventType](EventType.md) | The six supported ARGUS presentation and workflow types. |
| [eventTypeName](eventTypeName.md) | Return the lowercase wire name for an event type. |
| [eventTypeFromName](eventTypeFromName.md) | Parse a supported lowercase event type or throw on invalid input. |
| [ArgusEvent](ArgusEvent.md) | ARGUS event identity, presentation, ownership, channel references, and details. |
| [ArgusQuery](ArgusQuery.md) | ARGUS event selection by identity, status, type, owner, time range, limit, and additional filters. |
| [ArgusQueryResult](ArgusQueryResult.md) | ARGUS events returned by a peer, with result and total counts. |
| [ArgusAction](ArgusAction.md) | Action on an ARGUS event. |
| [ArgusActionResult](ArgusActionResult.md) | Event identity and result fields returned by an ARGUS action handler. |
| [LogEntry](LogEntry.md) | Text output from one process stream. |
| [LogQuery](LogQuery.md) | Selects one node, process session, and stream, with optional sequence, text, channel, level, and UTC nanosecond time filters. |
| [LogStream](LogStream.md) | Identifies one originating node, process session, and named log source. |
| [ArgusBoardSnapshot](ArgusBoardSnapshot.md) | Complete current event board. |
| [ChannelHandlers](ChannelHandlers.md) | Install before Peer.start. |
| [ArgusHandlers](ArgusHandlers.md) | Owner-side event commands and incoming event/complete-board telemetry. |
| [LogHandlers](LogHandlers.md) | Supported log-history commands and incoming batches of entries. |
| [EngineRequest](EngineRequest.md) | Typed synchronous requests carried by the shared Engine contract. |
| [EngineTelemetry](EngineTelemetry.md) | Typed best-effort observations and complete snapshots. |
| [ARGUS_UPDATE_EVENT_STATUS_OPERATION](ARGUS_UPDATE_EVENT_STATUS_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_RESPOND_TO_PROMPT_OPERATION](ARGUS_RESPOND_TO_PROMPT_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_RELEASE_HOLD_OPERATION](ARGUS_RELEASE_HOLD_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [ARGUS_DELETE_EVENT_OPERATION](ARGUS_DELETE_EVENT_OPERATION.md) | Engine operation name for owner-directed ARGUS actions. |
| [version](version.md) | TEMPEST compatibility version supplied by the SDK. |
| [fields](fields.md) | Encode supplied channel fields without inventing omitted values. |
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
| [EngineProtocol](EngineProtocol.md) | Typed application contract over Peer. |
