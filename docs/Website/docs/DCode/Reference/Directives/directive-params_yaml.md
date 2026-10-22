---
title: "params = yaml"
summary: "Load YAML rows for template expansion. Array, object and null fields become DCode literals when inserted into an expression."
---

## Syntax

```dcode
<name> = yaml "<path>#<selector>"
```

## Available in

- File scope

## Example

```lua
params = yaml "./config.yaml#rows"
```
