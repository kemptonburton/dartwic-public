---
title: "EmbeddedRemoteViewProps"
summary: "Remote view embedded in a plugin resource or schematic."
---

## Import

```ts
import type { EmbeddedRemoteViewProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface EmbeddedRemoteViewProps extends HostComponentProps {
    commandEnabled?: boolean;
    schematicPath?: string;
    remoteViewName?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `commandEnabled` | `boolean` | Optional |  |
| `schematicPath` | `string` | Optional |  |
| `remoteViewName` | `string` | Optional |  |
