---
title: SchematicNodeData
summary: Saved node data; custom fields are retained by normal editing and persistence.
created: 2026-11-12T15:51
updated: 2026-11-12T23:58
---

## Import

```ts
import type { SchematicNodeData } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicNodeData {
    [key: string]: any;
    preset_name?: string;
    general_settings?: Record<string, any>;
    connection_ports?: SchematicConnectionPort[];
    connection_port_aliases?: Record<string, string>;
    fluid_port_roles?: Record<string, SchematicHandleRole>;
    /** Independent passive flow groups. Omit to inherit renderer defaults; null uses shared Sink relay behavior; [] isolates every port. Unlisted ports remain isolated. Roles still apply and paths never activate flow by themselves. */
    fluid_paths?: SchematicFluidPath[] | null;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `preset_name` | `string` | Optional |  |
| `general_settings` | `Record<string, any>` | Optional |  |
| `connection_ports` | `SchematicConnectionPort[]` | Optional |  |
| `connection_port_aliases` | `Record<string, string>` | Optional |  |
| `fluid_port_roles` | `Record<string, SchematicHandleRole>` | Optional |  |
| `fluid_paths` | `SchematicFluidPath[] \| null` | Optional | Independent passive flow groups. Omit to inherit renderer defaults; null uses shared Sink relay behavior; [] isolates every port. Unlisted ports remain isolated. Roles still apply and paths never activate flow by themselves. |
