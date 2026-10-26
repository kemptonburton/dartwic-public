---
title: getConfigMapChannels
summary: Derives channel trace rows from declared channel fields and binding columns, for ModuleRuntimeOverview or custom summaries. channelMode write means a device input published to RAPID; read means a RAPID command consumed by the device.
created: 2026-10-25T12:56
updated: 2026-10-25T20:52
---

## Import

```ts
import { getConfigMapChannels } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export function getConfigMapChannels(definition: ConfigMapDefinition, document: any): Array<{name: string; direction: 'input' | 'output'; detail: string}> {
    const at = (path: string) => path.split('.').reduce((value, key) => value?.[key], document);
    const result: Array<{name: string; direction: 'input' | 'output'; detail: string}> = [];
    const add = (field: ConfigMapField, value: any, detail: string, row?: any) => {
        value ??= typeof field.defaultValue === 'function' ? field.defaultValue(document, row) : field.defaultValue;
        if (field.type === 'channel' && typeof value === 'string' && value.trim())
            result.push({name: value, direction: (typeof field.channelMode === 'function' ? field.channelMode(document, row) : field.channelMode) === 'write' ? 'input' : 'output', detail});
    };
    for (const group of definition.groups) {
        for (const field of group.fields || []) add(field, at(field.path), field.label);
        for (const table of group.tables || []) {
            for (const row of at(table.path) || []) {
                const detail = table.columns.filter((column) => column.type !== 'channel')
                    .map((column) => `${column.label}: ${row[column.path] ?? ''}`).join(' · ');
                for (const column of table.columns) add(column, row[column.path], detail, row);
            }
        }
    }
    return result;
}
```
