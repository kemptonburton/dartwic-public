---
title: "ModuleUiDefinition"
summary: "Registers icon and panel components for a module type."
---

## Import

```ts
import type { ModuleUiDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ModuleUiDefinition extends NamedContribution {
    icon?: (props: {className?: string; size?: number; "aria-hidden"?: boolean}) => any;
    panel?: ModuleConfigDefinition["component"];
    /** Opts this module type into shared live connection status presentation. */
    connection?: ModuleConnectionDefinition;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `icon` | `(props: {className?: string; size?: number; "aria-hidden"?: boolean}) => any` | Optional |  |
| `panel` | `ModuleConfigDefinition["component"]` | Optional |  |
| `connection` | `ModuleConnectionDefinition` | Optional | Opts this module type into shared live connection status presentation. |
