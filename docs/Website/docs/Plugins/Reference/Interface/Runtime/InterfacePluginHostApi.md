---
title: InterfacePluginHostApi
summary: Host services and shared component inventory supplied to a loaded interface plugin.
created: 2026-08-04T17:38
updated: 2026-10-22T02:44
---

## Import

```ts
import type { InterfacePluginHostApi } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface InterfacePluginHostApi {
    /** Read a UTF-8 file relative to an installed Interface plugin. Use assets/relative for bundled data, or createInterfacePluginAssetClient for validated asset-only reads. Missing/escaping files reject; updates replace bundled content. */
    readPluginFile(pluginId: string, relativePath: string): Promise<string>;
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
| `readPluginFile` | `Promise<string>` | Required | Read a UTF-8 file relative to an installed Interface plugin. Use assets/relative for bundled data, or createInterfacePluginAssetClient for validated asset-only reads. Missing/escaping files reject; updates replace bundled content. |
| `notifications` | `{createClient(source: string): import("../notifications/index.ts").LocalNotificationClient}` | Optional | Optional local notification/issue services. Older hosts may not expose this capability. |
| `React` | `Record<string, unknown>` | Required |  |
| `useDartwic` | `(...args: unknown[]) => unknown` | Required |  |
| `components` | `Record<string, unknown>` | Required |  |
| `helpers` | `Record<string, unknown>` | Required |  |
| `hooks` | `Record<string, (...args: any[]) => any>` | Required |  |
| `sdk` | `{<br>        styling: {<br>            cn: (...inputs: unknown[]) => string;<br>        };<br>        hooks: Record<string, (...args: any[]) => any>;<br>    }` | Required |  |
