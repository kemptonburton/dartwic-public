// Legacy display versions may use an underscore or a leading v. All ordering
// after that normalization follows SemVer, including numeric prerelease fields.
export function normalizeComparableVersion(value) {
  return String(value ?? "").trim().replace(/_/g, "-").replace(/^v(?=\d)/i, "");
}

export function parseSemanticVersion(value) {
  const match = normalizeComparableVersion(value).match(/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/);
  if (!match) return null;
  const prerelease = match[4] ? match[4].split(".") : [];
  if (prerelease.some((part) => /^\d+$/.test(part) && part.length > 1 && part[0] === "0")) return null;
  return {core: match.slice(1, 4), prerelease};
}

function compareIdentifier(left, right) {
  const ln = /^\d+$/.test(left), rn = /^\d+$/.test(right);
  if (ln !== rn) return ln ? -1 : 1;
  if (ln && left.length !== right.length) return left.length < right.length ? -1 : 1;
  return left === right ? 0 : left < right ? -1 : 1;
}

export function compareVersions(left, right) {
  const a = parseSemanticVersion(left), b = parseSemanticVersion(right);
  // Unknown/invalid versions sort below valid releases; minimum checks below
  // reject invalid inputs instead of interpreting them as a supported runtime.
  if (!a || !b) return a ? 1 : b ? -1 : compareIdentifier(normalizeComparableVersion(left), normalizeComparableVersion(right));
  for (let index = 0; index < 3; index += 1) {
    const comparison = compareIdentifier(a.core[index], b.core[index]);
    if (comparison) return comparison;
  }
  if (!a.prerelease.length || !b.prerelease.length) {
    return a.prerelease.length === b.prerelease.length ? 0 : a.prerelease.length ? -1 : 1;
  }
  for (let index = 0; index < Math.min(a.prerelease.length, b.prerelease.length); index += 1) {
    const comparison = compareIdentifier(a.prerelease[index], b.prerelease[index]);
    if (comparison) return comparison;
  }
  return Math.sign(a.prerelease.length - b.prerelease.length);
}

export function isVersionAtLeast(currentVersion, minimumVersion) {
  if (!String(minimumVersion ?? "").trim()) return true;
  return Boolean(parseSemanticVersion(currentVersion) && parseSemanticVersion(minimumVersion)
    && compareVersions(currentVersion, minimumVersion) >= 0);
}
