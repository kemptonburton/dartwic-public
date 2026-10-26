---
title: ConfigMapField
summary: One reusable cell. Standalone editors commit text/numbers on Enter and selections immediately; resource sheets use Apply, while plugin settings save on blur. Validation is synchronous; persistence and device application belong to the adapter.
created: 2026-10-25T12:50
updated: 2026-10-25T20:52
---

## Import

```ts
import type { ConfigMapField } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export interface ConfigMapField {
    path: string;
    label: string;
    type?: 'text' | 'number' | 'select' | 'toggle' | 'module' | 'channel';
    required?: boolean;
    /** Missing-value display/default; may be a pure (document, row) function for native defaults such as derived readback names. */
    defaultValue?: any;
    min?: number;
    max?: number;
    integer?: boolean;
    placeholder?: string;
    description?: string;
    /** Hidden metadata is still validated and searchable, but is not drawn as a column. */
    hidden?: boolean;
    options?: Array<{value: string; label: string}>;
    pluginId?: string;
    moduleTypeIds?: string[];
    /** Optional selector hint matching the native configured-task limit; zero/omitted is unlimited. Engine validation remains authoritative. */
    maxTasksPerModule?: number;
    channelMode?: 'read' | 'write' | ((document: any, row?: any) => 'read' | 'write');
    parse?(raw: string): any;
    validate?(value: any, document: any, context: any): string;
    /** Custom cell must call onDraft for text changes and onCommit only for explicit acceptance. */
    render?(props: {value: any; draft: any; path: string; document: any; row?: any;
        onDraft(value: any): void; onDraftAt(path: string, value: any): void; onCommit(value: any): void; context: any; disabled: boolean}): any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `path` | `string` | Required |  |
| `label` | `string` | Required |  |
| `type` | `'text' \| 'number' \| 'select' \| 'toggle' \| 'module' \| 'channel'` | Optional |  |
| `required` | `boolean` | Optional |  |
| `defaultValue` | `any` | Optional | Missing-value display/default; may be a pure (document, row) function for native defaults such as derived readback names. |
| `min` | `number` | Optional |  |
| `max` | `number` | Optional |  |
| `integer` | `boolean` | Optional |  |
| `placeholder` | `string` | Optional |  |
| `description` | `string` | Optional |  |
| `hidden` | `boolean` | Optional | Hidden metadata is still validated and searchable, but is not drawn as a column. |
| `options` | `Array<{value: string; label: string}>` | Optional |  |
| `pluginId` | `string` | Optional |  |
| `moduleTypeIds` | `string[]` | Optional |  |
| `maxTasksPerModule` | `number` | Optional | Optional selector hint matching the native configured-task limit; zero/omitted is unlimited. Engine validation remains authoritative. |
| `channelMode` | `'read' \| 'write' \| ((document: any, row?: any) => 'read' \| 'write')` | Optional |  |
| `parse` | `any` | Optional |  |
| `validate` | `string` | Optional |  |
| `render` | `any` | Optional | Custom cell must call onDraft for text changes and onCommit only for explicit acceptance. |
