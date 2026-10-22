---
title: "SettingsIssue"
summary: "Explicitly owned warning/error. Reading or muting its notification does not resolve its settings badges."
---

## Import

```ts
import type { SettingsIssue } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface SettingsIssue {
    id: string;
    severity: "warning" | "error";
    title: string;
    description: string;
    location: SettingsDestination;
    /** false for inline field validation: badges without notification spam. */
    notify?: boolean;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `id` | `string` | Required |  |
| `severity` | `"warning" \| "error"` | Required |  |
| `title` | `string` | Required |  |
| `description` | `string` | Required |  |
| `location` | `SettingsDestination` | Required |  |
| `notify` | `boolean` | Optional | false for inline field validation: badges without notification spam. |
