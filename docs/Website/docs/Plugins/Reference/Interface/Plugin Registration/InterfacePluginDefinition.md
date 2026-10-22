---
title: "InterfacePluginDefinition"
summary: "Public definition consumed by `definePlugin`."
---

## Import

```ts
import type { InterfacePluginDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface InterfacePluginDefinition {
    id: string;
    name?: string;
    register(registry: InterfacePluginRegistrar): void;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `name` | `string` | Optional |  |
| `register` | `void` | Required |  |
