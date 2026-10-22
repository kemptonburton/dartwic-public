---
title: params = yaml
summary: Load YAML rows for template expansion. Array, object and null fields become DCode literals when inserted into an expression.
created: 2026-08-04T17:38
updated: 2026-10-22T17:41
---

## Syntax

```dcode
<name> = yaml "<path>#<selector>"
```

## Available in

- File scope

## Example

```dcode
params = yaml "./config.yaml#rows"
```
