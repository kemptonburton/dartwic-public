import {createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore} from "react";
import { TempestWebClient } from "./tempest/index.js";
import packageJson from "../package.json";
import {connectWithCompatibleRuntime} from "./connectionCompatibility.js";

/**
 * @typedef {object} DartwicContextValue
 * @property {TempestWebClient} client Underlying TEMPEST web client.
 * @property {object} channelStore Subscription store used by the channel hooks.
 * @property {object} channels Current live channel payloads keyed by channel name.
 * @property {boolean} telemetryConnected Whether the TEMPEST telemetry transport is connected.
 * @property {number|null} telemetryConnectionChangedAt Wall-clock milliseconds of the latest connection transition.
 * @property {number|null} telemetryReceiveHz Effective cadence of telemetry probe frames received by this client.
 * @property {object|null} lastOperation Result summary for the most recently tracked operation.
 * @property {function} connect Connects to an engine and verifies runtime compatibility.
 * @property {function} disconnect Disconnects and clears local channel state.
 * @property {function} operation Calls a TEMPEST operation.
 * @property {function} bindTelemetryHandler Registers a telemetry handler for a topic prefix.
 * @property {function} unbindTelemetryHandler Removes a telemetry handler.
 * @property {function} sendTelemetry Publishes a telemetry message.
 * @property {function} addChannelToTelemetry Subscribes to one RAPID channel.
 * @property {function} addChannelsToTelemetry Subscribes to multiple RAPID channels.
 * @property {function} removeChannelFromTelemetry Unsubscribes from one RAPID channel.
 * @property {function} removeChannelsFromTelemetry Unsubscribes from multiple RAPID channels.
 * @property {function} queryChannelRange Queries recorded values for one channel.
 * @property {function} upsertChannel Writes a value or metadata field by flat RAPID channel name.
 */

/** React context populated by DartwicProvider. Prefer useDartwic and the channel hooks in application components. */
export const DartwicContext = createContext(null);
const STALE_CHECK_INTERVAL_MS = 1000;
const TELEMETRY_RATE_WINDOW_MS = 3000;
const TELEMETRY_RATE_STALE_MS = 1500;
const TELEMETRY_RATE_REPORT_INTERVAL_MS = 1000;
// Group fields from one telemetry burst without halving a 20 Hz input stream
// when the client and server timers fall on opposite sides of a 50 ms boundary.
const CHANNEL_TELEMETRY_BATCH_MS = 16;
const EMPTY_CHANNEL_SELECTION = Object.freeze({});
export const DARTWIC_MIN_ENGINE_VERSION = String(packageJson?.dartwic?.minEngineVersion ?? "").trim();

function calculateTelemetryReceiveHz(eventTimes, now) {
    const cutoff = now - TELEMETRY_RATE_WINDOW_MS;
    while (eventTimes.length > 0 && eventTimes[0] < cutoff) {
        eventTimes.shift();
    }

    if (eventTimes.length < 2 || now - eventTimes[eventTimes.length - 1] > TELEMETRY_RATE_STALE_MS) {
        return 0;
    }

    const elapsedSeconds = (eventTimes[eventTimes.length - 1] - eventTimes[0]) / 1000;
    return elapsedSeconds > 0 ? (eventTimes.length - 1) / elapsedSeconds : 0;
}

export function isChannelDataStale(channelData, nowUnixSeconds = (Date.now() / 1000)) {
    if (!channelData || typeof channelData !== "object") {
        return false;
    }

    const staleTimeout = Number(channelData.stale_timeout ?? 0);
    const rawTimestamp = Number(channelData.timestamp ?? 0);
    const timestamp = rawTimestamp > 1e17
        ? rawTimestamp / 1e9
        : rawTimestamp > 1e14
            ? rawTimestamp / 1e6
            : rawTimestamp > 1e11
                ? rawTimestamp / 1e3
                : rawTimestamp;

    if (!Number.isFinite(staleTimeout) || staleTimeout <= 0) {
        return false;
    }

    if (!Number.isFinite(timestamp)) {
        return false;
    }

    return (nowUnixSeconds - timestamp) >= staleTimeout;
}

