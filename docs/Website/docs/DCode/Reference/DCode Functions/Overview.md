---
title: DCode Functions
summary: Functions supplied by DARTWIC for channels, prompting, logging, timing, and other runtime behavior.
created: 2026-08-04T17:38
updated: 2026-10-19T18:26
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [abort](function-abort.md) | ARGUS | `abort(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [callDcodeCallback](library-callDcodeCallback.md) | DCode | `callDcodeCallback(callback_name, arguments)` | Executable DCode bodies |
| [callDcodeFunction](function-callDcodeFunction.md) | Plugin Bridge | `callDcodeFunction(function_name, payload)` | File scope, Executable DCode bodies |
| [clamp](function-clamp.md) | Utility | `clamp(value, min_value, max_value)` | File scope, Executable DCode bodies |
| [copy](function-copy.md) | Collections | `copy(value)` | Executable DCode bodies, File scope |
| [error](function-error.md) | ARGUS | `error(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [has](function-has.md) | Collections | `has(object, key)` | Executable DCode bodies, File scope |
| [hold](function-hold.md) | ARGUS | `hold(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [insertChannelReference](function-insertChannelReference.md) | Channel I/O | `insertChannelReference(reference, data)` | File scope, Executable DCode bodies |
| [items](function-items.md) | Collections | `items(object)` | Executable DCode bodies, File scope |
| [json.parse](function-json-parse.md) | JSON | `json.parse(text)` | Executable DCode bodies, File scope |
| [json.stringify](function-json-stringify.md) | JSON | `json.stringify(value)` | Executable DCode bodies, File scope |
| [keys](function-keys.md) | Collections | `keys(object)` | Executable DCode bodies, File scope |
| [len](function-len.md) | Collections | `len(value)` | Executable DCode bodies, File scope |
| [log](function-log.md) | Output | `log(stream, message)` | File scope, Executable DCode bodies |
| [log_error](function-log_error.md) | Output | `log_error(stream, message)` | File scope, Executable DCode bodies |
| [log_warning](function-log_warning.md) | Output | `log_warning(stream, message)` | File scope, Executable DCode bodies |
| [lookup](function-lookup.md) | Collections | `lookup(object, key, fallback)` | Executable DCode bodies, File scope |
| [message](function-message.md) | ARGUS | `message(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [print](function-print.md) | Output | `print(...)` | File scope, Executable DCode bodies |
| [promptNumerical](function-promptNumerical.md) | ARGUS | `promptNumerical(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [promptOptions](function-promptOptions.md) | ARGUS | `promptOptions(title, description, options, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [promptString](function-promptString.md) | ARGUS | `promptString(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [promptYesNo](function-promptYesNo.md) | ARGUS | `promptYesNo(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
| [queryChannelReference](function-queryChannelReference.md) | Channel I/O | `queryChannelReference(reference)` | File scope, Executable DCode bodies |
| [releaseHold](function-releaseHold.md) | ARGUS | `releaseHold(title)` | File scope, Executable DCode bodies |
| [startDataFrame](function-startDataFrame.md) | Dataframes | `startDataFrame(name, options?)` | File scope, Executable DCode bodies |
| [startDcodeCallback](library-startDcodeCallback.md) | DCode | `startDcodeCallback(callback_name, arguments)` | Executable DCode bodies |
| [stopDataFrame](function-stopDataFrame.md) | Dataframes | `stopDataFrame(id)` | File scope, Executable DCode bodies |
| [tempest_operation](function-tempest_operation.md) | TEMPEST | `tempest_operation(node, operation, payload?)` | File scope, Executable DCode bodies |
| [tempest_pinned_operation](function-tempest_pinned_operation.md) | TEMPEST | `tempest_pinned_operation(node, preset, overrides?)` | File scope, Executable DCode bodies |
| [tempest_publish](function-tempest_publish.md) | TEMPEST | `tempest_publish(topic, payload)` | File scope, Executable DCode bodies |
| [upsertChannelReference](function-upsertChannelReference.md) | Channel I/O | `upsertChannelReference(reference, data)` | File scope, Executable DCode bodies |
| [values](function-values.md) | Collections | `values(object)` | Executable DCode bodies, File scope |
| [wait](function-wait.md) | Utility | `wait(seconds)` | File scope, Executable DCode bodies |
| [wait_until](function-wait_until.md) | Utility | `wait_until(condition, time=0, timeout=0)` | File scope, Executable DCode bodies |
| [warning](function-warning.md) | ARGUS | `warning(title, description, channels?, resolution?, auto_acknowledge?, separation_seconds, system?, subsystem?)` | File scope, Executable DCode bodies |
