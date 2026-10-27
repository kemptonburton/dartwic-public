---
title: "SDK_API::registerPeerTransport"
summary: "Register a transport carrying DARTWIC messages to another peer. The Engine supplies identity, registration and application protocol."
---

## Declaration

```cpp
virtual std::string registerPeerTransport(PeerTransportDefinition definition) {
            PeerDefinition peer;
            peer.id=std::move(definition.id);peer.name=std::move(definition.name);
            peer.version=definition.version;peer.default_config=std::move(definition.default_config);
            peer.protocol_id=std::move(definition.protocol_id);peer.protocol_version=definition.protocol_version;
            peer.engine_protocol=definition.engine_protocol;peer.create_transport=std::move(definition.create);
            peer.configure=std::move(definition.configure);
            return registerPeer(std::move(peer));
        }
```

## Parameters

| Name | Description |
| --- | --- |
| `definition` | Connection label, default settings, and transport factory. |

## Returns

The plugin-qualified transport identifier.
