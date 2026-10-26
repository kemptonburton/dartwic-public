---
title: "createModuleConfigAdapter"
summary: "Use the existing module JSON resource and detached save/reload job. Completion includes reload/rebinding and a fresh read; failures reject, and timeouts require observation before retry. No new storage is created. Configuration-time I/O only."
---

## Import

```ts
import { createModuleConfigAdapter } from "@dartwic/interface-sdk/config-maps";
```

## Declaration

```ts
export function createModuleConfigAdapter(): Pick<ConfigMapDefinition, 'load' | 'apply'> {
    const load = async (context: any) => {
        const source = await moduleSource(context);
        const file = await request(context, 'dartwic/get-file', {rootDir: 'projects_directory', filePath: source.path});
        return JSON.parse(file.content);
    };
    return {load, async apply(next, previous, context) {
        const source = await moduleSource(context);
        if (next.name !== previous.name || next.name !== source.name) throw new Error('Rename modules through the resource editor.');
        const started = await request(context, 'dartwic/modules/save-and-reload-module-instance/start', {
            rootDir: 'projects_directory', path: source.path, content: JSON.stringify(next, null, 2), instanceName: source.name,
        });
        const jobId = started.job_id || started.id;
        if (!jobId) throw new Error('Module reload returned no job ID. Refresh before retrying.');
        const deadline = Date.now() + 120000;
        for (;;) {
            const status = await request(context, 'tempest/job-status', {job_id: jobId});
            const job = status.job || status;
            if (['failed', 'canceled', 'cancelled'].includes(job.state)) throw new Error(job.error || job.message || 'Module reload failed.');
            if (job.state === 'completed') {
                if (job.result?.error) throw new Error(job.result?.payload?.error || 'Module reload failed.');
                break;
            }
            if (Date.now() >= deadline) throw new Error('Module reload outcome is unknown; refresh before retrying.');
            await new Promise((resolve) => globalThis.setTimeout(resolve, 250));
        }
        const accepted = await load(context);
        changed('modules', 'tasks', 'channels');
        return accepted;
    }};
}
```
