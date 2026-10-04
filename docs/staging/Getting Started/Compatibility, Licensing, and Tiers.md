---
updated: 2026-06-23
created: 2026-06-23
---

DARTWIC environments can expose different features depending on version compatibility, license entitlements, and tier.

# Compatibility

DARTWIC compatibility is primarily version-floor based. Public clients and plugins declare the minimum host versions they expect.

Main rules:

- clients can reject engines that are too old
- plugins declare minimum engine and/or interface versions
- version mismatches should fail early rather than degrade silently

If something connects or loads but behaves strangely, check version compatibility before spending time on deeper debugging.

# Licensing

Licensing affects which features, workflows, or deployment capabilities are available in a given environment.

Most operators do not need the licensing internals. They mainly need to know whether a feature is expected to be available and what to do when it is not.

A license may control:

- feature availability
- entitlement-driven capabilities
- deployment or packaging limits depending on the environment

# Tiers

Tiers explain why two DARTWIC environments may expose different capabilities even when they look similar at first glance.

| Tier | Typical Fit |
| --- | --- |
| Free | Evaluation, small experiments, or constrained workflows. |
| Pro | Broader day-to-day operator and integration features. |
| Enterprise | Wider deployment, control, and organizational support needs. |

# Practical Troubleshooting

When a documented feature is missing:

1. Check whether the engine and interface versions are compatible.
2. Check whether the plugin or client declares a higher minimum version.
3. Check whether the feature is licensed in this environment.
4. Check whether the current tier is expected to include it.
