---
title: "taskModule"
summary: "Resolves and retains a module at configuration time; rejects unavailable or incompatible instances. The retained object owns lifetime, not device locking."
---

## Declaration

```cpp
template<class T> std::shared_ptr<T> taskModule(SDK_API* api, const TaskRuntime& runtime,
    const std::string& plugin_id, const std::string& module_type_id) {
    const auto name = taskArgument<std::string>(runtime, "module_instance_name");
    auto module = std::dynamic_pointer_cast<T>(api->getModuleInstance(name));
    const auto qualified = module_type_id.find('.') == std::string::npos ? plugin_id + "." + module_type_id : module_type_id;
    if (!module || module->getPluginId() != plugin_id ||
        (module->getModuleTypeId() != module_type_id && module->getModuleTypeId() != qualified))
        throw std::runtime_error("Module `" + name + "` is missing or incompatible with " + qualified + ".");
    return module;
}
```
