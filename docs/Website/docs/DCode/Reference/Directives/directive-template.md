---
title: "template(params)"
summary: "Expand a runtime block or event declaration once per YAML row before either backend compiles it."
---

## Syntax

```dcode
template(<params>) <runtime block>
```

## Available in

- File scope

## Example

```lua
template(params) loop name 10:
    -- body
```
