---
title: "PopupUiDefinition"
summary: "A named, host-modal workflow which receives one or more merge-compatible backend requests."
---

## Import

```ts
import type { PopupUiDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface PopupUiDefinition extends NamedContribution {
    component: (props: {
        requests: Array<Record<string, any>>;
        complete(requestId: string, result: unknown): Promise<unknown>;
        dismiss(requestId: string, result?: unknown): Promise<unknown>;
    }) => any;
    /** Human-readable request contract shown in generated plugin documentation. */
    requestType?: string;
    /** Human-readable completion-result contract shown in generated plugin documentation. */
    resultType?: string;
    /** Optional JSON Schema describing each backend request payload. */
    requestSchema?: Record<string, unknown>;
    /** Optional JSON Schema describing the result returned for each completed request. */
    resultSchema?: Record<string, unknown>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `component` | `(props: {<br>        requests: Array<Record<string, any>>;<br>        complete(requestId: string, result: unknown): Promise<unknown>;<br>        dismiss(requestId: string, result?: unknown): Promise<unknown>;<br>    }) => any` | Required |  |
| `requestType` | `string` | Optional | Human-readable request contract shown in generated plugin documentation. |
| `resultType` | `string` | Optional | Human-readable completion-result contract shown in generated plugin documentation. |
| `requestSchema` | `Record<string, unknown>` | Optional | Optional JSON Schema describing each backend request payload. |
| `resultSchema` | `Record<string, unknown>` | Optional | Optional JSON Schema describing the result returned for each completed request. |
