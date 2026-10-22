import {TempestClient} from './transport.js';
import semver from 'semver';
import {readFileSync} from 'node:fs';

const packageInfo = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const MIN_ENGINE_VERSION = packageInfo.dartwic.minEngineVersion;
const names = (channels) => {
    if (!Array.isArray(channels) || !channels.length || channels.some(name => typeof name !== 'string' || !name))
        throw new TypeError('channels must be a nonempty array of names');
    return channels;
};
const checked = (response) => {
    if (response.error) throw new Error(response.payload?.error ?? 'TEMPEST operation failed');
    return response.payload;
};

/** Small Node.js DARTWIC facade. Helpers throw on failure; operation returns the raw envelope. */
export class DartwicClient {
    /** Create a client; optionally inject an existing TEMPEST client for testing or integration. */
    constructor(tempest = new TempestClient()) {
        this.tempest = tempest;
        // Keep TEMPEST's dedicated control-plane heartbeat. Compatibility is
        // checked explicitly on connect, outside the liveness timer.
        this.subscriptions = new Map();
        this.subscriptionQueue = Promise.resolve();
    }
    /** Register with the engine and check compatibility. Call disconnect before reconnecting; no writes are retried. */
    async connect(host = '127.0.0.1', port = 7000, password = '') {
        if (this.isConnected()) throw new Error('Already connected; disconnect before connecting again');
        try {
            const response = await this.tempest.connect(host, port, password, {dartwic_client_type:'node', dartwic_client_version:packageInfo.version});
            checked(response);
            const metadata = checked(await this.operation('dartwic/get-runtime-metadata'));
            if (!semver.valid(metadata.engineVersion) || semver.lt(metadata.engineVersion, MIN_ENGINE_VERSION))
                throw new Error(`Engine ${MIN_ENGINE_VERSION} or newer is required; received ${metadata.engineVersion}`);
            return response;
        } catch (error) { await this.disconnect(); throw error; }
    }
    /** Release this session and all managed channel subscriptions. Await before calling connect again. */
    async disconnect() {
        await this.subscriptionQueue.catch(() => {});
        for (const [channel, entries] of this.subscriptions)
            for (const receive of entries.values()) this.tempest.unbindTelemetryHandler('rapid/channels/snapshot', receive);
        this.subscriptions.clear();
        return this.tempest.disconnect();
    }
    /** Return local connection state. Heartbeat failure clears it; call connect again after disconnect. */
    isConnected() { return this.tempest.running; }
    /** Issue any TEMPEST operation and return its envelope. A timeout is not proof the server canceled the work. */
    async operation(name, payload = {}, timeoutMs = 5000) { return this.tempest.operation(name, payload, timeoutMs); }
    /** Search live channel keys; returns an array of names. limit defaults to 1000. */
    async searchChannels(query = '', limit = 1000) {
        return checked(await this.operation('rapid/search-channel-keys', {query, limit})).query_results;
    }
    /** Read live records keyed by name with exists and channel_data fields. */
    async getChannels(channels) {
        return checked(await this.operation('rapid/get-channels-data', {channel_names:names(channels)})).channels;
    }
    /** Read one live field, defaulting to value. Throws for a missing channel or field. */
    async queryChannel(channel, field = 'value') {
        const record = (await this.getChannels([channel]))[channel];
        if (!record?.exists || !(field in record.channel_data)) throw new Error(`Missing channel or field: ${channel}:${field}`);
        return record.channel_data[field];
    }
    /** Write a typed channel value or metadata field. Engine authority applies; manual override is not requested. */
    async upsertChannel(channel, value, field = 'value') {
        return checked(await this.operation('rapid/upsert-channel-field', {channel_name:channel, field, value}));
    }
    /** List saved dataframe views with IDs and time ranges. */
    async listDataframes() {
        return checked(await this.operation('rapid/dataframes/list', {})).frames;
    }
    /** Query recorded series. Options: from/to integer timestamps, bucketCount, bucketMode (average/extrema), timeoutMs. Returns the complete server payload and preserves integer nanoseconds as bigint. */
    async queryChannelRange(channels, options = {}) {
        const {from, to, bucketCount, bucketMode='average', timeoutMs=10000} = options;
        for (const time of [from,to]) if (time !== undefined && typeof time !== 'bigint' && !Number.isSafeInteger(time))
            throw new TypeError('Use bigint for nanoseconds beyond the safe integer range');
        if (from !== undefined && to !== undefined && from > to) throw new RangeError('from must not exceed to');
        if (!['average','extrema'].includes(bucketMode) || (bucketCount !== undefined && (!Number.isInteger(bucketCount) || bucketCount < 0)))
            throw new RangeError('Invalid bucket mode or count');
        const payload={series:names(channels)};
        if (from !== undefined) payload.from=from;
        if (to !== undefined) payload.to=to;
        if (bucketCount !== undefined) Object.assign(payload,{bucket_count:bucketCount,bucket_mode:bucketMode});
        return checked(await this.operation('rapid/query-channel-range',payload,timeoutMs));
    }
    /** Bind a raw topic prefix. Callback receives the telemetry envelope and topic suffix. Returns an idempotent local unsubscribe function. */
    subscribeTelemetry(prefix, handler) {
        this.tempest.bindTelemetryHandler(prefix,handler);
        return () => this.tempest.unbindTelemetryHandler(prefix,handler);
    }
    /** Enable an exact channel stream and deliver its initial snapshot. Returns an async idempotent unsubscribe function; subscribe again after reconnect. Callback errors on updates are isolated by TEMPEST. */
    async subscribeChannel(channel, handler) {
        names([channel]);
        if (typeof handler !== 'function') throw new TypeError('handler must be a function');
        const token=Symbol();const topic='rapid/channels/snapshot';
        const receive=(message,suffix)=> {
            if (suffix) return;
            const record=message.payload?.channels?.[channel];
            if (record) return handler(record);
        };
        const serialized=(fn)=> {
            const result=this.subscriptionQueue.then(fn);
            this.subscriptionQueue=result.catch(()=>{});
            return result;
        };
        const snapshot=await serialized(async()=>{
            const entries=this.subscriptions.get(channel)??new Map();
            this.tempest.bindTelemetryHandler(topic,receive);
            try {
                const initial=entries.size ? {channel_name:channel,...(await this.getChannels([channel]))[channel]} :
                    checked(await this.operation('dartwic/add-channel-to-telemetry',{channel_name:channel})).snapshot;
                entries.set(token,receive);this.subscriptions.set(channel,entries);
                return initial;
            } catch(error) {this.tempest.unbindTelemetryHandler(topic,receive);throw error;}
        });
        const unsubscribe=()=>serialized(async()=>{
            const entries=this.subscriptions.get(channel);
            if(!entries?.has(token))return;
            if(entries.size===1&&this.isConnected()) checked(await this.operation('dartwic/remove-channel-from-telemetry',{channel_name:channel}));
            entries.delete(token);this.tempest.unbindTelemetryHandler(topic,receive);
            if(!entries.size)this.subscriptions.delete(channel);
        });
        try {await handler(snapshot);} catch(error){await unsubscribe();throw error;}
        return unsubscribe;
    }
}
