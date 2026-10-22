---
title: ConsoleAlert
summary: Display an alert in the host console presentation.
created: 2026-10-04T18:31
updated: 2026-10-11T21:44
---

## Import

```ts
import { ConsoleAlert } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const ConsoleAlert: HostComponent<ConsoleAlertProps>;
```

## ConsoleAlertProps

Links active ARGUS alerts for the supplied channels.

```ts
export interface ConsoleAlertProps extends HostComponentProps {
    alertTags: string[];
}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `alertTags` | `string[]` | Required |  |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
