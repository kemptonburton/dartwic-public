---
title: "SDK_API::registerPeer"
summary: "Registers a plugin-qualified peer definition with one transport factory."
---

## Declaration

```cpp
virtual std::string registerPeer(PeerDefinition definition) = 0;
```

## Parameters

| Name | Description |
| --- | --- |
| `definition` | Local ID, display name, editable defaults, protocol, transport, and handlers. |

## Returns

The plugin-qualified peer ID used by tempest/peers/connect.
