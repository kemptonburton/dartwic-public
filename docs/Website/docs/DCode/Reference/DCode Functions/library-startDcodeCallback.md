---
title: "startDcodeCallback"
summary: "Start a registered DCode callback in the background and return null after admission."
---

Start a registered DCode callback in the background and return null after admission. Missing callbacks, invalid arguments and the 64 active-call limit fail immediately. Later body errors are reported to ARGUS and logs. Runs independently of the caller until completion or runtime shutdown, without inheriting the caller's task authority. Submission allocates and starts a worker; keep it outside real-time control paths.

## Syntax

```dcode
startDcodeCallback(callback_name, arguments)
```

## Available in

- Executable DCode bodies

## Native C++

Uses the same managed background callback execution as Lua and returns null.

## Example

```lua
startDcodeCallback(callback_name, arguments)
```