function addStaleStateToPayload(payload, nowUnixSeconds) {
    const channelData = payload?.channel_data;

    if (!channelData || typeof channelData !== "object") {
        return payload;
    }

    const stale = isChannelDataStale(channelData, nowUnixSeconds);

    return {
        ...payload,
        stale,
        channel_data: {
            ...channelData,
            stale
        }
    };
}

function createChannelStore() {
    let rawSnapshot = {};
    let snapshot = {};
    let currentUnixSeconds = Date.now() / 1000;
    const listeners = new Set();

    const emit = () => {
        listeners.forEach((listener) => listener());
    };

    return {
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
        getSnapshot() {
            return snapshot;
        },
        getRawSnapshot() {
            return rawSnapshot;
        },
        getChannel(channelName) {
            return snapshot[channelName];
        },
        replace(nextRawSnapshot = {}) {
            rawSnapshot = {...nextRawSnapshot};
            snapshot = Object.fromEntries(
                Object.entries(rawSnapshot).map(([channelName, payload]) => [
                    channelName,
                    addStaleStateToPayload(payload, currentUnixSeconds)
                ])
            );
            emit();
        },
        merge(updates = {}) {
            const entries = Object.entries(updates ?? {});
            if (entries.length === 0) {
                return;
            }

            let nextRawSnapshot = rawSnapshot;
            let nextSnapshot = snapshot;
            let changed = false;

            entries.forEach(([channelName, payload]) => {
                if (rawSnapshot[channelName] === payload) {
                    return;
                }

                if (!changed) {
                    nextRawSnapshot = {...rawSnapshot};
                    nextSnapshot = {...snapshot};
                    changed = true;
                }

                nextRawSnapshot[channelName] = payload;
                nextSnapshot[channelName] = addStaleStateToPayload(payload, currentUnixSeconds);
            });

            if (changed) {
                rawSnapshot = nextRawSnapshot;
                snapshot = nextSnapshot;
                emit();
            }
        },
        updateClock(nextUnixSeconds) {
            currentUnixSeconds = nextUnixSeconds;
            let nextSnapshot = snapshot;
            let changed = false;

            Object.entries(rawSnapshot).forEach(([channelName, payload]) => {
                const channelData = payload?.channel_data;
                const staleTimeout = Number(channelData?.stale_timeout ?? 0);
                if (!channelData || !Number.isFinite(staleTimeout) || staleTimeout <= 0) {
                    return;
                }

                const nextChannelSnapshot = addStaleStateToPayload(payload, currentUnixSeconds);
                if (snapshot[channelName]?.stale === nextChannelSnapshot?.stale) {
                    return;
                }

                if (!changed) {
                    nextSnapshot = {...snapshot};
                    changed = true;
                }
                nextSnapshot[channelName] = nextChannelSnapshot;
            });

            if (changed) {
                snapshot = nextSnapshot;
                emit();
            }
        }
    };
}

/**
 * Provides a shared DARTWIC client connection and live channel store to a React subtree.
 * @param {object} props Provider properties.
 * @param {React.ReactNode} props.children Components that can access the DARTWIC context.
 * @param {boolean} [props.implementHeartbeat=true] Enables TEMPEST heartbeat handling.
 * @param {object} [props.logger=console] Logger passed to the TEMPEST web client.
 * @param {function|null} [props.onError=null] Called when the TEMPEST client reports an error.
 * @returns {React.ReactElement} The context provider for the wrapped subtree.
 */
