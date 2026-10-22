---
title: "dartwic/call-function"
summary: "Calls function."
---

- **Category:** DCode

## Request payload

| Field | Type | Requirement | Description |
| --- | --- | --- | --- |
| `function_name` | `string` | Required | Registered CAESAR/DCode function to invoke. |
| `argument_list` | `array<FunctionArgument>` | Required | Arguments; every item must contain string `id`, `name`, and `value` fields. |

## Response payload

This operation returns an empty payload (`{}`).
