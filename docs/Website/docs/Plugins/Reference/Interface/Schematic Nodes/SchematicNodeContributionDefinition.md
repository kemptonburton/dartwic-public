---
title: "SchematicNodeContributionDefinition"
summary: "Registers a schematic node under a plugin-qualified type."
---

## Import

```ts
import type { SchematicNodeContributionDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SchematicNodeContributionDefinition extends Omit<SchematicNodeDefinition, "type">, NamedContribution {}
```
