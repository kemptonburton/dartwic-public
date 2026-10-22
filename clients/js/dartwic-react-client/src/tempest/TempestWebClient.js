import {TEMPEST_COMPATIBILITY_VERSION} from "./InternalVersions.js";

export class TempestWebClient {
    constructor(
        implementHeartbeat = true,
        logger = console,
        onError = null
    ) {
        this.logger = logger;
        this.implementHeartbeat = implementHeartbeat;
        this.onError = onError;

        // Built during connect()
        this.baseHttpUrl = "";
        this.operationUrl = "";
        this.telemetryWsUrl = "";
        this.tempestIp = "";
        this.tempestPort = null;

        this.clientId = "";
        this.sessionToken = "";
        this.serverPassword = "";
        this.clientMetadata = {};
        this.running = false;

        this.telemetryHandlers = new Map();
        this.trafficHandlers = new Set();
        this.trafficSequence = 0;
        this.ws = null;
        this.operationControllers = new Map();
        this._heartbeatInFlight = false;
        this._heartbeatFailureCount = 0;
        this._reconnectInFlight = false;
        this._reconnectPromise = null;
        this._reconnectTimeout = null;
        this._intentionalDisconnect = false;
        this._connectionGeneration = 0;
        this._lastConnectionLossToast = { reason: "", at: 0 };
        this.telemetryConnected = false;
        this.telemetryConnectionChangedAt = null;
        this.onConnectionStateChange = null;
    }

    // ---------------- TELEMETRY ----------------

    bindTelemetryHandler(topicPrefix, handler) {
        if (!this.telemetryHandlers.has(topicPrefix)) {
            this.telemetryHandlers.set(topicPrefix, new Set());
        }

        this.telemetryHandlers.get(topicPrefix).add(handler);
    }

    unbindTelemetryHandler(topicPrefix, handler) {
        if (!this.telemetryHandlers.has(topicPrefix)) return;

        if (handler) {
            const handlers = this.telemetryHandlers.get(topicPrefix);
            handlers.delete(handler);

            if (handlers.size === 0) {
                this.telemetryHandlers.delete(topicPrefix);
            }
        } else {
            // Remove all handlers for this topic
            this.telemetryHandlers.delete(topicPrefix);
        }
    }

    /** Observe live operation and telemetry traffic; returns a function that removes the observer. */
    bindTrafficHandler(handler) {
        if (typeof handler !== "function") throw new TypeError("Traffic handler must be a function");
        this.trafficHandlers.add(handler);
        return () => this.trafficHandlers.delete(handler);
    }

    _emitTraffic(entry) {
        for (const handler of this.trafficHandlers) {
            try { handler(entry); }
            catch (error) { this.logger.warn?.(this._formatMessage(`Traffic handler error: ${error.message}`)); }
        }
    }

    _startTelemetrySocket() {
        const socket = new WebSocket(this.telemetryWsUrl);
        this.ws = socket;

        socket.onopen = () => {
            if (this.ws !== socket) {
                socket.close();
                return;
            }
            try {
                socket.send(JSON.stringify({sender: this.clientId, sessionToken: this.sessionToken, topic: "", error: false, payload: {}, timestamp: Date.now()}));
            } catch (error) {
                this._setTelemetryConnected(false, error?.message ?? "Telemetry socket identification failed");
                socket.close();
                return;
            }
            this._setTelemetryConnected(true, "Connected");
        };

        this.ws.onmessage = (event) => {
            if (this.ws !== socket) return;
            try {
                const telemetry = JSON.parse(event.data);
                if (this.trafficHandlers.size) this._emitTraffic({kind: "telemetry", direction: "incoming", name: telemetry.topic ?? "", payload: telemetry.payload, timestamp: Date.now(), status: telemetry.error ? "failed" : "received"});

                // dispatch telemetry
                for (const [prefix, handlers] of this.telemetryHandlers) {
                    if (telemetry.topic?.startsWith(prefix)) {
                        //get remainder of prefix
                        const remainder = telemetry.topic.slice(prefix.length);
                        // give to all handlers
                        for (const handler of handlers) {
                            try {
                                handler(telemetry, remainder);
                            } catch (err) {
                                this.logger.warn(this._formatMessage(
                                    `Handler error for ${prefix}: ${err.message}`
                                ));
                            }
                        }
                    }
                }

            } catch (err) {
                this.logger.warn(this._formatMessage(
                    `Telemetry parse error: ${err.message}`
                ));
            }
        };

        this.ws.onerror = (err) => {
            if (this.ws !== socket) return;
            const msg = this._formatErrorMessage("Telemetry Socket", err.message)
            this.onError?.(msg);
        };

        this.ws.onclose = () => {
            // Closing an old socket must never disconnect or revive a newer session.
            if (this.ws !== socket) return;
            this.ws = null;
            this._markDisconnected("Telemetry socket closed");
            this._setTelemetryConnected(false, "Telemetry socket closed");
            if (!this._intentionalDisconnect) {
                this.clientId = "";
                this._notifyConnectionLoss("Telemetry socket closed");
                this._scheduleReconnect();
            }
        };
    }

