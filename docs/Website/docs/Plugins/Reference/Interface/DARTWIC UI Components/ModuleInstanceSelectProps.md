---
title: "ModuleInstanceSelectProps"
summary: "Props for selecting a live module instance compatible with a plugin task."
---

## Import

```ts
import type { ModuleInstanceSelectProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ModuleInstanceSelectProps extends HostComponentProps {
    /** Engine plugin that must own every displayed module instance. */
    pluginId: string;
    /** Optional compatible module type IDs, in local or plugin-qualified form. */
    moduleTypeIds?: string[];
    /** Selected module-instance name. */
    value?: string;
    /** Called with the selected module-instance name. */
    onValueChange?: (value: string) => void;
    /** Empty-selection prompt. */
    placeholder?: string;
    /** Disables the selector. */
    disabled?: boolean;
    /** Shows loading, incompatibility, and empty-state diagnostics. */
    showStatus?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `pluginId` | `string` | Required | Engine plugin that must own every displayed module instance. |
| `moduleTypeIds` | `string[]` | Optional | Optional compatible module type IDs, in local or plugin-qualified form. |
| `value` | `string` | Optional | Selected module-instance name. |
| `onValueChange` | `(value: string) => void` | Optional | Called with the selected module-instance name. |
| `placeholder` | `string` | Optional | Empty-selection prompt. |
| `disabled` | `boolean` | Optional | Disables the selector. |
| `showStatus` | `boolean` | Optional | Shows loading, incompatibility, and empty-state diagnostics. |
