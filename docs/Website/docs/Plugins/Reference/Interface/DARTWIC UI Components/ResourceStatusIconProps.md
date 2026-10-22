---
title: "ResourceStatusIconProps"
summary: "Resource identity for the host presence and sync status icons."
---

## Import

```ts
import type { ResourceStatusIconProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ResourceStatusIconProps extends HostComponentProps {
    resource_name?: string;
    resource_path?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `resource_name` | `string` | Optional |  |
| `resource_path` | `string` | Optional |  |
