---
title: "ModuleRuntimeChannel"
summary: "One live channel rendered beneath a linked module task."
---

## Import

```ts
import type { ModuleRuntimeChannel } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface ModuleRuntimeChannel {
    /** RAPID channel name used for live telemetry. */
    name: string;
    /** Optional shorter visible label; the channel name is used by default. */
    label?: string;
    /** Direction relative to the device. */
    direction?: "input" | "output" | "diagnostic";
    /** Optional register, address, or mapping detail. */
    detail?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required | RAPID channel name used for live telemetry. |
| `label` | `string` | Optional | Optional shorter visible label; the channel name is used by default. |
| `direction` | `"input" \| "output" \| "diagnostic"` | Optional | Direction relative to the device. |
| `detail` | `string` | Optional | Optional register, address, or mapping detail. |
