---
title: SchematicCommandAction
summary: Operator command exposed by a schematic node.
created: 2026-08-04T17:38
updated: 2026-10-11T21:36
---

## Import

```ts
import type { SchematicCommandAction } from "@dartwic/interface-sdk/schematic-nodes";
```

## Declaration

```ts
export interface SchematicCommandAction {
    id: string;
    label: string;
    disabled?: boolean;
    hidden?: boolean;
    description?: string;
    input?: {
        type?: "text" | "number";
        placeholder?: string;
        defaultValue?: unknown;
        min?: string | number;
        max?: string | number;
        step?: string | number;
    };
    choice?: {
        items: Array<{value: string; label: string; keywords?: string[]}>;
        defaultValue?: unknown;
        placeholder?: string;
        searchPlaceholder?: string;
        emptyPlaceholder?: string;
    };
    onRun?: (value?: unknown) => unknown | Promise<unknown>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `label` | `string` | Required |  |
| `disabled` | `boolean` | Optional |  |
| `hidden` | `boolean` | Optional |  |
| `description` | `string` | Optional |  |
| `input` | `{<br>        type?: "text" \| "number";<br>        placeholder?: string;<br>        defaultValue?: unknown;<br>        min?: string \| number;<br>        max?: string \| number;<br>        step?: string \| number;<br>    }` | Optional |  |
| `choice` | `{<br>        items: Array<{value: string; label: string; keywords?: string[]}>;<br>        defaultValue?: unknown;<br>        placeholder?: string;<br>        searchPlaceholder?: string;<br>        emptyPlaceholder?: string;<br>    }` | Optional |  |
| `onRun` | `(value?: unknown) => unknown \| Promise<unknown>` | Optional |  |
