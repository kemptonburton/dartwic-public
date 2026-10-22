---
title: TaskBindingTableProps
summary: Standard task binding table shared by plugin task editors.
created: 2026-10-04T18:31
updated: 2026-10-04T21:24
---

## Import

```ts
import type { TaskBindingTableProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export interface TaskBindingTableProps extends HostComponentProps {
    title?: string;
    bindings: TaskBinding[];
    onBindingsChange: (bindings: TaskBinding[]) => void;
    bindingTypes: Array<{value: string; label: string}>;
    channelMode?: "read" | "write";
    typeKey?: string;
    addressKey?: string;
    channelKey?: string;
    typeLabel?: string;
    addressLabel?: string;
    channelLabel?: string;
    channelPlaceholder?: string;
    emptyMessage?: string;
    addLabel?: string;
    addDisabled?: boolean;
    normalizeChannelValue?: (value: string) => string;
    createBinding?: (sequence: number) => TaskBinding;
    /** Optional plugin-defined columns rendered with the standard host table styling. */
    columns?: Array<{
        key?: string;
        label: HostNode;
        width?: string;
        render: (binding: TaskBinding, index: number, updateBinding: (binding: TaskBinding) => void) => HostNode;
    }>;
    /** Optional controls replacing the standard single add button. */
    headerActions?: HostNode;
    /** Minimum width of the horizontally scrollable table content. */
    minTableWidth?: string;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `title` | `string` | Optional |  |
| `bindings` | `TaskBinding[]` | Required |  |
| `onBindingsChange` | `(bindings: TaskBinding[]) => void` | Required |  |
| `bindingTypes` | `Array<{value: string; label: string}>` | Required |  |
| `channelMode` | `"read" \| "write"` | Optional |  |
| `typeKey` | `string` | Optional |  |
| `addressKey` | `string` | Optional |  |
| `channelKey` | `string` | Optional |  |
| `typeLabel` | `string` | Optional |  |
| `addressLabel` | `string` | Optional |  |
| `channelLabel` | `string` | Optional |  |
| `channelPlaceholder` | `string` | Optional |  |
| `emptyMessage` | `string` | Optional |  |
| `addLabel` | `string` | Optional |  |
| `addDisabled` | `boolean` | Optional |  |
| `normalizeChannelValue` | `(value: string) => string` | Optional |  |
| `createBinding` | `(sequence: number) => TaskBinding` | Optional |  |
| `columns` | `Array<{<br>        key?: string;<br>        label: HostNode;<br>        width?: string;<br>        render: (binding: TaskBinding, index: number, updateBinding: (binding: TaskBinding) => void) => HostNode;<br>    }>` | Optional | Optional plugin-defined columns rendered with the standard host table styling. |
| `headerActions` | `HostNode` | Optional | Optional controls replacing the standard single add button. |
| `minTableWidth` | `string` | Optional | Minimum width of the horizontally scrollable table content. |
