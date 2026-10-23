---
title: log
summary: Append an info line to a named ARGUS stream; returns whether the log queue accepted it in Lua.
created: 2026-10-04T18:31
updated: 2026-10-22T17:41
---

## Syntax

```dcode
log(stream, message)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Supported as a statement with a string-literal stream and a value expression converted to text, including a constructed string. Native statements do not return the accepted flag. Formatting and logging can allocate.

## Example

```dcode
log("Device", message)
```
