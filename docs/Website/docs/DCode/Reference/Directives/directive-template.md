---
title: template(params)
summary: Expand a runtime block or event declaration once per YAML row before either backend compiles it.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
template(<params>) <runtime block>
```

## Available in

- File scope

## Example

```dcode
template(params) loop name 10:
    -- body
```
