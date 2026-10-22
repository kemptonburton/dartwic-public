---
title: "ResourceComponentProps"
summary: "Props supplied by the host to component resource contributions."
---

## Import

```ts
import type { ResourceComponentProps } from "@dartwic/interface-sdk";
```

## Declaration

```ts
export interface ResourceComponentProps {
    resource_name: string;
    resource_config: ResourceDefinition;
    resource_path: string;
    isLoaded: boolean;
    setIsLoaded(value: boolean): void;
    errorState: ResourceErrorState;
    setErrorState(value: ResourceErrorState | ((previous: ResourceErrorState) => ResourceErrorState)): void;
    getResourceContent(): Promise<string | null>;
    saveResourceContent(content: string, options?: SaveResourceContentOptions): Promise<unknown>;
    onLiveResourceChange(handler: (telemetry: unknown) => void): () => void;
    sendLiveResourceChange(payload?: Record<string, unknown>): Promise<unknown>;
    onLiveResourcePresence(handler: (telemetry: unknown) => void): () => void;
    sendLiveResourcePresence(payload?: Record<string, unknown>): Promise<unknown>;
    sendResourceSyncStatus(payload?: Record<string, unknown>): Promise<unknown>;
}
```

## Members

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `resource_name` | `string` | Required |  |
| `resource_config` | `ResourceDefinition` | Required |  |
| `resource_path` | `string` | Required |  |
| `isLoaded` | `boolean` | Required |  |
| `setIsLoaded` | `void` | Required |  |
| `errorState` | `ResourceErrorState` | Required |  |
| `setErrorState` | `void` | Required |  |
| `getResourceContent` | `Promise<string \| null>` | Required |  |
| `saveResourceContent` | `Promise<unknown>` | Required |  |
| `onLiveResourceChange` | `() => void` | Required |  |
| `sendLiveResourceChange` | `Promise<unknown>` | Required |  |
| `onLiveResourcePresence` | `() => void` | Required |  |
| `sendLiveResourcePresence` | `Promise<unknown>` | Required |  |
| `sendResourceSyncStatus` | `Promise<unknown>` | Required |  |
