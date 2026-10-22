import { Dealer, Subscriber } from "zeromq";
import {isSnapshotForOtherClient, parseWireJson, stringifyWireJson} from "./wire_json.js";
import {TEMPEST_COMPATIBILITY_VERSION} from "./InternalVersions.js";

/** ZeroMQ TEMPEST connection. Each request owns its DEALER to isolate late replies. */
export class TempestClient {
    constructor(implementHeartbeat = true, logger = console) {
        this.implementHeartbeat = implementHeartbeat;
        this.logger = logger;
        this.running = false;
        this.clientId = "";
        this.sessionToken = "";
        this.telemetryHandlers = new Map();
        this.heartbeatOperation = "heartbeat";
        this.generation = 0;
    }
    bindTelemetryHandler(prefix, handler) {
        if (typeof prefix !== "string") throw new TypeError("prefix must be a string");
        if (typeof handler !== "function") throw new TypeError("handler must be a function");
        if (!this.telemetryHandlers.has(prefix)) {
            this.telemetryHandlers.set(prefix, new Set());
            this.sub?.subscribe(prefix);
        }
        this.telemetryHandlers.get(prefix).add(handler);
    }
    unbindTelemetryHandler(prefix, handler) {
        const handlers = this.telemetryHandlers.get(prefix);
        if (!handlers) return;
        if (!handler) this.telemetryHandlers.delete(prefix);
        else {
            handlers?.delete(handler);
            if (!handlers?.size) this.telemetryHandlers.delete(prefix);
        }
        if (!this.telemetryHandlers.has(prefix)) this.sub?.unsubscribe(prefix);
    }
    async operation(name, payload = {}, timeoutMs = 5000) {
        if (!(timeoutMs > 0)) throw new RangeError("timeoutMs must be positive");
        if (!this.operationEndpoint || (!this.running && !["register_client", "unregister_client"].includes(name))) {
            return {name, clientId: "", error: true, payload: {error: "Client is disconnected"}, timestamp: Date.now()};
        }
        const socket = new Dealer({linger: 0, sendTimeout: timeoutMs, receiveTimeout: timeoutMs});
        const clientId = this.clientId;
        try {
            socket.connect(this.operationEndpoint);
            await socket.send(stringifyWireJson({clientId, sessionToken: this.sessionToken, name, payload, timestamp: Date.now()}));
            const [reply] = await socket.receive();
            const response = parseWireJson(reply.toString());
            if (typeof response.error !== "boolean" || response.name !== name) throw new Error("Malformed TEMPEST response");
            return response;
        } catch (error) {
            return {clientId, name, error: true, payload: {error: error.message}, timestamp: Date.now()};
        } finally { socket.close(); }
    }
    async connect(host = "127.0.0.1", port = 7000, password = "", metadata = {}) {
        if (this.running) throw new Error("Already connected; disconnect before connecting again");
        if (this.sub || this.clientId) await this.disconnect();
        this.operationEndpoint = `tcp://${host}:${port}`;
        this.telemetryEndpoint = `tcp://${host}:${port + 1}`;
        const response = await this.operation("register_client", {...metadata, serverPassword: password, tempestCompatibilityVersion: TEMPEST_COMPATIBILITY_VERSION});
        if (response.error) return response;
        this.clientId = response.payload?.clientId ?? response.clientId;
        this.sessionToken = response.payload?.sessionToken ?? "";
        if (!this.clientId) return {...response, error: true, payload: {error: "Registration returned no client id"}};
        this.running = true;
        this.sub = new Subscriber({linger: 0});
        this.sub.connect(this.telemetryEndpoint);
        // Operation-only clients need no broadcast telemetry. Existing handlers
        // are restored on reconnect; an explicit empty prefix still receives all.
        for (const prefix of this.telemetryHandlers.keys()) this.sub.subscribe(prefix);
        this.receiveTask = this._receive(this.sub, ++this.generation);
        if (this.implementHeartbeat) this._scheduleHeartbeat();
        return response;
    }
    _scheduleHeartbeat() {
        const generation = this.generation;
        this.heartbeatTimer = setTimeout(async () => {
            if (!this.running || generation !== this.generation) return;
            const response = await this.operation(this.heartbeatOperation, {}, 1000);
            if (!this.running || generation !== this.generation) return;
            if (response.error) {
                this.running = false;
                this.logger.warn?.(`TEMPEST connection lost: ${response.payload.error}`);
                this.sub?.close();
            } else this._scheduleHeartbeat();
        }, 5000);
        this.heartbeatTimer.unref?.();
    }
    async _receive(socket, generation) {
        try {
            for await (const [topicBytes, messageBytes] of socket) {
                if (!this.running || generation !== this.generation) break;
                let message;
                try {
                    const topicFrame = topicBytes.toString();
                    let requested = false;
                    for (const prefix of this.telemetryHandlers.keys())
                        if (topicFrame.startsWith(prefix)) { requested = true; break; }
                    if (!requested) continue;
                    const wire = messageBytes.toString();
                    if (isSnapshotForOtherClient(topicFrame, wire, this.clientId)) continue;
                    message = parseWireJson(wire);
                    if (!message || typeof message !== 'object' || Array.isArray(message) ||
                        (message.topic !== undefined && typeof message.topic !== 'string'))
                        throw new Error('Invalid telemetry envelope');
                }
                catch (error) { this.logger.warn?.(`Invalid telemetry: ${error.message}`); continue; }
                if (message.payload?.client_id && message.payload.client_id !== this.clientId) continue;
                const topic = message.topic ?? topicBytes.toString();
                for (const [prefix, handlers] of [...this.telemetryHandlers]) {
                    if (!topic.startsWith(prefix)) continue;
                    for (const handler of [...handlers]) {
                        try { await handler(message, topic.slice(prefix.length)); }
                        catch (error) { this.logger.warn?.(`Telemetry callback: ${error.message}`); }
                    }
                }
            }
        } catch (error) {
            if (this.running) this.logger.warn?.(`Telemetry receiver: ${error.message}`);
        }
    }
    async disconnect() {
        ++this.generation;
        this.running = false;
        clearTimeout(this.heartbeatTimer);
        this.sub?.close();
        this.sub = null;
        // Do not await receiveTask here: a handler is allowed to disconnect.
        const response = this.clientId ? await this.operation("unregister_client", {}, 1000) :
            {clientId: "", name: "unregister_client", error: false, payload: {}, timestamp: Date.now()};
        this.clientId = "";
        this.sessionToken = "";
        return response;
    }
}
