---
title: channel_calculation
summary: Define a reactive calculation for a RAPID channel.
created: 2026-08-04T17:38
updated: 2026-10-22T18:14
---

## Syntax

```dcode
channel_calculation <channel>:
```

## Available in

- File scope

## Native C++

Compiled calculations return a numeric result, or no result for null or fallthrough. A failed or missing target result uses the original submitted value and reports an ARGUS warning; dependency invocations suppress target publication. Runtime state supports DCode collections.

## Lifecycle

Activation registers explicit and detected dependencies. Accepted dependency value writes, including equal-valued writes, evaluate the calculation inline after the input commits; a numeric result is published to the target before the initiating call returns. A direct target write evaluates the calculation before committing. If a target calculation fails or returns no numeric result, the original submitted value is used subject to channel authority, earlier transformations are discarded, remaining target calculations are skipped, and an ARGUS warning identifies the calculation and fallback. Calculation side effects are not rolled back. A missing dependency result suppresses target publication; dependency evaluation errors are logged. Ordinary calculations are not initially evaluated merely by activation.

## Persistence

Calculation state remains available between evaluations while the calculation is loaded.

## Reload behavior

DARTWIC tracks changes to the block when loading the calculation.

## Runtime sections

- `depends_on`
- `calculation body`

## Example

```dcode
channel_calculation channel_name:
    return value
```