export function DartwicProvider({
    children,
    implementHeartbeat = true,
    logger = console,
    onError = null,
}) {
    const clientIdentityMetadata = useMemo(() => ({
        dartwic_client_type: "react",
        dartwic_client_version: packageJson.version ?? "0.0.0",
    }), []);

    // ---------- TEMPEST CLIENT ---------- //
    const clientRef = useRef(null);

    // create tempest client
    if (!clientRef.current) {
        clientRef.current = new TempestWebClient(implementHeartbeat, logger, onError);
    }
    const [telemetryConnection, setTelemetryConnection] = useState(() => ({
        connected: Boolean(clientRef.current.telemetryConnected),
        changedAt: clientRef.current.telemetryConnectionChangedAt ?? null
    }));

    // ---------- CHANNEL TELEMETRY STREAMER ---------- //
    const channelStoreRef = useRef(null);
    if (!channelStoreRef.current) {
        channelStoreRef.current = createChannelStore();
    }
    const channelUpdateQueueRef = useRef({});
    const channelFlushTimerRef = useRef(null);
    const [channels, setChannels] = useState(() => channelStoreRef.current.getSnapshot());
    const [lastOperation, setLastOperation] = useState(null);
    const [telemetryReceiveHz, setTelemetryReceiveHz] = useState(null);
    const telemetryRateEventTimesRef = useRef([]);
    const lastOperationRef = useRef(null);
    const desiredTelemetryChannelCountsRef = useRef(new Map());

    // create telemetry handler for the channels
    const telemetryChannelHandlerRef = useRef(null);

    if (!telemetryChannelHandlerRef.current) {
        // function that is called when new telemetry is recieved
        telemetryChannelHandlerRef.current = (telemetry, remainder) => {
            const payload = telemetry?.payload ?? {};
            if (!payload || typeof payload !== "object") return;

            if (remainder === "snapshot") {
                const snapshotChannels = payload.channels;
                if (!snapshotChannels || typeof snapshotChannels !== "object") return;
                // The server has already batched this cycle. Apply it in one store update.
                channelStoreRef.current.merge(snapshotChannels);
                return;
            }

            channelUpdateQueueRef.current[remainder] = payload;
            if (channelFlushTimerRef.current != null) {
                return;
            }

            channelFlushTimerRef.current = setTimeout(() => {
                channelFlushTimerRef.current = null;
                const queuedUpdates = channelUpdateQueueRef.current;
                channelUpdateQueueRef.current = {};
                channelStoreRef.current.merge(queuedUpdates);
            }, CHANNEL_TELEMETRY_BATCH_MS);
        };

        // bind to channel stream topic
        clientRef.current.bindTelemetryHandler(
            "rapid/channels/",
            telemetryChannelHandlerRef.current
        );
    }

    const telemetryRateProbeHandlerRef = useRef(null);
    if (!telemetryRateProbeHandlerRef.current) {
        telemetryRateProbeHandlerRef.current = () => {
            telemetryRateEventTimesRef.current.push(performance.now());
        };
        clientRef.current.bindTelemetryHandler(
            "dartwic/telemetry/rate-probe",
            telemetryRateProbeHandlerRef.current
        );
    }

    useEffect(() => {
        lastOperationRef.current = lastOperation;
    }, [lastOperation]);

    useEffect(() => {
        return channelStoreRef.current.subscribe(() => {
            setChannels(channelStoreRef.current.getSnapshot());
        });
    }, []);

    useEffect(() => {
        const intervalId = setInterval(() => {
            const nextUnixSeconds = Date.now() / 1000;
            channelStoreRef.current.updateClock(nextUnixSeconds);
        }, STALE_CHECK_INTERVAL_MS);

        return () => {
            clearInterval(intervalId);
            if (channelFlushTimerRef.current != null) {
                clearTimeout(channelFlushTimerRef.current);
                channelFlushTimerRef.current = null;
            }
        };
    }, []);

    const getDesiredTelemetryChannels = useCallback(() => {
        return Array.from(desiredTelemetryChannelCountsRef.current.entries())
            .filter(([, count]) => Number(count) > 0)
            .map(([channelName]) => channelName);
    }, []);

    const mergeInitialTelemetry = useCallback((response) => {
        const payload = response?.payload ?? {};
        const updates = {};
        if (payload?.snapshot?.channel_name) {
            updates[payload.snapshot.channel_name] = payload.snapshot;
        }
        if (payload?.initial && typeof payload.initial === "object") {
            Object.assign(updates, payload.initial);
        }
        if (Object.keys(updates).length > 0) {
            channelStoreRef.current.merge(updates);
        }
        return response;
    }, []);

    const replayDesiredTelemetryChannels = useCallback(async () => {
        const desiredChannels = getDesiredTelemetryChannels();
        if (desiredChannels.length === 0) {
            return;
        }

        const response = await clientRef.current.operation("dartwic/add-channels-to-telemetry", {
            channel_names: desiredChannels
        }, 5000, {
            requestKey: "replay_desired_telemetry_channels",
            cancelPrevious: true
        });
        return mergeInitialTelemetry(response);
    }, [getDesiredTelemetryChannels, mergeInitialTelemetry]);

    useEffect(() => {
        clientRef.current.onConnectionStateChange = ({connected, changedAt}) => {
            setTelemetryConnection({
                connected: Boolean(connected),
                changedAt: Number.isFinite(Number(changedAt)) ? Number(changedAt) : Date.now()
            });
        };

        return () => {
            clientRef.current.onConnectionStateChange = null;
        };
    }, []);

    useEffect(() => {
        clientRef.current.onClientRegistered = () => {
            void replayDesiredTelemetryChannels();
        };

        return () => {
            clientRef.current.onClientRegistered = null;
        };
    }, [replayDesiredTelemetryChannels]);

    useEffect(() => {
        if (!telemetryConnection.connected || !clientRef.current.clientId) {
            telemetryRateEventTimesRef.current = [];
            setTelemetryReceiveHz(null);
            return undefined;
        }

        let active = true;
        const publishRuntimeStatus = () => {
            const now = performance.now();
            const receiveHz = calculateTelemetryReceiveHz(telemetryRateEventTimesRef.current, now);
            setTelemetryReceiveHz(receiveHz);

            void clientRef.current.sendTelemetry("dartwic/send-telemetry-to-clients", {
                topic: "dartwic/clients/runtime-status",
                payload: {
                    telemetry_receive_hz: receiveHz,
                    last_operation: lastOperationRef.current,
                    timestamp: Date.now()
                }
            }).catch(() => {});
        };

        telemetryRateEventTimesRef.current = [];
        // The first client telemetry frame associates this WebSocket with the
        // registered client before the engine begins targeted probe delivery.
        publishRuntimeStatus();
        void clientRef.current.operation("dartwic/set-telemetry-rate-probe", {enabled: true}, 5000)
            .catch(() => {});

        const intervalId = setInterval(() => {
            if (active) {
                publishRuntimeStatus();
            }
        }, TELEMETRY_RATE_REPORT_INTERVAL_MS);

        return () => {
            active = false;
            clearInterval(intervalId);
            telemetryRateEventTimesRef.current = [];
            void clientRef.current.operation("dartwic/set-telemetry-rate-probe", {enabled: false}, 5000)
                .catch(() => {});
        };
    }, [telemetryConnection.connected, telemetryConnection.changedAt]);

    const incrementDesiredTelemetryChannels = useCallback((channelNames) => {
        const normalized = Array.from(new Set(
            (Array.isArray(channelNames) ? channelNames : [channelNames]).filter(Boolean)
        ));

        const newlyDesired = [];
        for (const channelName of normalized) {
            const currentCount = desiredTelemetryChannelCountsRef.current.get(channelName) ?? 0;
            const nextCount = currentCount + 1;
            desiredTelemetryChannelCountsRef.current.set(channelName, nextCount);
            if (currentCount === 0) {
                newlyDesired.push(channelName);
            }
        }

        return newlyDesired;
    }, []);

    const decrementDesiredTelemetryChannels = useCallback((channelNames) => {
        const normalized = Array.from(new Set(
            (Array.isArray(channelNames) ? channelNames : [channelNames]).filter(Boolean)
        ));

        const noLongerDesired = [];
        for (const channelName of normalized) {
            const currentCount = desiredTelemetryChannelCountsRef.current.get(channelName) ?? 0;
            if (currentCount <= 1) {
                desiredTelemetryChannelCountsRef.current.delete(channelName);
                if (currentCount === 1) {
                    noLongerDesired.push(channelName);
                }
            } else {
                desiredTelemetryChannelCountsRef.current.set(channelName, currentCount - 1);
            }
        }

        return noLongerDesired;
    }, []);

    // ---------- TEMPEST FUNCTIONS ---------- //
    const connect = useCallback(async (tempestIp, tempestPort, serverPassword, clientMetadata = {}) => {
        const normalizedClientMetadata =
            clientMetadata && typeof clientMetadata === "object"
                ? clientMetadata
                : {};

        return connectWithCompatibleRuntime(clientRef.current, tempestIp, tempestPort, serverPassword, {
            ...clientIdentityMetadata,
            ...normalizedClientMetadata
        }, DARTWIC_MIN_ENGINE_VERSION);
    }, [clientIdentityMetadata]);

    const disconnect = useCallback(async () => {
        // Stop recovery before store notifications can run subscription cleanup.
        const disconnected = clientRef.current.disconnect();
        desiredTelemetryChannelCountsRef.current.clear();
        channelUpdateQueueRef.current = {};
        if (channelFlushTimerRef.current != null) {
            clearTimeout(channelFlushTimerRef.current);
            channelFlushTimerRef.current = null;
        }
        channelStoreRef.current.replace({});
        return disconnected;
    }, []);

    const operation = useCallback(async (name, payload = {}, timeoutMs = 5000, options = {}) => {
        const startedAt = Date.now();
        const shouldTrackOperation = options?.trackOperation !== false
            && !["register_client", "unregister_client"].includes(name);
        const clientOptions = {...options};
        delete clientOptions.trackOperation;

        try {
            const response = await clientRef.current.operation(name, payload, timeoutMs, clientOptions);

            if (shouldTrackOperation && (name !== "heartbeat" || response?.error)) {
                setLastOperation({
                    name,
                    ok: !response?.error,
                    error: response?.payload?.error ?? "",
                    timestamp: Date.now(),
                    elapsedMs: Date.now() - startedAt
                });
            }

            return response;
        } catch (error) {
            if (shouldTrackOperation) {
                setLastOperation({
                    name,
                    ok: false,
                    error: error?.message ?? "Unknown operation error",
                    timestamp: Date.now(),
                    elapsedMs: Date.now() - startedAt
                });
            }

            throw error;
        }
    }, []);

    const bindTelemetryHandler = useCallback((topicPrefix, handler) => {
        clientRef.current.bindTelemetryHandler(topicPrefix, handler);
    }, []);

    const unbindTelemetryHandler = useCallback((topicPrefix, handler) => {
        clientRef.current.unbindTelemetryHandler(topicPrefix, handler);
    }, []);

    const sendTelemetry = useCallback(async (topic, payload = {}) => {
        return clientRef.current.sendTelemetry(topic, payload);
    }, []);

    // ---------- ABSTRACTED DARTWIC FUNCTIONS ---------- //
    const addChannelToTelemetry = useCallback(async (channelName) => {
        const normalized = incrementDesiredTelemetryChannels(channelName);
        if (normalized.length === 0) return;

        const response = await operation("dartwic/add-channel-to-telemetry", {
            channel_name: normalized[0]
        });
        return mergeInitialTelemetry(response);
    }, [incrementDesiredTelemetryChannels, mergeInitialTelemetry, operation]);

    const addChannelsToTelemetry = useCallback(async (channelNames) => {
        const normalized = incrementDesiredTelemetryChannels(channelNames);
        if (normalized.length === 0) return;

        const response = await operation("dartwic/add-channels-to-telemetry", {
            channel_names: normalized
        });
        return mergeInitialTelemetry(response);
    }, [incrementDesiredTelemetryChannels, mergeInitialTelemetry, operation]);

    const removeChannelFromTelemetry = useCallback(async (channelName) => {
        const normalized = decrementDesiredTelemetryChannels(channelName);
        if (normalized.length === 0) return;

        return operation("dartwic/remove-channel-from-telemetry", {
            channel_name: normalized[0]
        });
    }, [decrementDesiredTelemetryChannels, operation]);

    const removeChannelsFromTelemetry = useCallback(async (channelNames) => {
        const normalized = decrementDesiredTelemetryChannels(channelNames);
        if (normalized.length === 0) return;

        return operation("dartwic/remove-channels-from-telemetry", {
            channel_names: normalized
        });
    }, [decrementDesiredTelemetryChannels, operation]);

    const queryChannelRange = useCallback(async (channelReference, xFrom = null, xTo = null) => {
        return operation("rapid/query-channel-range", {
            series: [channelReference],
            from: xFrom,
            to: xTo
        });
    }, [operation]);

    const upsertChannel = useCallback(async (channelName, desiredValue, field = "value") => {
        return operation("rapid/upsert-channel-field", {
            channel_name: channelName,
            field,
            value: desiredValue,
        });
    }, [operation]);

    const value = useMemo(() => ({
        client: clientRef.current,
        channelStore: channelStoreRef.current,
        channels,
        telemetryConnected: telemetryConnection.connected,
        telemetryConnectionChangedAt: telemetryConnection.changedAt,
        telemetryReceiveHz,
        lastOperation,
        connect,
        disconnect,
        operation,
        bindTelemetryHandler,
        unbindTelemetryHandler,
        sendTelemetry,
        addChannelToTelemetry,
        addChannelsToTelemetry,
        removeChannelFromTelemetry,
        removeChannelsFromTelemetry,
        queryChannelRange,
        upsertChannel
    }), [channels, lastOperation, telemetryConnection, telemetryReceiveHz]);

    return (
        <DartwicContext.Provider value={value}>
            {children}
        </DartwicContext.Provider>
    );
}

