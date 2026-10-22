---
title: "channel_calculation"
summary: "Define a reactive calculation for a RAPID channel."
---

## Syntax

```dcode
channel_calculation <channel>:
```

## Available in

- File scope

## Native C++

Compiled calculations use the same inline dependency path. A numeric return publishes; null or falling through suppresses an update. Runtime state supports DCode collections.

## Lifecycle

Activation registers explicit and detected dependencies; dependency changes evaluate the calculation and update its target channel.

## Persistence

Calculation state remains available between evaluations while the calculation is loaded.

## Reload behavior

DARTWIC tracks changes to the block when loading the calculation.

## Runtime sections

- `depends_on`
- `calculation body`

## Example

```lua
channel_calculation channel_name:
    return value
```
