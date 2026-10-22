---
title: ResourceSyncStatusIcon
summary: Show resource synchronization status.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ResourceSyncStatusIcon } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ResourceSyncStatusIcon: HostComponent<ResourceStatusIconProps>;
```

## ResourceStatusIconProps

Resource identity for the host presence and sync status icons.

```ts
export interface ResourceStatusIconProps extends HostComponentProps {
    resource_name?: string;
    resource_path?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `resource_name` | `string` | Optional |  |
| `resource_path` | `string` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
