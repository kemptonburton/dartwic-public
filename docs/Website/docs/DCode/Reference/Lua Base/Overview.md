---
title: "Lua Base"
summary: "Lua keywords, literals, base functions, and standard libraries available to DCode scripts."
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [_G](lua-global_environment.md) | Global | `_G[<name>]` | File scope, Executable DCode bodies |
| [_VERSION](lua-version.md) | Global | `_VERSION` | File scope, Executable DCode bodies |
| [and](lua-keyword-and.md) | Keyword | `left and right` | Executable DCode bodies |
| [assert](lua-assert.md) | Function | `assert(condition, message)` | File scope, Executable DCode bodies |
| [break](lua-keyword-break.md) | Keyword | `break` | Executable DCode bodies |
| [collectgarbage](lua-collectgarbage.md) | Function | `collectgarbage(option)` | File scope, Executable DCode bodies |
| [coroutine](lua-coroutine.md) | Library | `coroutine.<member>` | File scope, Executable DCode bodies |
| [debug](lua-debug.md) | Library | `debug.<member>` | File scope, Executable DCode bodies |
| [dofile](lua-dofile.md) | Function | `dofile(filename)` | File scope, Executable DCode bodies |
| [false](lua-literal-false.md) | Literal | `false` | File scope, Executable DCode bodies |
| [getmetatable](lua-getmetatable.md) | Function | `getmetatable(value)` | File scope, Executable DCode bodies |
| [goto](lua-keyword-goto.md) | Keyword | `goto <label>` | Executable DCode bodies |
| [in](lua-keyword-in.md) | Keyword | `for <names> in <iterator>:` | Executable DCode bodies |
| [io](lua-io.md) | Library | `io.<member>` | File scope, Executable DCode bodies |
| [ipairs](lua-ipairs.md) | Function | `ipairs(table_value)` | File scope, Executable DCode bodies |
| [load](lua-load.md) | Function | `load(chunk)` | File scope, Executable DCode bodies |
| [loadfile](lua-loadfile.md) | Function | `loadfile(filename)` | File scope, Executable DCode bodies |
| [local](lua-keyword-local.md) | Keyword | `local <name> [= <value>]` | File scope, Executable DCode bodies |
| [math](lua-math.md) | Library | `math.<member>` | File scope, Executable DCode bodies |
| [next](lua-next.md) | Function | `next(table_value, index)` | File scope, Executable DCode bodies |
| [nil](lua-literal-nil.md) | Literal | `nil` | File scope, Executable DCode bodies |
| [not](lua-keyword-not.md) | Keyword | `not <value>` | Executable DCode bodies |
| [or](lua-keyword-or.md) | Keyword | `left or right` | Executable DCode bodies |
| [os](lua-os.md) | Library | `os.<member>` | File scope, Executable DCode bodies |
| [package](lua-package.md) | Library | `package.<member>` | File scope, Executable DCode bodies |
| [pairs](lua-pairs.md) | Function | `pairs(table_value)` | File scope, Executable DCode bodies |
| [pcall](lua-pcall.md) | Function | `pcall(function_name, ...)` | File scope, Executable DCode bodies |
| [rawequal](lua-rawequal.md) | Function | `rawequal(left, right)` | File scope, Executable DCode bodies |
| [rawget](lua-rawget.md) | Function | `rawget(table_value, key)` | File scope, Executable DCode bodies |
| [rawlen](lua-rawlen.md) | Function | `rawlen(value)` | File scope, Executable DCode bodies |
| [rawset](lua-rawset.md) | Function | `rawset(table_value, key, value)` | File scope, Executable DCode bodies |
| [repeat](lua-keyword-repeat.md) | Keyword | `repeat ... until <condition>` | Executable DCode bodies |
| [require](lua-require.md) | Function | `require(module_name)` | File scope, Executable DCode bodies |
| [return](lua-keyword-return.md) | Keyword | `return [values]` | Executable DCode bodies |
| [select](lua-select.md) | Function | `select(index, ...)` | File scope, Executable DCode bodies |
| [setmetatable](lua-setmetatable.md) | Function | `setmetatable(value, metatable)` | File scope, Executable DCode bodies |
| [string](lua-string.md) | Library | `string.<member>` | File scope, Executable DCode bodies |
| [table](lua-table.md) | Library | `table.<member>` | File scope, Executable DCode bodies |
| [tonumber](lua-tonumber.md) | Function | `tonumber(value)` | File scope, Executable DCode bodies |
| [tostring](lua-tostring.md) | Function | `tostring(value)` | File scope, Executable DCode bodies |
| [true](lua-literal-true.md) | Literal | `true` | File scope, Executable DCode bodies |
| [type](lua-type.md) | Function | `type(value)` | File scope, Executable DCode bodies |
| [until](lua-keyword-until.md) | Keyword | `until <condition>` | Executable DCode bodies |
| [utf8](lua-utf8.md) | Library | `utf8.<member>` | File scope, Executable DCode bodies |
| [xpcall](lua-xpcall.md) | Function | `xpcall(function_name, error_handler)` | File scope, Executable DCode bodies |
