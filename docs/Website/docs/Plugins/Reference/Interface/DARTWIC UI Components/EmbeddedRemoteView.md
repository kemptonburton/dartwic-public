---
title: EmbeddedRemoteView
summary: Embed a remote engine view using the host component.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { EmbeddedRemoteView } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const EmbeddedRemoteView: HostComponent<EmbeddedRemoteViewProps>;
```

## EmbeddedRemoteViewProps

Remote view embedded in a plugin resource or schematic.

```ts
export interface EmbeddedRemoteViewProps extends HostComponentProps {
    commandEnabled?: boolean;
    schematicPath?: string;
    remoteViewName?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `commandEnabled` | `boolean` | Optional |  |
| `schematicPath` | `string` | Optional |  |
| `remoteViewName` | `string` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
