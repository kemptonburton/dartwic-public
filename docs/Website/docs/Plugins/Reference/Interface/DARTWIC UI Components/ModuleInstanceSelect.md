---
title: ModuleInstanceSelect
summary: Selects only module instances owned by the requested plugin and compatible module types.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ModuleInstanceSelect } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ModuleInstanceSelect: HostComponent<ModuleInstanceSelectProps>;
```

## ModuleInstanceSelectProps

Props for selecting a live module instance compatible with a plugin task.

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

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `pluginId` | `string` | Required | Engine plugin that must own every displayed module instance. |
| `moduleTypeIds` | `string[]` | Optional | Optional compatible module type IDs, in local or plugin-qualified form. |
| `value` | `string` | Optional | Selected module-instance name. |
| `onValueChange` | `(value: string) => void` | Optional | Called with the selected module-instance name. |
| `placeholder` | `string` | Optional | Empty-selection prompt. |
| `disabled` | `boolean` | Optional | Disables the selector. |
| `showStatus` | `boolean` | Optional | Shows loading, incompatibility, and empty-state diagnostics. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
