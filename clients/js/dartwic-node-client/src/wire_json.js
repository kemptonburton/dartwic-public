import BigNumber from "bignumber.js";
import JSONbigFactory from "json-bigint";

const wireJson = JSONbigFactory({useNativeBigInt: false});
const maxSafeInteger = new BigNumber(Number.MAX_SAFE_INTEGER);

// json-bigint's native-BigInt mode also tries BigInt(long decimal fractions).
// Parse long numbers as BigNumber first, then preserve integer precision while
// returning channel floating-point fields as ordinary JavaScript numbers.
export function parseWireJson(text) {
    return wireJson.parse(text, (key, value) => {
        if (!BigNumber.isBigNumber(value)) return value;
        if (key !== "value" && value.isInteger() && value.abs().isGreaterThan(maxSafeInteger)) {
            return BigInt(value.toFixed());
        }
        return value.toNumber();
    });
}

export const stringifyWireJson = wireJson.stringify;

// The engine places the destination immediately before the channel object.
// Check only that short header so a broadcast SUB need not parse snapshots
// destined for another client. Unknown/older layouts fall back to full parsing.
export function isSnapshotForOtherClient(topic, wire, clientId) {
    if (topic !== "rapid/channels/snapshot") return false;
    const marker = ',"client_id":';
    const offset = wire.indexOf(marker);
    if (offset < 0 || offset > 512 || wire.indexOf(',"channels":', offset + marker.length) < 0) return false;
    return !wire.startsWith(JSON.stringify(clientId), offset + marker.length);
}