/**
 * Returns the DARTWIC client context for the nearest DartwicProvider.
 * @returns {DartwicContextValue} Client operations, connection state, and channel subscription helpers.
 */
export function useDartwic() {
    const context = useContext(DartwicContext);

    if (!context) {
        throw new Error("useDartwic must be used inside DartwicProvider");
    }

    return context;
}

/**
 * Subscribes to the complete live channel snapshot.
 * @returns {object} Channel payloads keyed by channel name.
 */
export function useDartwicChannels() {
    const {channelStore} = useDartwic();
    return useSyncExternalStore(
        channelStore.subscribe,
        channelStore.getSnapshot,
        channelStore.getSnapshot
    );
}

/**
 * Subscribes to one live channel.
 * @param {string} channelName Full RAPID channel name.
 * @returns {object|undefined} The latest channel payload, or undefined before data arrives.
 */
export function useDartwicChannel(channelName) {
    const {channelStore} = useDartwic();
    const normalizedChannelName = String(channelName ?? "").trim();
    return useSyncExternalStore(
        channelStore.subscribe,
        () => normalizedChannelName ? channelStore.getChannel(normalizedChannelName) : undefined,
        () => normalizedChannelName ? channelStore.getChannel(normalizedChannelName) : undefined
    );
}

/**
 * Subscribes to a selected set of live channels without rerendering for unrelated channel updates.
 * @param {string|string[]} [channelNames=[]] Full RAPID channel names to select.
 * @returns {object} Selected channel payloads keyed by channel name.
 */
