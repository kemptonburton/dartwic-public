---
title: firing_timeout_seconds
summary: Optional finite nonnegative inactivity timeout; defaults to zero.
created: 2026-10-28T19:18
updated: 2026-10-29T01:35
---

Optional finite nonnegative inactivity timeout; defaults to zero. A positive value ends firing and clears the generated firing channel after that many seconds without a new declaration detection, even if the last condition evaluation returned 1. Zero disables automatic expiry and requires a false trigger condition or stop_event_firing. Explicit triggers and calculated detections use this same timeout; there is no separate pulse duration.

## Syntax

```dcode
firing_timeout_seconds: <seconds>
```

## Available in

- An event declaration

## Example

```dcode
firing_timeout_seconds: 0
```
