---
title: "InterfacePluginHostApi"
summary: "Host services and shared component inventory supplied to a loaded interface plugin."
---

## Import

```ts
import type { InterfacePluginHostApi } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface InterfacePluginHostApi {
    /** Optional local notification/issue services. Older hosts may not expose this capability. */
    notifications?: {createClient(source: string): import("../notifications/index.ts").LocalNotificationClient};
    React: Record<string, unknown>;
    useDartwic: (...args: unknown[]) => unknown;
    components: Record<string, unknown>;
    helpers: Record<string, unknown>;
    hooks: Record<string, (...args: any[]) => any>;
    sdk: {
        styling: {
            cn: (...inputs: unknown[]) => string;
        };
        hooks: Record<string, (...args: any[]) => any>;
    };
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `notifications` | `{createClient(source: string): import("../notifications/index.ts").LocalNotificationClient}` | Optional | Optional local notification/issue services. Older hosts may not expose this capability. |
| `React` | `Record<string, unknown>` | Required |  |
| `useDartwic` | `(...args: unknown[]) => unknown` | Required |  |
| `components` | `Record<string, unknown>` | Required |  |
| `helpers` | `Record<string, unknown>` | Required |  |
| `hooks` | `Record<string, (...args: any[]) => any>` | Required |  |
| `sdk` | `{<br>        styling: {<br>            cn: (...inputs: unknown[]) => string;<br>        };<br>        hooks: Record<string, (...args: any[]) => any>;<br>    }` | Required |  |
