---
title: "ModuleConnectionStatusProps"
summary: "Props for the shared opt-in module connection indicator."
---

## Import

```ts
import type { ModuleConnectionStatusProps } from "@dartwic/interface-sdk/ui";
```

## Declaration

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

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `presentation` | `{<br>        channel: string;<br>        label?: string;<br>        endpoint?: string;<br>        connectedValue?: string \| number \| boolean;<br>    }` | Required |  |
| `showText` | `boolean` | Optional |  |
| `compact` | `boolean` | Optional |  |
