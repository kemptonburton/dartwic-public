import {isVersionAtLeast} from "./semanticVersion.js";

function assertCompatibleRuntimeMetadata(runtimeMetadata, minimumEngineVersion) {
    const engineVersion = String(runtimeMetadata?.engineVersion ?? "").trim();
    if (isVersionAtLeast(engineVersion, minimumEngineVersion)) return;
    if (!engineVersion) throw new Error("The engine did not report its version, so compatibility cannot be verified.");
    throw new Error(`This React client requires DARTWIC engine ${minimumEngineVersion} or newer. Connected engine version was ${engineVersion}.`);
}

export async function connectWithCompatibleRuntime(client, ip, port, password, metadata, minimumEngineVersion) {
    const connection = await client.connect(ip, port, password, metadata);
    if (!connection || connection.error) return connection ?? {error: true, payload: {error: "Engine connection returned no result."}};

    try {
        const result = await client.operation("dartwic/get-runtime-metadata", {}, 5000);
        if (!result || result.error) throw new Error(result?.payload?.error ?? "Could not read engine runtime metadata.");
        if (typeof result.raise_for_error === "function") result.raise_for_error();
        assertCompatibleRuntimeMetadata(result.payload, minimumEngineVersion);
    } catch (error) {
        await client.disconnect().catch(() => {});
        throw error;
    }
    return connection;
}
