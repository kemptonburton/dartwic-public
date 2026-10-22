---
title: "SaveResourceContentOptions"
summary: "Options controlling resource save feedback."
---

## Import

```ts
import type { SaveResourceContentOptions } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SaveResourceContentOptions {
    /** Suppresses the successful-save toast. Save failures are still surfaced. */
    silent?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `silent` | `boolean` | Optional | Suppresses the successful-save toast. Save failures are still surfaced. |
