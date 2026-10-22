---
title: "type"
summary: "Declared ARGUS event type: message, warning, error, or abort. Defaults to message. Holds and prompts use their own functions."
---

## Syntax

```dcode
type: <type>
```

## Available in

- An event declaration

## Example

```lua
type: ${1|message,warning,error,abort|}
```
