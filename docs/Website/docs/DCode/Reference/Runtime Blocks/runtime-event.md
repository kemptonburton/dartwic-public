---
title: "event"
summary: "Declare a keyed ARGUS event with board-state and firing-state channels."
---

## Syntax

```dcode
event <event_key>:
```

## Available in

- File scope

## Native C++

Event metadata and compiled trigger/handler callbacks share the DCode value language. A null trigger return produces no update.

## Lifecycle

The event channel is 1 while the event is on the active board. The firing channel is 1 while trigger pulses continue within five seconds. Resolution requires acknowledgement and a stopped firing state.

## Runtime sections

- `trigger`
- `on_firing`
- `on_event`

## Generated channels

- `<event_key>`
- `<event_key>_firing`
- `<event_key>_trigger (when trigger: is present)`

## Example

```lua
event event_key:
    title: "Event title"
    type: ${3|message,warning,error,abort|}
    description: "What happened"
    resolution: "How to resolve it"

    trigger:

    on_firing:
        -- automate the live firing state with value

    on_event:
        -- automate board presence with value
```
