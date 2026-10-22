---
title: "callDcodeCallback"
summary: "Invoke a registered DCode callback with named arguments and wait for its result."
---

Invoke a registered DCode callback with named arguments and wait for its result. A timeline bucket yields while waiting, so other buckets and mission time continue. Outside a timeline this is synchronous. Missing callbacks, invalid arguments and body errors fail the call. No execution handle is returned.

## Syntax

```dcode
callDcodeCallback(callback_name, arguments)
```

## Available in

- Executable DCode bodies

## Native C++

Uses the engine callback registry with the same arguments and return values as Lua.

## Example

```dcode
callDcodeCallback(callback_name, arguments)
```
