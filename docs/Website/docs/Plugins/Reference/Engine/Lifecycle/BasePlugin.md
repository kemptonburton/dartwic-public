---
title: "BasePlugin"
summary: "Root object implemented by an engine plugin."
---

Registration and runtime operations are both exposed by API::SDK_API.

## Declaration

```cpp
class BasePlugin {
    public:
        virtual ~BasePlugin() = default;
        BasePlugin(nlohmann::json cfg, API::SDK_API* drtw) : config(std::move(cfg)), dartwic(drtw) {}
        virtual void onPluginLoaded() {}
        virtual Modules::BaseModule* createModule(
            const std::string& module_type_id,
            nlohmann::json cfg,
            API::SDK_API* drtw
        ) {
            (void)module_type_id;
            (void)cfg;
            (void)drtw;
            return nullptr;
        }
        void setPluginId(const std::string& plugin_id_value) {
            plugin_id = plugin_id_value;
        }
        const std::string& getPluginId() const {
            return plugin_id;
        }

        nlohmann::json config = nlohmann::json::object();
        API::SDK_API* dartwic = nullptr;

    protected:
        std::string plugin_id;
    };
```
