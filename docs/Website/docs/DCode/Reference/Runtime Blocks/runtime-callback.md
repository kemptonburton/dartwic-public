---
title: callback
summary: Register an externally callable ordinary DCode function with a separate scope per invocation.
created: 2026-10-20T18:59
updated: 2026-10-22T17:41
---

## Syntax

```dcode
callback <name>(<arguments>):
```

## Available in

- File scope

## Native C++

Compiled with ordinary DCode function scope; concurrent calls use independent call frames.

## Lifecycle

Activation registers the callback. Direct calls and callDcodeCallback wait for a result; supported timeline calls yield only their bucket. startDcodeCallback admits independent background work and returns null, with later failures sent to ARGUS and logs. Calls may overlap. Reactivation replaces the registration; captured calls retain their previous version.

## Example

```dcode
callback name(arguments):
    return null
```
