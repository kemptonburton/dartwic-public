---
title: CardDescription
summary: Card Description using the host's content panels presentation.
created: 2026-08-04T17:38
updated: 2026-10-11T21:44
---

## Import

```ts
import { CardDescription } from "@dartwic/interface-sdk/ui";
```

## Declaration

```ts
export const CardDescription: HostComponent<CardDescriptionProps>;
```

## CardDescriptionProps

Props accepted by a card description.

```ts
export interface CardDescriptionProps extends HostComponentProps {}
```

| Prop | Type | Requirement | Description |
| --- | --- | --- | --- |
| `className` | `string` | Optional | Additional Tailwind or host CSS classes. |
| `children` | `HostNode` | Optional | Child content rendered by the host component. |
| `id` | `string` | Optional | Optional DOM identifier. |
| `style` | `Record<string, unknown>` | Optional | Inline style values passed to the host component. |
