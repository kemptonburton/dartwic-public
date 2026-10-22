---
title: log_error
summary: Append a red stderr/error line to a named ARGUS stream without creating an event.
created: 2026-10-04T18:31
updated: 2026-10-14T15:33
---

## Syntax

```dcode
log_error(stream, message)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Supported as a statement with a string-literal stream and a value expression converted to text, including a constructed string. Native statements do not return the accepted flag. Formatting and logging can allocate.

## Example

```lua
log_error("Device", message)
```
