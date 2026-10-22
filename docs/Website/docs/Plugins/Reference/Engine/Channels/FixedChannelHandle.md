---
title: FixedChannelHandle
summary: Stable retained address of a fixed RAPID channel.
created: 2026-10-04T18:31
updated: 2026-10-20T18:59
---

Retain the returned handle in task instance state and reuse it in callbacks.

## Declaration

```cpp
struct FixedChannelHandle {
        uint32_t slot = 0;
        uint64_t binding_generation = 0;
        std::shared_ptr<const std::string> channel;
        const void* owner = nullptr;

        [[nodiscard]] bool valid() const noexcept {
            return binding_generation != 0 && channel && owner;
        }
    };
```
