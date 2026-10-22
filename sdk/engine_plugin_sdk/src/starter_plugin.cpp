#include "starter_plugin.h"

DARTWIC_PLUGIN_EXPORT uint32_t dartwicEngineSdkAbiVersion() noexcept {
    return DARTWIC::Plugins::ENGINE_PLUGIN_SDK_ABI_VERSION;
}

DARTWIC_PLUGIN_EXPORT DARTWIC::Plugins::BasePlugin* createPlugin(
    nlohmann::json cfg,
    DARTWIC::API::SDK_API* api
) {
    return new StarterEnginePlugin(std::move(cfg), api);
}
