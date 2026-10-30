---
title: event
summary: Declare a keyed ARGUS event with board-state and firing-state channels.
created: 2026-09-04T17:13
updated: 2026-10-28T19:18
---

## Syntax

```dcode
event <event_key>:
```

## Available in

- File scope

## Native C++

Compiled triggers and reactions use the same event lifecycle as Lua. Only an exact numeric 1 asserts a maintained trigger; null, no return, other results, or an execution error deassert it.

## Lifecycle

The event channel is 1 while the event is on the active board; silencing removes it from that board. The firing channel reflects the declaration firing lifecycle. A false trigger condition, explicit stop, or configured inactivity timeout ends firing. Zero timeout requires a false condition or explicit stop. Acknowledgement does not clear firing; resolution requires acknowledgement and a stopped firing state.

## Rules

- A populated trigger section runs at activation and synchronously after accepted dependency value writes. Return numeric 1 to assert the condition and numeric 0 to clear it. Each evaluation returning 1 reports another detection; other numeric values, null, no return, or an execution error deassert it. Lua also converts numeric strings, which Native C++ rejects; use explicit numeric returns.
- Writing 1 directly to <event_key>_trigger or executing trigger <event_key> reports a detection and refreshes the configured inactivity deadline. The trigger channel automatically resets to 0, including after a calculated assertion; observe <event_key>_firing for the maintained state. Automatic trigger reset and direct writes of 0 do not end firing.
- The optional firing_timeout_seconds defaults to 0. Positive values end firing after that many seconds without a declaration detection, including when the last trigger evaluation was true. Zero disables inactivity expiry. Generic reporters sharing this event identity do not renew the declaration binding or invoke its reactions.

## Generated channels

- `<event_key>`
- `<event_key>_firing`
- `<event_key>_trigger (when trigger: is present)`

## Example

```dcode
event event_key:
    title: "Event title"
    type: message
    description: "What happened"
    resolution: "How to resolve it"

    trigger:

    on_firing:
        -- automate the live firing state with value

    on_event:
        -- automate board presence with value
```
