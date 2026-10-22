---
title: "log_warning"
summary: "Append a warning line to a named ARGUS stream without creating an event."
---

## Syntax

```dcode
log_warning(stream, message)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Supported as a statement with a string-literal stream and a value expression converted to text, including a constructed string. Native statements do not return the accepted flag. Formatting and logging can allocate.

## Example

```dcode
log_warning("Device", message)
```