    _markDisconnected(reason = "Disconnected") {
        const hook = globalThis?.__TEMPEST_HEARTBEAT_HOOK__;
        hook?.({
            phase: "error",
            perfMs: performance.now(),
            wallMs: Date.now(),
            error: reason
        });
    }

    _setTelemetryConnected(connected, reason = "") {
        const nextConnected = Boolean(connected);
        if (this.telemetryConnected === nextConnected) {
            return;
        }

        const changedAt = Date.now();
        this.telemetryConnected = nextConnected;
        this.telemetryConnectionChangedAt = changedAt;
        this.onConnectionStateChange?.({
            connected: nextConnected,
            changedAt,
            reason: String(reason || (nextConnected ? "Connected" : "Disconnected"))
        });
    }

    _clearReconnectTimer() {
        if (this._reconnectTimeout != null) {
            clearTimeout(this._reconnectTimeout);
            this._reconnectTimeout = null;
        }
    }

    _isClientNotRegisteredError(errorMessage = "") {
        return String(errorMessage).toLowerCase().includes("client not registered");
    }

    _notifyConnectionLoss(reason = "Disconnected") {
        const normalizedReason = String(reason || "Disconnected");
        const now = Date.now();

        if (
            this._lastConnectionLossToast.reason === normalizedReason &&
            now - this._lastConnectionLossToast.at < 3000
        ) {
            return;
        }

        this._lastConnectionLossToast = {
            reason: normalizedReason,
            at: now
        };

        this.onError?.(this._formatErrorMessage("connection", normalizedReason));
    }

    _stopHeartbeat() {
        clearInterval(this.heartbeatInterval);
        this.heartbeatInterval = null;
        this._heartbeatInFlight = false;
    }

    _closeTelemetrySocket() {
        const socket = this.ws;
        this.ws = null;
        try {
            socket?.close();
        } catch {}
    }

    _stopTransientConnections() {
        this._stopHeartbeat();
        this._closeTelemetrySocket();
    }

    _canRegister() {
        return Boolean(this.baseHttpUrl && (this.serverPassword || this.clientMetadata?.role === "viewer"));
    }

    async _ensureConnected() {
        if (this._intentionalDisconnect) return false;
        if (this.running && this.clientId) {
            return true;
        }

        if (!this._canRegister()) {
            return false;
        }

        await this._attemptReconnect();
        return Boolean(this.running && this.clientId);
    }

    _scheduleReconnect(delayMs = 2000) {
        if (this._intentionalDisconnect || this._reconnectInFlight || !this._canRegister()) {
            return;
        }

        this._clearReconnectTimer();
        this._reconnectTimeout = setTimeout(() => {
            this._reconnectTimeout = null;
            void this._attemptReconnect();
        }, delayMs);
    }

    _attemptReconnect() {
        if (this._reconnectPromise) return this._reconnectPromise;
        const attempt = this._performReconnect();
        const pending = attempt.finally(() => {
            if (this._reconnectPromise === pending) this._reconnectPromise = null;
        });
        this._reconnectPromise = pending;
        return pending;
    }

    async _performReconnect() {
        if (this._intentionalDisconnect || this._reconnectInFlight || !this._canRegister()) {
            return;
        }

        this._reconnectInFlight = true;
        const generation = this._connectionGeneration;
        let retry = false;
        this.clientId = "";
        this.sessionToken = "";
        this._closeTelemetrySocket();

        try {
            const res = await this.operation("register_client", {
                serverPassword: this.serverPassword,
                ...this.clientMetadata,
                tempestCompatibilityVersion: TEMPEST_COMPATIBILITY_VERSION
            }, 2000, {
                requestKey: "register_client_reconnect",
                cancelPrevious: true,
                silentAbort: true
            });

            if (generation !== this._connectionGeneration || this._intentionalDisconnect) return;
            if (res?.error) {
                retry = true;
                return;
            }

            this.clientId = res.payload.clientId ?? "";
            this.sessionToken = res.payload.sessionToken ?? "";
            this.nodeName = res.payload.node_name ?? "";
            this.running = true;
            this.onClientRegistered?.({
                reason: "reconnect",
                clientId: this.clientId,
                nodeName: this.nodeName
            });
            this._startHeartbeat();
            this._startTelemetrySocket();
        } finally {
            if (generation === this._connectionGeneration) {
                this._reconnectInFlight = false;
                if (retry) this._scheduleReconnect();
            }
        }
    }

