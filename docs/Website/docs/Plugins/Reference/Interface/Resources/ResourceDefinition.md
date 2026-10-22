---
title: "ResourceDefinition"
summary: "Complete configuration for an interface resource."
---

## Import

```ts
import type { ResourceDefinition } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ResourceDefinition {
    name: string;
    /** Stable runtime, storage, link, tab, and collaboration identity. */
    resourceName?: string;
    label?: string;
    icon?: any;
    type: ResourceType;
    component?: any;
    show_in_resource_tabs?: boolean;
    file_extension?: string;
    file_extensions?: string[];
    excluded_file_names?: string[];
    excluded_paths?: string[];
    show_file_extensions?: boolean;
    enable_directory_resource_groups?: boolean;
    resource_on_create_file_data?: string;
    resource_on_create_file_dialog?: any;
    resource_on_delete_function?: any;
    get_tree_file_icon_src?: any;
    tree_file_icon?: any;
    tree_directory_icon?: any;
    file_icons?: Record<string, any>;
    context_label?: string;
    context_config?: any;
    context_default_content?: any;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `name` | `string` | Required |  |
| `resourceName` | `string` | Optional | Stable runtime, storage, link, tab, and collaboration identity. |
| `label` | `string` | Optional |  |
| `icon` | `any` | Optional |  |
| `type` | `ResourceType` | Required |  |
| `component` | `any` | Optional |  |
| `show_in_resource_tabs` | `boolean` | Optional |  |
| `file_extension` | `string` | Optional |  |
| `file_extensions` | `string[]` | Optional |  |
| `excluded_file_names` | `string[]` | Optional |  |
| `excluded_paths` | `string[]` | Optional |  |
| `show_file_extensions` | `boolean` | Optional |  |
| `enable_directory_resource_groups` | `boolean` | Optional |  |
| `resource_on_create_file_data` | `string` | Optional |  |
| `resource_on_create_file_dialog` | `any` | Optional |  |
| `resource_on_delete_function` | `any` | Optional |  |
| `get_tree_file_icon_src` | `any` | Optional |  |
| `tree_file_icon` | `any` | Optional |  |
| `tree_directory_icon` | `any` | Optional |  |
| `file_icons` | `Record<string, any>` | Optional |  |
| `context_label` | `string` | Optional |  |
| `context_config` | `any` | Optional |  |
| `context_default_content` | `any` | Optional |  |
