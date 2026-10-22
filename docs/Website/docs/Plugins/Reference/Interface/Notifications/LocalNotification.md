---
title: "LocalNotification"
summary: "Live local notification. Repeated evidence updates preserve read/mute state; escalation requests attention."
---

## Import

```ts
import type { LocalNotification } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface LocalNotification {
    /** Stable id local to this client source. The host qualifies it with the source. */
    id: string;
    severity?: NotificationSeverity;
    title: string;
    description?: string;
    /** Live handlers are never serialized. Re-upsert after loading the plugin. */
    actions?: Array<{id: string; label: string; handler(): void | Promise<void>}>;
    silenceable?: boolean;
    active?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required | Stable id local to this client source. The host qualifies it with the source. |
| `severity` | `NotificationSeverity` | Optional |  |
| `title` | `string` | Required |  |
| `description` | `string` | Optional |  |
| `actions` | `Array<{id: string; label: string; handler(): void \| Promise<void>}>` | Optional | Live handlers are never serialized. Re-upsert after loading the plugin. |
| `silenceable` | `boolean` | Optional |  |
| `active` | `boolean` | Optional |  |
