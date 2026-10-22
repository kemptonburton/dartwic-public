---
title: "createNotificationClient"
summary: "Create a source-qualified notification and settings-issue client. Use the plugin id as source;\nstable local ids deduplicate updates. Clear on recovery and call clear() when the source is removed.\nRequires a host exposing notifications; older hosts report an explicit capability error."
---

## Import

```ts
import { createNotificationClient } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export function createNotificationClient(source: string): LocalNotificationClient {
    const notifications = getHostApi().notifications;
    if (!notifications) throw new Error("This interface host does not support local notifications.");
    return notifications.createClient(source);
}
```
