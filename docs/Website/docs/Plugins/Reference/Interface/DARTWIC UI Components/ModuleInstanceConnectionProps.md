---
title: "ModuleInstanceConnectionProps"
summary: "Shared module selector, module link, and opt-in live connection status."
---

## Import

```ts
import type { ModuleInstanceConnectionProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `description` | `string` | Optional | Supporting copy shown beneath the shared control. |
| `showSelector` | `boolean` | Optional | Hides the selector and presents only the linked module. |
| `showConnectionStatus` | `boolean` | Optional | Shows the module's plugin-declared connection state when available. |
| `statusText` | `boolean` | Optional | Shows connection-state text instead of a compact indicator. |
| `compact` | `boolean` | Optional | Uses the compact header/footer layout. |
