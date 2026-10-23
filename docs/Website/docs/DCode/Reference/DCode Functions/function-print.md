---
title: print
summary: Write values to stdout and the Engine log without creating an ARGUS event.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
print(...)
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Accepts one value expression as a statement. Combine text into one string before printing; comma-separated values are not supported by native code generation. Formatting and logging can allocate.

## Example

```dcode
print(value)
```
