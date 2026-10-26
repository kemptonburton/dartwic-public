---
title: ModuleUiDefinition
summary: Registers icon and panel components for a module type.
created: 2026-08-04T17:38
updated: 2026-10-25T20:52
---

## Import

```ts
import type { ModuleUiDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ModuleUiDefinition extends NamedContribution {
    /** Optional shared document declaration. An explicit panel owns its layout; omit panel for the automatic editor. */
    configMap?: ConfigMapDefinition;
    icon?: (props: {className?: string; size?: number; "aria-hidden"?: boolean}) => any;
    panel?: ModuleConfigDefinition["component"];
    /** Opts this module type into shared live connection status presentation. */
    connection?: ModuleConnectionDefinition;
    /** Host normalization metadata; the registrar sets this when an explicit panel accompanies configMap. */
    customConfigMapLayout?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `configMap` | `ConfigMapDefinition` | Optional | Optional shared document declaration. An explicit panel owns its layout; omit panel for the automatic editor. |
| `icon` | `(props: {className?: string; size?: number; "aria-hidden"?: boolean}) => any` | Optional |  |
| `panel` | `ModuleConfigDefinition["component"]` | Optional |  |
| `connection` | `ModuleConnectionDefinition` | Optional | Opts this module type into shared live connection status presentation. |
| `customConfigMapLayout` | `boolean` | Optional | Host normalization metadata; the registrar sets this when an explicit panel accompanies configMap. |
