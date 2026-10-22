---
title: tempest/job-cancel
summary: Requests cancellation of a detached job owned by the requesting client. Queued jobs cancel immediately; running jobs may continue briefly while cooperative cancellation completes.
created: 2026-08-03T16:00
updated: 2026-10-04T21:09
---

- **Category:** Jobs

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `job_id` | `string` | Required | Detached job identifier. |

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `job_id` | `string` | Detached job identifier. |
| `job_type` | `string` | Operation-specific job type. |
| `client_id` | `string` | Client that owns the job. |
| `state` | `string` | `queued`, `running`, `completed`, `failed`, or `canceled`. |
| `progress_rows` | `integer` | Completed work units reported by the job. |
| `total_rows` | `integer\|null` | Total work units when known, otherwise null. |
| `progress_percent` | `number` | Completion percentage from 0 through 100 when a total is known. |
| `status_message` | `string` | Current human-readable progress message. |
| `error` | `string` | Failure message, or an empty string when the job has not failed. |
| `metadata` | `object` | Operation-specific metadata supplied when the job was created. |
| `result` | `any JSON value` | Operation-specific result; meaningful after successful completion. |
| `created_at` | `integer` | Creation time in Unix-epoch milliseconds. |
| `started_at` | `integer` | Start time in Unix-epoch milliseconds, or 0 before execution starts. |
| `finished_at` | `integer` | Finish time in Unix-epoch milliseconds, or 0 until terminal. |
| `execution_lane` | `string` | `general` or `historical_query`. |
| `cancellation_requested` | `boolean` | Whether cancellation has been requested. |

## Errors

- `job_id` is required.
- The job does not exist or belongs to another client.
