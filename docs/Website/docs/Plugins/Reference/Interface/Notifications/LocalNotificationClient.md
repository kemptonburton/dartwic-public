---
title: "LocalNotificationClient"
summary: "Source-isolated local services. Clear issues on recovery, discarded validation, or source removal.\nNo methods publish engine ARGUS events or RAPID channels."
---

## Import

```ts
import type { LocalNotificationClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface LocalNotificationClient {
    upsert(notification: LocalNotification): void;
    remove(id: string): void;
    reportIssue(issue: SettingsIssue): void;
    clearIssue(id: string): void;
    /** Remove this source's notifications and issues when unloading it. */
    clear(): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `upsert` | `void` | Required |  |
| `remove` | `void` | Required |  |
| `reportIssue` | `void` | Required |  |
| `clearIssue` | `void` | Required |  |
| `clear` | `void` | Required | Remove this source's notifications and issues when unloading it. |