    async _retryAfterReconnect(name, payload, timeoutMs, options, timestamp) {
        const generation = this._connectionGeneration;
        const reconnected = await this._ensureConnected();
        if (generation !== this._connectionGeneration || this._intentionalDisconnect) {
            return {clientId: "", name, error: true, payload: {error: "Client is disconnected", aborted: true}, timestamp};
        }
        if (!reconnected) {
            const reconnectError = this._formatErrorMessage(name, "Client is disconnected");

            if (!options?.silentAbort) {
                this.onError?.(reconnectError);
            }

            return {
                clientId: this.clientId,
                name,
                error: true,
                payload: { error: reconnectError },
                timestamp
            };
        }

        return this.operation(name, payload, timeoutMs, {
            ...options,
            retryOnClientNotRegistered: false
        });
    }

    // ---------------- OPERATIONS ----------------

    async operation(name, payload = {}, timeoutMs = 5000, options = {}) {
        if (!this.trafficHandlers.size) return this._operationImpl(name, payload, timeoutMs, options);
        const requestId = `client:${Date.now()}:${++this.trafficSequence}`;
        this._emitTraffic({kind: "command", direction: "outgoing", name, payload, timestamp: Date.now(), status: "pending", request_id: requestId});
        try {
            const response = await this._operationImpl(name, payload, timeoutMs, options);
            this._emitTraffic({kind: "command", direction: "incoming", name, payload: response?.payload, timestamp: Date.now(), status: response?.error ? "failed" : "completed", request_id: requestId});
            return response;
        } catch (error) {
            this._emitTraffic({kind: "command", direction: "incoming", name, payload: {error: error?.message ?? "Operation failed"}, timestamp: Date.now(), status: "failed", request_id: requestId});
            throw error;
        }
    }

    async _operationImpl(name, payload = {}, timeoutMs = 5000, options = {}) {
        const timestamp = Date.now();
        const generation = this._connectionGeneration;
        const cancelled = () => ({
            clientId: "", name, error: true,
            payload: {error: "Client is disconnected", aborted: true}, timestamp
        });
        if (this._intentionalDisconnect && name !== "unregister_client") return cancelled();
        const {
            requestKey = null,
            cancelPrevious = false,
            silentAbort = false,
            retryOnClientNotRegistered = true
        } = options;

        if (
            name !== "register_client" &&
            name !== "unregister_client" &&
            name !== "heartbeat" &&
            (!this.running || !this.clientId)
        ) {
            const reconnected = await this._ensureConnected();
            if (generation !== this._connectionGeneration || this._intentionalDisconnect) return cancelled();
            if (!reconnected) {
                const reconnectError = this._formatErrorMessage(name, "Client is disconnected");

                if (!silentAbort) {
                    this.onError?.(reconnectError);
                }

                return {
                    clientId: this.clientId,
                    name,
                    error: true,
                    payload: { error: reconnectError },
                    timestamp
                };
            }
        }

        const request = {
            clientId: this.clientId,
            sessionToken: this.sessionToken,
            name,
            payload,
            timestamp
        };

        if (requestKey && cancelPrevious) {
            const existingController = this.operationControllers.get(requestKey);
            if (existingController) {
                existingController.abort("superseded");
            }
        }

        const controller = new AbortController();
        let timeout;
        try {
            if (requestKey) {
                this.operationControllers.set(requestKey, controller);
            }
            timeout = setTimeout(() => controller.abort(), timeoutMs);

            const res = await fetch(this.operationUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request),
                signal: controller.signal
            });

            clearTimeout(timeout);

            const data = await res.json();
            if (generation !== this._connectionGeneration) return cancelled();

            if (requestKey && this.operationControllers.get(requestKey) === controller) {
                this.operationControllers.delete(requestKey);
            }

