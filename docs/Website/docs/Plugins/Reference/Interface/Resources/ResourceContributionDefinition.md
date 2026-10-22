---
title: "ResourceContributionDefinition"
summary: "Registers a resource type through the plugin registrar."
---

## Import

```ts
import type { ResourceContributionDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ResourceContributionDefinition extends ResourceDefinition {
    id: string;
    name: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `name` | `string` | Required |  |
