---
title: "at"
summary: "Declare a scheduled bucket runtime section. Labels are optional and unique. Its once memory lasts through the bucket execution and its handlers."
---

## Syntax

```dcode
at <T-/T+ time> [(label)]:
```

## Available in

- A mission-time task_timeline declaration

## Example

```dcode
at T-10s (operation):
    execute:
        pass
```
