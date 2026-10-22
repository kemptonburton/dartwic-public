---
title: "SDK_API::registerDCodeFunction"
summary: "Registers one DCode function schema and its ordinary and optional prepared handlers."
---

## Declaration

```cpp
virtual std::string registerDCodeFunction(
            std::string local_id,
            std::string name,
            DCodeFunctionHandler handler,
            std::string doc = {},
            std::vector<DCodeFunctionArgument> input_arguments = {},
            std::vector<DCodeFunctionArgument> output_arguments = {},
            DCodePreparedFunctionHandler prepared_handler = {}
        ) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `local_id` | Identifier unique within the plugin. |
| `name` | Operator-facing function name. |
| `handler` | Synchronous JSON callback. It may mutate fixed-shape argument values in place; DCode aliases observe those changes after return. |
| `doc` | Function documentation shown by DCode tooling. |
| `input_arguments` | Validated input schema, including fixed list lengths and dictionary fields when prepared. |
| `output_arguments` | Validated result schema with the same shape rules. |
| `prepared_handler` | Optional synchronous typed handler. Its mutable fixed-shape argument views and result writer live only for the call; changing argument kind or collection shape fails the call. |

## Returns

The plugin-qualified DCode function identifier.
