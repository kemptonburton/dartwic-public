---
title: Jobs
summary: Inspect and control detached TEMPEST jobs that continue after the initiating request.
created: 2026-08-04T17:33
updated: 2026-10-20T18:59
---

| Operation | Description |
| --- | --- |
| [`tempest/job-cancel`](tempest/job-cancel.md) | Requests cancellation of a detached job owned by the requesting client. Queued jobs cancel immediately; running jobs may continue briefly while cooperative cancellation completes. |
| [`tempest/job-list`](tempest/job-list.md) | Lists detached jobs owned by the requesting client. |
| [`tempest/job-status`](tempest/job-status.md) | Returns the current state and result metadata for a detached job owned by the requesting client. |
