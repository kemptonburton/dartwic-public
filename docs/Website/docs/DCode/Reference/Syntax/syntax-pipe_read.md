---
title: "pipe read"
summary: "Read a RAPID channel value or typed metadata field."
---

## Syntax

```dcode
|channel|[:field]
```

## Available in

- File scope
- Executable DCode bodies

## Native C++

Static value pipes use prepared bindings. Static metadata reads use the engine host API; they are outside the prepared value path.
