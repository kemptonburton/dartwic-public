---
title: ConfigMapProps
summary: Props for session-shared configuration editing; resourceKey must uniquely identify one resource within a connection.
created: 2026-10-25T12:50
updated: 2026-10-25T20:52
---

## Import

```ts
import type { ConfigMapProps } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export interface ConfigMapProps extends Record<string, unknown> {
    /** Required standalone; inherited inside a registered custom module/task/settings editor. */
    definition?: ConfigMapDefinition;
    /** Required standalone; inherited inside a registered custom editor. Use the same key for every view of one document. */
    resourceKey?: string;
    context?: Record<string, any>;
    /** Render selected group IDs from the full definition. All views still share its one session, validation and adapter. */
    groupIds?: string[];
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `definition` | `ConfigMapDefinition` | Optional | Required standalone; inherited inside a registered custom module/task/settings editor. |
| `resourceKey` | `string` | Optional | Required standalone; inherited inside a registered custom editor. Use the same key for every view of one document. |
| `context` | `Record<string, any>` | Optional |  |
| `groupIds` | `string[]` | Optional | Render selected group IDs from the full definition. All views still share its one session, validation and adapter. |
