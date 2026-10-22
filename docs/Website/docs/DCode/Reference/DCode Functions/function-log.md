---
title: "log"
summary: "Append an info line to a named ARGUS stream; returns whether the log queue accepted it in Lua."
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
