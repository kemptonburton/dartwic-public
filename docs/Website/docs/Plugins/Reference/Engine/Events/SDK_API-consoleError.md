---
title: "SDK_API::consoleError"
summary: "Raises an operator-visible error and returns the created event identifier."
---

## Declaration

```cpp
virtual int consoleError(
            std::string message_title,
            std::string message_description,
            std::vector<std::string> tags,
            std::string resolution,
            int auto_acknowledge,
            double separation_seconds
        ) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `message_title` | Short error title. |
| `message_description` | Detailed error description. |
| `tags` | Searchable event tags. |
| `resolution` | Suggested operator resolution. |
| `auto_acknowledge` | Non-zero to acknowledge automatically. |
| `separation_seconds` | Required finite nonnegative quiet interval; zero requires explicit stop. |

## Returns

The created ARGUS event identifier.
