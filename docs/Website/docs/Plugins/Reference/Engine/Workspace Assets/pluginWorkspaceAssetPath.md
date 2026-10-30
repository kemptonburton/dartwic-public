---
title: pluginWorkspaceAssetPath
summary: Portable assets/plugins/id/relative reference for authored shared plugin files. Bind the manifest's plugin ID. Validates segments and requires a file extension. No I/O or isolation from generic storage APIs.
created: 2026-10-22T02:44
updated: 2026-10-29T20:51
---

## Declaration

```cpp
inline std::string pluginWorkspaceAssetPath(const std::string& plugin_id, const std::string& relative) {
        workspaceAssetPath(plugin_id, "validation.json");
        const std::filesystem::path path(relative);
        if (path.is_absolute() || path.has_root_name() || relative.empty() || relative.find('\\') != std::string::npos)
            throw std::invalid_argument("Plugin asset files must be relative paths.");
        for (const auto& part : path) workspaceAssetPath(part.string(), "validation.json");
        workspaceAssetPath(plugin_id, path.filename().string());
        return "assets/plugins/" + plugin_id + "/" + relative;
    }
    using Transport = TEMPEST::Transport;
    using TransportPtr = std::shared_ptr<TEMPEST::Transport>;
    enum class TaskStructure {
        Unknown,
        Periodic,
        StateMachine,
        Sequence,
        Timeline,
        Worker
    };
    enum class ChannelField {
        VALUE,
        COMMANDED_BY,
        TIMESTAMP,
        UNITS,
        STALE_TIMEOUT,
        RECORD_MODE,
        CONTROL_POLICY,
        CONTROL_OWNER,
        ACTIVE_CONTROLLER,
        LINKED_CALCULATION_SCRIPTS,
        VALUE_OPTIONS,
        STARTUP_VALUE
    };
    enum class RecordMode {
        OnValueChange,
        Never,
        EveryValue,
        EveryValueExcludeAutorecord
    };
    enum class ControlPolicy {
        Free,
        Automatic,
        ManualOverride,
        ObserveOnly
    };

    struct ChannelValueOption {
        double value = 0.0;
        std::string label;
    };

    struct ChannelCalculationLink {
        std::string script;
        std::string relationship;
        uint32_t line_number = 0;
    };

    struct StartupValue {
        bool enabled = false;
        double value = 0.0;
    };

    enum class ChannelStorage {
        Dynamic,
        Fixed
    };
    struct FixedChannelHandle {
        uint32_t slot = 0;
        uint64_t binding_generation = 0;
        std::shared_ptr<const std::string> channel;
        const void* owner = nullptr;

        [[nodiscard]] bool valid() const noexcept {
            return binding_generation != 0 && channel && owner;
        }
    };
    using ChannelValue = std::variant<double, int, std::string, bool, RecordMode, ControlPolicy,
        std::vector<ChannelValueOption>, std::vector<ChannelCalculationLink>, StartupValue>;
    using OperationHandler = std::function<nlohmann::json(const nlohmann::json& payload)>;
    struct OperationArgumentDefinition {
        std::string name;
        std::string type;
        std::string description;
        bool required = false;
        std::optional<nlohmann::json> default_value;
        std::vector<nlohmann::json> choices;
    };
    struct OperationDefinition {
        std::string id;
        std::string name;
        std::string description;
        std::string category;
        std::vector<OperationArgumentDefinition> arguments;
        OperationHandler handler;
        bool allow_viewers = false;
    };
    struct TelemetryDefinition {
        std::string id;
        std::string name;
        std::string description;
        std::string delivery;
    };
    using DCodeFunctionHandler = std::function<nlohmann::json(nlohmann::json& payload)>;
    using DCodePreparedFunctionHandler = std::function<void(
        DCodePreparedValueView& input, DCodePreparedMutableValue& result)>;
    struct DCodeFunctionArgument {
        std::string name;
        std::string type;
        std::string doc;
        bool required = false;
        // Fixed list size and named dictionary fields are used by prepared
        // native calls; ordinary Lua values may still grow when unshaped.
        std::optional<size_t> list_length;
        std::shared_ptr<DCodeFunctionArgument> element;
        std::vector<DCodeFunctionArgument> fields;
    };

    struct TaskTypeDefinition;
    struct TaskTypeMetadata {
        std::string task_type;
        TaskStructure structure = TaskStructure::Unknown;
        std::string icon_url;
        std::string exposed_from;
        std::string expected_plugin_id;
        nlohmann::json default_arguments = nlohmann::json::object();
    };
    class TaskRuntime {
    public:
        virtual ~TaskRuntime() = default;

        virtual const std::string& getTaskName() const = 0;
        virtual const std::string& getTaskType() const = 0;
        virtual const nlohmann::json& getMetadata() const = 0;
        virtual const nlohmann::json& getArguments() const = 0;
        virtual double getElapsedSeconds() const = 0;
        virtual bool isStopRequested() const = 0;

        virtual void setRuntimeContext(const std::string& key, std::shared_ptr<void> value) = 0;
        virtual std::shared_ptr<void> getRuntimeContext(const std::string& key) const = 0;
        virtual void removeRuntimeContext(const std::string& key) = 0;
        virtual void clearRuntimeContext() = 0;
        // Keep new virtual functions appended so plugins built against the previous
        // TaskRuntime vtable retain the indices of all existing functions.
        virtual void setFixedInputChannels(std::vector<std::string> channels) = 0;
        virtual void recordWorkerCycle() = 0;

        template <typename T>
        void setTypedRuntimeContext(const std::string& key, const std::shared_ptr<T>& value) {
            setRuntimeContext(key, std::static_pointer_cast<void>(value));
        }

        template <typename T>
        std::shared_ptr<T> getTypedRuntimeContext(const std::string& key) const {
            return std::static_pointer_cast<T>(getRuntimeContext(key));
        }
    }
```
