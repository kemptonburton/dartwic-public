---
title: ModuleInstanceConnection
summary: Renders the standard task-detail module selector, resource link, and live connection state.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ModuleInstanceConnection } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ModuleInstanceConnection: HostComponent<ModuleInstanceConnectionProps>;
```

## ModuleInstanceConnectionProps

Shared module selector, module link, and opt-in live connection status.

```ts
export interface ModuleInstanceConnectionProps extends ModuleInstanceSelectProps {
    /** Supporting copy shown beneath the shared control. */
    description?: string;
    /** Hides the selector and presents only the linked module. */
    showSelector?: boolean;
    /** Shows the module's plugin-declared connection state when available. */
    showConnectionStatus?: boolean;
    /** Shows connection-state text instead of a compact indicator. */
    statusText?: boolean;
    /** Uses the compact header/footer layout. */
    compact?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `description` | `string` | Optional | Supporting copy shown beneath the shared control. |
| `showSelector` | `boolean` | Optional | Hides the selector and presents only the linked module. |
| `showConnectionStatus` | `boolean` | Optional | Shows the module's plugin-declared connection state when available. |
| `statusText` | `boolean` | Optional | Shows connection-state text instead of a compact indicator. |
| `compact` | `boolean` | Optional | Uses the compact header/footer layout. |
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
