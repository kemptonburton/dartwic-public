---
title: "BaseNodeConfigProps"
summary: "Shared Node Setup and Node Appearance editor with optional dedicated tabs."
---

## Import

```ts
import type { BaseNodeConfigProps } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface BaseNodeConfigProps extends SchematicNodeConfigProps {
    sections?: SchematicNodeConfigSection[];
    artworkOnly?: boolean;
    sharedOnly?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `sections` | `SchematicNodeConfigSection[]` | Optional |  |
| `artworkOnly` | `boolean` | Optional |  |
| `sharedOnly` | `boolean` | Optional |  |
