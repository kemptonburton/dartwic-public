---
title: rapid/get-persistence-diagnostics
summary: Returns persistence diagnostics.
created: 2026-09-04T17:13
updated: 2026-10-04T21:09
---

- **Category:** Channels and Persistence

## Request payload

This operation accepts an empty payload (`{}`).

## Response payload

| Field | Type | Description |
| --- | --- | --- |
| `diagnostics` | `object` | Persistence database health, writer state, queue depth, and error counters. |
