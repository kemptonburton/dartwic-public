---
title: SDK_API
summary: Host API available to engine plugins and their module instances.
created: 2026-09-04T17:13
updated: 2026-10-26T19:26
---

Registration functions qualify local identifiers as `<plugin-id>.<local-id>`. Channel authority calls require an active task or plugin loop controller.

## Declaration

```cpp
class SDK_API {
    public:
        SDK_API() = default;
        virtual ~SDK_API() = default;
        virtual double queryChannelField(const std::string& channel,
            ChannelField field,
            std::optional<ChannelValue> default_value) = 0;
        virtual void insertChannelField(const std::string& channel,
            ChannelField field,
            ChannelValue value,
            ChannelStorage storage = ChannelStorage::Dynamic) = 0;
        virtual void upsertChannelField(const std::string& channel,
            ChannelField field,
            ChannelValue value,
            ChannelStorage storage = ChannelStorage::Dynamic) = 0;
        virtual FixedChannelHandle createFixedChannel(const std::string& channel,
            double initial_value = 0.0) = 0;
        virtual double queryChannel(const FixedChannelHandle& handle,
            double default_value = 0.0) = 0;
        virtual bool upsertChannel(const FixedChannelHandle& handle, double value,
            std::optional<uint64_t> timestamp = std::nullopt) = 0;
        virtual bool removeChannel(const std::string& channel) = 0;
        virtual std::string registerModuleType(ModuleTypeDefinition definition) = 0;
        virtual std::string registerPeer(PeerDefinition definition) = 0;
        virtual std::string registerTaskType(std::string local_id, std::string name, TaskTypeDefinition definition) = 0;
        virtual std::string registerOperation(OperationDefinition definition) = 0;
        // Convenience for operations without argument metadata. Delegates to the
        // registered definition and does not add a virtual slot to the SDK ABI.
        std::string registerOperation(std::string local_id, std::string name, OperationHandler handler) {
            OperationDefinition definition;
            definition.id = std::move(local_id);
            definition.name = std::move(name);
            definition.handler = std::move(handler);
            return registerOperation(std::move(definition));
        }
        virtual std::string registerTelemetry(TelemetryDefinition definition) = 0;
        virtual nlohmann::json callTempest(const std::string& node, const std::string& operation,
                                           const nlohmann::json& payload) {
            throw std::runtime_error("TEMPEST peer calls are unavailable in this SDK host.");
        }
        virtual void publishTelemetry(const std::string& topic, const nlohmann::json& payload) {
            throw std::runtime_error("TEMPEST telemetry is unavailable in this SDK host.");
        }
        virtual std::string registerDCodeFunction(
            std::string local_id,
            std::string name,
            DCodeFunctionHandler handler,
            std::string doc = {},
            std::vector<DCodeFunctionArgument> input_arguments = {},
            std::vector<DCodeFunctionArgument> output_arguments = {},
            DCodePreparedFunctionHandler prepared_handler = {}
        ) = 0;
        virtual std::string registerLoop(std::string local_id, std::string name, PluginLoopDefinition definition) = 0;
        virtual int consoleError(
            std::string message_title,
            std::string message_description,
            std::vector<std::string> tags,
            std::string resolution,
            int auto_acknowledge,
            double separation_seconds
        ) = 0;
        virtual std::shared_ptr<Modules::BaseModule> getModuleInstance(const std::string& instance_name) = 0;
        virtual std::vector<ModuleInstanceSummary> getModuleInstances(const std::string& plugin_id = "") = 0;
        virtual void upsertChannelValueBulk(const std::string& channel,
            const std::vector<std::pair<double, uint64_t>>& data) = 0;
        virtual nlohmann::json callDCodeFunction(const std::string& function_name, const nlohmann::json& payload) = 0;
        virtual void commandChannel(const std::string& channel, ChannelValue value) = 0;
        virtual void setChannel(const std::string& channel, std::optional<ChannelValue> value = std::nullopt) = 0;
        virtual void claimChannel(const std::string& channel) = 0;
        virtual void freeChannel(const std::string& channel) = 0;
        virtual nlohmann::json recordEvent(nlohmann::json event) { return nlohmann::json::object(); }
        virtual bool updateEventStatus(const std::string& event_id, const std::string& status) {
            (void)event_id;
            (void)status;
            return false;
        }
        virtual nlohmann::json requestInterfaceUi(
            const std::string& ui_id,
            nlohmann::json payload,
            nlohmann::json options = nlohmann::json::object()) {
            (void)ui_id;
            (void)payload;
            (void)options;
            return nlohmann::json::object();
        }
        virtual nlohmann::json getInterfaceUiRequest(const std::string& request_id) {
            (void)request_id;
            return nlohmann::json::object();
        }
        virtual nlohmann::json announceDiscoveredDevice(nlohmann::json candidate) {
            (void)candidate;
            return nlohmann::json::object();
        }
        virtual bool isNotificationMuted(const std::string& notification_id) {
            (void)notification_id;
            return false;
        }
        virtual bool writeLog(const std::string& stream, const std::string& text,
            const std::string& channel = "stdout", const std::string& level = "info") {
            (void)stream;
            (void)text;
            (void)channel;
            (void)level;
            return false;
        }
        virtual void registerChannelReferenceSource(std::string local_id,
            std::function<void(ChannelReferenceSink&)> collect) {
            (void)local_id;
            (void)collect;
            throw std::runtime_error("Channel reference sources are unavailable in this SDK host.");
        }
        virtual nlohmann::json callPinnedTempest(const std::string& node, const std::string& preset,
                                                  const nlohmann::json& overrides = nlohmann::json::object()) {
            throw std::runtime_error("Pinned TEMPEST peer calls are unavailable in this SDK host.");
        }
        std::string readWorkspaceAsset(const std::string& node, const std::string& asset_namespace, const std::string& filename) {
            return callTempest(node, "dartwic/get-file", {{"rootDir", "workspace_assets_directory"},
                {"filePath", workspaceAssetPath(asset_namespace, filename).substr(7)}}).at("content").get<std::string>();
        }
        std::string saveWorkspaceAsset(const std::string& node, const std::string& asset_namespace,
                                      const std::string& filename, const std::string& content) {
            const auto path = workspaceAssetPath(asset_namespace, filename);
            callTempest(node, "dartwic/save-file", {{"rootDir", "workspace_assets_directory"}, {"path", path.substr(7)}, {"content", content}});
            return path;
        }
        std::string readPluginWorkspaceAsset(const std::string& node, const std::string& plugin_id, const std::string& relative) {
            return callTempest(node, "dartwic/get-file", {{"rootDir", "workspace_assets_directory"}, {"filePath", pluginWorkspaceAssetPath(plugin_id, relative).substr(7)}}).at("content").get<std::string>();
        }
        std::string savePluginWorkspaceAsset(const std::string& node, const std::string& plugin_id, const std::string& relative, const std::string& content) {
            const auto path = pluginWorkspaceAssetPath(plugin_id, relative);
            callTempest(node, "dartwic/save-file", {{"rootDir", "workspace_assets_directory"}, {"path", path.substr(7)}, {"content", content}});
            return path;
        }
        std::filesystem::path pluginAssetPath(const std::string& plugin_id, const std::string& relative) {
            pluginWorkspaceAssetPath(plugin_id, relative);
            return installationPath("plugins/" + plugin_id + "/assets/" + relative);
        }
        virtual std::string storagePath(const std::string& scope, const std::string& relative,
                                        const std::string& project = "") {
            throw std::runtime_error("Storage path helpers are unavailable in this host.");
        }
        std::filesystem::path installationPath(const std::string& path = "") { return storagePath("installation", path); }
        std::filesystem::path instancePath(const std::string& path = "") { return storagePath("instance", path); }
        std::filesystem::path workspacePath(const std::string& path = "") { return storagePath("workspace", path); }
        std::filesystem::path projectPath(const std::string& path = "", const std::string& project = "") { return storagePath("project", path, project); }
        std::filesystem::path projectSettingsPath(const std::string& path = "", const std::string& project = "") { return storagePath("settings", path, project); }
        std::filesystem::path projectRuntimePath(const std::string& path = "", const std::string& project = "") { return storagePath("runtime", path, project); }
        std::filesystem::path projectCachePath(const std::string& path = "", const std::string& project = "") { return storagePath("cache", path, project); }
        virtual nlohmann::json readEffectiveSettings(const nlohmann::json& defaults = nlohmann::json::object(), const std::string& project = "") {
            throw std::runtime_error("Settings helpers are unavailable in this host.");
        }
        virtual nlohmann::json writeSettingsOverride(const std::string& scope, const nlohmann::json& patch,
            const nlohmann::json& reset = nlohmann::json::array(), const std::string& project = "", const std::string& revision = "") {
            throw std::runtime_error("Settings helpers are unavailable in this host.");
        }
        nlohmann::json resetSettingsOverride(const std::string& scope, const nlohmann::json& pointers,
            const std::string& project = "", const std::string& revision = "") {
            return writeSettingsOverride(scope, nlohmann::json::object(), pointers, project, revision);
        }
        virtual nlohmann::json readStorageJson(const std::string& scope, const std::string& path,
            const nlohmann::json& missing = nullptr, const std::string& project = "") {
            throw std::runtime_error("JSON storage helpers are unavailable in this host.");
        }
        virtual void writeStorageJson(const std::string& scope, const std::string& path,
            const nlohmann::json& value, const std::string& project = "") {
            throw std::runtime_error("JSON storage helpers are unavailable in this host.");
        }
        void commandChannel(const std::string& channel) { applyAuthorityByName(0, channel, std::nullopt); }
        void overrideChannel(const std::string& channel) { applyAuthorityByName(2, channel, std::nullopt); }
        void overrideChannel(const std::string& channel, ChannelValue value) { applyAuthorityByName(2, channel, std::move(value)); }
        void freeChannel(const std::string& channel, ChannelValue value) { applyAuthorityByName(3, channel, std::move(value)); }
        void commandChannel(const FixedChannelHandle& channel, std::optional<ChannelValue> value = std::nullopt) {
            applyAuthorityByHandle(0, channel, std::move(value));
        }
        void setChannel(const FixedChannelHandle& channel, std::optional<ChannelValue> value = std::nullopt) {
            applyAuthorityByHandle(1, channel, std::move(value));
        }
        void overrideChannel(const FixedChannelHandle& channel, std::optional<ChannelValue> value = std::nullopt) {
            applyAuthorityByHandle(2, channel, std::move(value));
        }
        void freeChannel(const FixedChannelHandle& channel, std::optional<ChannelValue> value = std::nullopt) {
            applyAuthorityByHandle(3, channel, std::move(value));
        }

        // Unique virtual names are essential on the Microsoft ABI: adding a
        // virtual overload would regroup and move existing overload slots.
        virtual void applyAuthorityByName(uint32_t operation, const std::string& channel,
            std::optional<ChannelValue> value) {
            throw std::runtime_error("Authority operation requires Engine 2.0.7 or newer.");
        }
        virtual void applyAuthorityByHandle(uint32_t operation, const FixedChannelHandle& channel,
            std::optional<ChannelValue> value) {
            throw std::runtime_error("Fixed-channel authority requires Engine 2.0.7 or newer.");
        }

    };
```
