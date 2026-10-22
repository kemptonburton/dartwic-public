---
title: releaseHold
summary: Release all active ARGUS hold requests with this title on the current engine. Returns 1 when matching requests are released, or 0 when none match. This does not resume an unrelated timeline clock hold.
created: 2026-08-04T17:39
updated: 2026-10-22T17:41
---

## Syntax

```dcode
releaseHold(title)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Native C++ calls this function through the engine host. It can allocate or block; review use in a control callback.

## Example

```dcode
releaseHold(title)
```
