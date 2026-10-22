#pragma once
#include <algorithm>
#include <optional>
#include <regex>
#include <string>
#include <vector>

namespace DARTWIC::Client::detail {
struct Version {
    std::vector<std::string> core;
    std::vector<std::string> prerelease;
};
inline bool numeric(const std::string& value) {
    return value.find_first_not_of("0123456789") == std::string::npos;
}
inline std::optional<Version> parseVersion(const std::string& value) {
    std::smatch match;
    static const std::regex pattern(R"((0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?)");
    if (!std::regex_match(value, match, pattern)) return std::nullopt;
    Version result{{match[1],match[2],match[3]}, {}};
    const auto pre = match[4].str();
    for (std::size_t start=0;start<pre.size();) {
        const auto end=pre.find('.', start);
        auto part=pre.substr(start, end==std::string::npos?end:end-start);
        if (numeric(part) && part.size()>1 && part[0]=='0') return std::nullopt;
        result.prerelease.push_back(std::move(part));
        if (end==std::string::npos) break;
        start=end+1;
    }
    return result;
}
inline int compareIdentifier(const std::string& left, const std::string& right) {
    const bool ln=numeric(left), rn=numeric(right);
    if (ln!=rn) return ln?-1:1;
    // Compare numeric identifiers without a machine-integer overflow limit.
    if (ln && left.size()!=right.size()) return left.size()<right.size()?-1:1;
    return left==right?0:left<right?-1:1;
}
inline bool versionAtLeast(const std::string& current, const std::string& minimum) {
    const auto left=parseVersion(current), right=parseVersion(minimum);
    if (!left || !right) return false;
    for (std::size_t i=0;i<3;++i) {
        const auto comparison=compareIdentifier(left->core[i],right->core[i]);
        if (comparison) return comparison>0;
    }
    if (left->prerelease.empty() || right->prerelease.empty())
        return left->prerelease.empty();
    for (std::size_t i=0;i<std::min(left->prerelease.size(),right->prerelease.size());++i) {
        const auto comparison=compareIdentifier(left->prerelease[i],right->prerelease[i]);
        if (comparison) return comparison>0;
    }
    return left->prerelease.size()>=right->prerelease.size();
}
}
