---
title: "ResourceErrorState"
summary: "Resource load or save failure state presented by the host."
---

## Import

```ts
import type { ResourceErrorState } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ResourceErrorState {
    error: boolean;
    message: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `error` | `boolean` | Required |  |
| `message` | `string` | Required |  |
