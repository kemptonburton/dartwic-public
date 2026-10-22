---
title: "Notifications"
summary: "Publish source-owned local messages and settings issues with explicit severity, actions, and destinations."
---

| Export | Import path | Description |
| --- | --- | --- |
| [createNotificationClient](createNotificationClient.md) | `@dartwic/interface-sdk` | Create a source-qualified notification and settings-issue client. Use the plugin id as source; |
| [LocalNotification](LocalNotification.md) | `@dartwic/interface-sdk` | Live local notification. Repeated evidence updates preserve read/mute state; escalation requests attention. |
| [LocalNotificationClient](LocalNotificationClient.md) | `@dartwic/interface-sdk` | Source-isolated local services. Clear issues on recovery, discarded validation, or source removal. |
| [NotificationSeverity](NotificationSeverity.md) | `@dartwic/interface-sdk` | Local notification severity. Actions are independent and appear in ACTIONS for any severity. |
| [SettingsDestination](SettingsDestination.md) | `@dartwic/interface-sdk` | Explicit settings destination; nestedTab selects a page's internal tab. |
| [SettingsIssue](SettingsIssue.md) | `@dartwic/interface-sdk` | Explicitly owned warning/error. Reading or muting its notification does not resolve its settings badges. |
