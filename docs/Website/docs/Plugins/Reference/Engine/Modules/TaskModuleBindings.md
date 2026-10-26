---
title: "TaskModuleBindings"
summary: "Plugin-owned, configuration-only task/module association helper. bind wraps existing configure/cleanup callbacks without changing SDK ABI. Limits count configured tasks, including stopped ones. Claims commit after successful preparation and release on task destruction; ordinary cycles never enter it. Device access remains synchronized by the module."
---

## Declaration

```cpp
class TaskModuleBindings {
    using Key = std::pair<std::string, std::string>;
    struct State {
        std::mutex mutex;
        std::map<Key, std::set<std::string>> claims;
        std::map<std::string, Key> tasks;
        void release(const std::string& task) {
            std::scoped_lock lock(mutex);
            if (const auto found = tasks.find(task); found != tasks.end()) {
                auto claim = claims.find(found->second);
                if (claim != claims.end()) { claim->second.erase(task); if (claim->second.empty()) claims.erase(claim); }
                tasks.erase(found);
            }
        }
    };
    std::shared_ptr<State> state_ = std::make_shared<State>();
public:
    template<class Module, class Prepare>
    void bind(TaskTypeDefinition& definition, SDK_API* api, std::string plugin_id,
        std::string module_type_id, size_t max_per_type, Prepare prepare) {
        auto state = state_;
        auto previous_configure = definition.on_configure;
        auto previous_cleanup = definition.cleanup;
        definition.on_configure = [=](const TaskTypeDefinition& type, TaskRuntime& runtime) {
            auto module = taskModule<Module>(api, runtime, plugin_id, module_type_id);
            const auto task = runtime.getTaskName();
            const Key next{taskArgument<std::string>(runtime, "module_instance_name"), runtime.getTaskType()};
            bool inserted = false;
            {
                std::scoped_lock lock(state->mutex);
                auto& owners = state->claims[next];
                if (!owners.contains(task) && max_per_type && owners.size() >= max_per_type)
                    throw std::runtime_error("Module `" + next.first + "` already has " + next.second + " task `" + *owners.begin() + "`.");
                inserted = owners.insert(task).second;
            }
            try {
                if (previous_configure) previous_configure(type, runtime);
                prepare(module, runtime);
            } catch (...) {
                if (inserted) { std::scoped_lock lock(state->mutex); auto& owners = state->claims[next]; owners.erase(task); if (owners.empty()) state->claims.erase(next); }
                throw;
            }
            {
                std::scoped_lock lock(state->mutex);
                const auto old = state->tasks.find(task);
                if (old != state->tasks.end() && old->second != next) {
                    auto& owners = state->claims[old->second]; owners.erase(task);
                    if (owners.empty()) state->claims.erase(old->second);
                }
                state->tasks[task] = next;
            }
        };
        definition.cleanup = [=](TaskRuntime& runtime) {
            state->release(runtime.getTaskName());
            if (previous_cleanup) previous_cleanup(runtime);
        };
    }
};
```
