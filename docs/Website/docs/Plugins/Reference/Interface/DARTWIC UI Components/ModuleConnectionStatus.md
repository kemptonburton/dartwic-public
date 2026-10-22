---
title: ModuleConnectionStatus
summary: Renders the shared live connection indicator for an opted-in module.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ModuleConnectionStatus } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ModuleConnectionStatus: HostComponent<ModuleConnectionStatusProps>;
```

## ModuleConnectionStatusProps

Props for the shared opt-in module connection indicator.

```ts
export interface ModuleConnectionStatusProps extends HostComponentProps {
    presentation: {
        channel: string;
        label?: string;
        endpoint?: string;
        connectedValue?: string | number | boolean;
    };
    showText?: boolean;
    compact?: boolean;
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `presentation` | `{<br>        channel: string;<br>        label?: string;<br>        endpoint?: string;<br>        connectedValue?: string \| number \| boolean;<br>    }` | Required |  |
| `showText` | `boolean` | Optional |  |
| `compact` | `boolean` | Optional |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