            const payloadError = data?.payload?.error;
            const invalidSession = data?.error && data?.payload?.code === "authentication_required";
            if (data?.error && retryOnClientNotRegistered &&
                (invalidSession || this._isClientNotRegisteredError(payloadError)) &&
                name !== "register_client" && name !== "unregister_client") {
                // An old response must not revoke a registration established by another request.
                if (this.clientId !== request.clientId || this.sessionToken !== request.sessionToken) {
                    return this._retryAfterReconnect(name, payload, timeoutMs, options, timestamp);
                }
                this.running = false;
                this.clientId = "";
                this.sessionToken = "";
                this._markDisconnected(payloadError);
                this._setTelemetryConnected(false, payloadError);
                this._closeTelemetrySocket();
                return this._retryAfterReconnect(name, payload, timeoutMs, options, timestamp);
            }

            if (data.error && !silentAbort) {
                this.onError?.(
                    payloadError
                        ? this._formatErrorMessage(name, payloadError)
                        : this._formatErrorMessage(name, "Unknown server error")
                );
            }

            return {
                clientId: data.clientId ?? this.clientId,
                name: data.name ?? name,
                error: data.error ?? false,
                payload: data.payload ?? {},
                timestamp: data.timestamp ?? Date.now()
            };

        } catch (err) {
            if (generation !== this._connectionGeneration) return cancelled();
            if (err?.name === "AbortError") {
                return {
                    clientId: this.clientId,
                    name,
                    error: true,
                    payload: { error: "Operation aborted", aborted: true },
                    timestamp
                };
            }

            const errorMessage = this._formatErrorMessage(name, err.message);

            if (!silentAbort && !this._intentionalDisconnect) {
                this.onError?.(errorMessage);
            }

            return {
                clientId: this.clientId,
                name,
                error: true,
                payload: { error: errorMessage },
                timestamp
            };
        } finally {
            clearTimeout(timeout);
            if (requestKey && this.operationControllers.get(requestKey) === controller) {
                this.operationControllers.delete(requestKey);
            }
        }
    }

    _formatErrorMessage(name, errMessage) {
        return `[TEMPEST WEB CLIENT] Error for (${name}), Err: ${errMessage || "Unknown error"}`;
    }

    _formatMessage(message) {
        return "[TEMPEST WEB CLIENT] " + message;
    }

    // ---------------- HEARTBEAT ----------------

    _startHeartbeat(intervalMs = 5000) {
        if (!this.implementHeartbeat) return;
        if (globalThis?.__TEMPEST_DISABLE_HEARTBEAT__ === true) return;
        if (this.heartbeatInterval) return;

        this.heartbeatInterval = setInterval(async () => {
            if (!this.running) return;
            if (globalThis?.__TEMPEST_DISABLE_HEARTBEAT__ === true) return;
            if (this._heartbeatInFlight) {
                return;
            }

            this._heartbeatInFlight = true;
            const generation = this._connectionGeneration;
            const hook = globalThis?.__TEMPEST_HEARTBEAT_HOOK__;
            const hbStartPerf = performance.now();
            const hbStartWall = Date.now();
            hook?.({
                phase: "start",
                perfMs: hbStartPerf,
                wallMs: hbStartWall,
                intervalMs
            });
            try {
                const response = await this.operation("heartbeat", {}, 4000, {
                    requestKey: "heartbeat",
                    cancelPrevious: true,
                    silentAbort: true
                });

                if (generation !== this._connectionGeneration || this._intentionalDisconnect) return;
                if (response?.error) {
                    this._heartbeatFailureCount += 1;
                    hook?.({
                        phase: "error",
                        perfMs: performance.now(),
                        wallMs: Date.now(),
                        elapsedMs: Number((performance.now() - hbStartPerf).toFixed(2)),
                        error: response?.payload?.error || "heartbeat failed",
                        failureCount: this._heartbeatFailureCount
                    });

                    if (this._heartbeatFailureCount < 3) {
                        return;
                    }

                    this.clientId = "";
                    this._setTelemetryConnected(false, response?.payload?.error || "Heartbeat failed");
                    this._closeTelemetrySocket();
                    this.onError?.(
                        this._formatErrorMessage(
                            "heartbeat",
                            response?.payload?.error || "heartbeat failed"
                        )
                    );
                    this._scheduleReconnect();
                    return;
                }

                this._heartbeatFailureCount = 0;

                hook?.({
                    phase: "done",
                    perfMs: performance.now(),
                    wallMs: Date.now(),
                    elapsedMs: Number((performance.now() - hbStartPerf).toFixed(2))
                });
            } catch (err) {
                if (generation !== this._connectionGeneration || this._intentionalDisconnect) return;
                this._heartbeatFailureCount += 1;
                if (this._heartbeatFailureCount < 3) {
                    hook?.({
                        phase: "error",
                        perfMs: performance.now(),
                        wallMs: Date.now(),
                        elapsedMs: Number((performance.now() - hbStartPerf).toFixed(2)),
                        error: err?.message || "unknown",
                        failureCount: this._heartbeatFailureCount
                    });
                    return;
                }

                this.clientId = "";
                this._setTelemetryConnected(false, err?.message || "Heartbeat failed");
                this._closeTelemetrySocket();
                this._scheduleReconnect();
                this.onError?.(
                    this._formatErrorMessage("heartbeat", err?.message || "unknown")
                );
                hook?.({
                    phase: "error",
                    perfMs: performance.now(),
                    wallMs: Date.now(),
                    elapsedMs: Number((performance.now() - hbStartPerf).toFixed(2)),
                    error: err?.message || "unknown",
                    failureCount: this._heartbeatFailureCount
                });
            } finally {
                if (generation === this._connectionGeneration) this._heartbeatInFlight = false;
            }
        }, intervalMs);
    }

    // ---------------- LIFECYCLE ----------------

    async connect(tempestIp, tempestPort, serverPassword, clientMetadata = {}) {
        if (this.running) {
            await this.disconnect();
        }

        this._clearReconnectTimer();
        this._stopTransientConnections();
        const generation = ++this._connectionGeneration;
        this._intentionalDisconnect = false;
        this._reconnectInFlight = false;
        this.clientId = "";

        //build port
        //port is different for type of transport
        //http and websocket exist on +2
        const port = tempestPort + 2

        // Build endpoints here
        this.baseHttpUrl = `http://${tempestIp}:${port}`;
        this.operationUrl = `${this.baseHttpUrl}/tempest/operation`;
        this.telemetryWsUrl =
            `ws://${tempestIp}:${port}/tempest/telemetry`;
        this.tempestIp = tempestIp;
        this.tempestPort = tempestPort;

        this.serverPassword = serverPassword;
        this.clientMetadata = clientMetadata && typeof clientMetadata === "object"
            ? {...clientMetadata}
            : {};
        this.running = true;

        // ---- REGISTER FIRST ----
        const res = await this.operation("register_client", {
            serverPassword: this.serverPassword,
            ...this.clientMetadata,
            tempestCompatibilityVersion: TEMPEST_COMPATIBILITY_VERSION
        });

        if (generation !== this._connectionGeneration || this._intentionalDisconnect) {
            return {error: true, payload: {error: "Connection cancelled", aborted: true}};
        }
        if (res.error) {
            this._intentionalDisconnect = true;
            this.running = false;
            this._setTelemetryConnected(false, res?.payload?.error || "Connection failed");
            return res;
        }

        this.clientId = res.payload.clientId;
        this.sessionToken = res.payload.sessionToken ?? "";
        this.nodeName = res.payload.node_name ?? "";
        this._heartbeatFailureCount = 0;
        this.onClientRegistered?.({
            reason: "connect",
            clientId: this.clientId,
            nodeName: this.nodeName
        });

        // ---- ONLY AFTER SUCCESS ----
        this._startHeartbeat();
        this._startTelemetrySocket();

        return res;
    }

    async disconnect() {
        // Revoke automatic recovery before socket, heartbeat, and React cleanup callbacks run.
        this._intentionalDisconnect = true;
        const generation = ++this._connectionGeneration;
        this.running = false;
        this._heartbeatFailureCount = 0;
        this._clearReconnectTimer();
        this._reconnectInFlight = false;
        for (const controller of this.operationControllers.values()) controller.abort("disconnect");
        this.operationControllers.clear();

        this._stopTransientConnections();
        this._markDisconnected("Client disconnected");
        this._setTelemetryConnected(false, "Client disconnected");

        try {
            if (this.clientId) await this.operation("unregister_client", {}, 5000, {silentAbort: true});
        } finally {
            if (generation === this._connectionGeneration) this.clientId = "";
        }
    }

    subscribe() {

    }
    unsubscribe() {

    }
    async sendTelemetry(topic, payload = {}) {
        const connected = await this._ensureConnected();
        if (!connected || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
            throw new Error("Telemetry socket is not connected");
        }

        const telemetry = {
            sender: this.clientId,
            sessionToken: this.sessionToken,
            topic,
            error: false,
            payload,
            timestamp: Date.now()
        };

        this.ws.send(JSON.stringify(telemetry));
        if (this.trafficHandlers.size) this._emitTraffic({kind: "telemetry", direction: "outgoing", name: topic, payload, timestamp: telemetry.timestamp, status: "sent"});
    }
}
