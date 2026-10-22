---
title: Clients telemetry
summary: Client connection, profile, and live peer activity messages.
created: 2026-08-04T16:30
updated: 2026-10-20T18:59
---

| Topic | Direction | Description |
| --- | --- | --- |
| [`dartwic/clients/connected`](Topics/dartwic/clients/connected.md) | Server → clients | Announces a client after it registers with the TEMPEST server. |
| [`dartwic/clients/disconnected`](Topics/dartwic/clients/disconnected.md) | Server → clients | Announces that a registered client has disconnected or been unregistered. |
| [`dartwic/clients/runtime-status`](Topics/dartwic/clients/runtime-status.md) | Client → server → clients | Relays the validated runtime status reported by a connected client. |
| [`dartwic/clients/updated`](Topics/dartwic/clients/updated.md) | Server → clients | Publishes the current public profile and runtime identity of an updated client. |
| [`tempest/network/connections`](Topics/tempest/network/connections.md) | Server → clients | Reports observational socket paths for the selected peer. |
| [`tempest/network/traffic`](Topics/tempest/network/traffic.md) | Server → clients | Reports live command and telemetry activity on a connected TEMPEST peer. |
