---
title: "ModuleConnectionDefinition"
summary: "Static or instance-derived live connection presentation for a module."
---

## Import

```ts
import type { ModuleConnectionDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export type ModuleConnectionDefinition = ModuleConnectionPresentation | ((context: {
    instanceConfig: Record<string, any>;
    instanceName: string;
}) => ModuleConnectionPresentation | null);
```
