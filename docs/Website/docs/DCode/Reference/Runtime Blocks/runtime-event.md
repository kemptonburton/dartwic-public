---
title: event
summary: Declare a keyed ARGUS event with board-state and firing-state channels.
created: 2026-09-04T17:13
updated: 2026-10-26T22:01
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

The event channel is 1 while the event is on the active board; silencing removes it from that board. The firing channel stays 1 while a maintained trigger condition is asserted, or for five seconds after the latest one-shot trigger. Clearing the maintained condition does not cancel an unexpired pulse. Acknowledgement does not clear firing; resolution requires acknowledgement and a stopped firing state.

## Rules

- A populated trigger section runs at activation and synchronously after accepted dependency value writes. Return numeric 1 to assert the condition and numeric 0 to clear it. Staying true does not report another detection; other numeric values, null, no return, or an execution error deassert it. Lua also converts numeric strings, which Native C++ rejects; use explicit numeric returns.
- Writing 1 directly to <event_key>_trigger or executing trigger <event_key> fires once and refreshes the five-second pulse window. The trigger channel automatically resets to 0, including after a calculated assertion; observe <event_key>_firing for the maintained state. Writing 0 directly does not clear a maintained condition or cancel a pulse.
- The optional separation_seconds defaults to 0 and controls ARGUS record quiet expiry, independently of the generated firing signal. Use 0 for a maintained condition. A positive interval can end the ARGUS occurrence while the generated firing channel remains asserted. Pulse-window expiry explicitly stops the occurrence when no maintained condition remains, even with separation_seconds set to 0.

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
