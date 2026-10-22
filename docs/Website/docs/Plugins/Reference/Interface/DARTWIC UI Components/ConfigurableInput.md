---
title: ConfigurableInput
summary: Edits a configurable literal, channel reference, or expression value.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { ConfigurableInput } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ConfigurableInput: HostComponent<ConfigurableInputProps>;
```

## ConfigurableInputProps

Props for editing a serialized configurable-input expression.

```ts
export interface ConfigurableInputProps extends HostComponentProps {
    /** Serialized configurable-input state. */
    initialData: Record<string, unknown>;
    /** Called whenever the serialized state changes. */
    onDataChange: (nextData: Record<string, unknown>) => void;
    /** Input kinds hidden from the editor. */
    excludedTypes?: string[];
    /** Uses the compact editor layout. */
    compact?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `initialData` | `Record<string, unknown>` | Required | Serialized configurable-input state. |
| `onDataChange` | `(nextData: Record<string, unknown>) => void` | Required | Called whenever the serialized state changes. |
| `excludedTypes` | `string[]` | Optional | Input kinds hidden from the editor. |
| `compact` | `boolean` | Optional | Uses the compact editor layout. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
