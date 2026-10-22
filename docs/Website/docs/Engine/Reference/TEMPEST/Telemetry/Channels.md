---
title: Channels telemetry
summary: Channel creation notices and subscribed live channel values.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

| Topic | Direction | Description |
| --- | --- | --- |
| [`rapid/channel-created`](Topics/rapid/channel-created.md) | Server → clients | Announces every channel created through the normal RAPID lifecycle. |
| [`rapid/channels/catalog`](Topics/rapid/channels/catalog.md) | Server → clients | Publishes one compact catalog for the current RAPID name index. |
| [`rapid/channels/snapshot`](Topics/rapid/channels/snapshot.md) | Server → clients | Sends the complete current data of this client's subscribed channels. |
