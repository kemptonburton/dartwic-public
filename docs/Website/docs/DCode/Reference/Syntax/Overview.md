---
title: Syntax
summary: DCode values, expressions, scope, channel paths, comments, and indentation.
created: 2026-09-04T17:13
updated: 2026-10-27T16:09
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [arrays and objects](syntax-lua_tables.md) | Expressions | `[value, ...] or {key: value, ...}` | File scope, Executable DCode bodies |
| [block comments](syntax-block_comment.md) | Comments | `--[[ comment ]]` | File scope, Executable DCode bodies |
| [colon and indentation](syntax-indentation.md) | Blocks | `<block header>:` | File scope, Executable DCode bodies |
| [dash comments](syntax-dash_comment.md) | Comments | `-- comment` | File scope, Executable DCode bodies |
| [DCode expressions](syntax-lua_expressions.md) | Expressions | `<DCode expression>` | File scope, Executable DCode bodies |
| [dynamic channel reference](syntax-dynamic_pipe.md) | Channel I/O | `\|{expression}_channel\|[:field]` | File scope, Executable DCode bodies |
| [hash comments](syntax-hash_comment.md) | Comments | `# comment` | File scope, Executable DCode bodies |
| [null](syntax-null.md) | Values | `null` | File scope, Executable DCode bodies |
| [pipe read](syntax-pipe_read.md) | Channel I/O | `\|channel\|[:field]` | File scope, Executable DCode bodies |
