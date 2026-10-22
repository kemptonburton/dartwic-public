---
title: "ValueFormatDefinition"
summary: "Numeric presentation and editing selected by `format=plugin-id.local-id` in Units."
---

## Import

```ts
import type { ValueFormatDefinition } from "@dartwic/interface-sdk/types";
```

## Declaration

```ts
export interface ValueFormatDefinition extends NamedContribution {
    format(value: number, options?: {locale?: string; timeZone?: string}): string;
    toDraft?(value: number): string;
    parse?(draft: string): number;
    inputType?: "text" | "number" | "datetime-local";
    placeholder?: string;
    help?: string;
    Editor?: (props: {value: number; onCommit(value: number): Promise<void>; onCancel?(): void; disabled: boolean}) => any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `format` | `string` | Required |  |
| `toDraft` | `string` | Optional |  |
| `parse` | `number` | Optional |  |
| `inputType` | `"text" \| "number" \| "datetime-local"` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `help` | `string` | Optional |  |
| `Editor` | `(props: {value: number; onCommit(value: number): Promise<void>; onCancel?(): void; disabled: boolean}) => any` | Optional |  |
