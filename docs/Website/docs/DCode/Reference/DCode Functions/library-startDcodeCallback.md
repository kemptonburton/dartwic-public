---
title: startDcodeCallback
summary: Start a registered DCode callback in the background and return null after admission.
created: 2026-10-20T18:59
updated: 2026-10-22T17:41
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

```dcode
startDcodeCallback(callback_name, arguments)
```