export function useDartwicChannelValues(channelNames = []) {
    const {channelStore} = useDartwic();
    const selectedSnapshotRef = useRef({
        key: "",
        valuesByName: new Map(),
        selectedChannels: {}
    });
    const normalizedKey = Array.from(new Set((Array.isArray(channelNames) ? channelNames : [channelNames])
        .map((channelName) => String(channelName ?? "").trim())
        .filter(Boolean))).sort().join("\n");

    return useSyncExternalStore(
        channelStore.subscribe,
        () => {
            const selectedNames = normalizedKey.split("\n").filter(Boolean);
            if (
                selectedSnapshotRef.current.key === normalizedKey
                && selectedSnapshotRef.current.valuesByName.size === selectedNames.length
                && selectedNames.every((channelName) => (
                    selectedSnapshotRef.current.valuesByName.get(channelName) === channelStore.getChannel(channelName)
                ))
            ) {
                return selectedSnapshotRef.current.selectedChannels;
            }

            const selectedChannels = {};
            const valuesByName = new Map();
            selectedNames.forEach((channelName) => {
                const value = channelStore.getChannel(channelName);
                valuesByName.set(channelName, value);
                if (value !== undefined) {
                    selectedChannels[channelName] = value;
                }
            });

            selectedSnapshotRef.current = {
                key: normalizedKey,
                valuesByName,
                selectedChannels
            };

            return selectedChannels;
        },
        () => EMPTY_CHANNEL_SELECTION
    );
}

