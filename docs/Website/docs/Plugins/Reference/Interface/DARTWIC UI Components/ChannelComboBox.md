---
title: ChannelComboBox
summary: Selects a DARTWIC channel and, optionally, one of its fields.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { ChannelComboBox } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ChannelComboBox: HostComponent<ChannelComboBoxProps>;
```

## ChannelComboBoxProps

Props for the host channel and field selector.

```ts
export interface ChannelComboBoxProps extends HostComponentProps {
    /** Initial `|channel|` or `|channel|:field` selection. */
    initialValue?: string;
    /** Controlled selection override. */
    overrideValue?: string;
    /** Called with the selected channel value path. */
    onSelect?: (channelValuePath: string) => void;
    /** Limits fields to readable or writable channel fields. */
    mode?: "read" | "write";
    /** Shows the field selector beside the channel selector. */
    showFieldSelector?: boolean;
    /** Empty-selection placeholder. */
    placeholder?: string;
    /** Classes applied to the channel selector. */
    channelComboboxClassName?: string;
    /** Classes applied to the field selector. */
    fieldComboboxClassName?: string;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `initialValue` | `string` | Optional | Initial `\|channel\|` or `\|channel\|:field` selection. |
| `overrideValue` | `string` | Optional | Controlled selection override. |
| `onSelect` | `(channelValuePath: string) => void` | Optional | Called with the selected channel value path. |
| `mode` | `"read" \| "write"` | Optional | Limits fields to readable or writable channel fields. |
| `showFieldSelector` | `boolean` | Optional | Shows the field selector beside the channel selector. |
| `placeholder` | `string` | Optional | Empty-selection placeholder. |
| `channelComboboxClassName` | `string` | Optional | Classes applied to the channel selector. |
| `fieldComboboxClassName` | `string` | Optional | Classes applied to the field selector. |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
