---
title: Projects and Files
summary: Open projects and work with their files, directories, and project metadata.
created: 2026-08-04T17:33
updated: 2026-10-25T22:12
---

| Operation | Description |
| --- | --- |
| [`dartwic/delete-file`](dartwic/delete-file.md) | Deletes one file, one empty directory, or a resource group containing only its own file and empty nested directories. |
| [`dartwic/get-directory-tree`](dartwic/get-directory-tree.md) | Returns a recursive directory tree rooted at a workspace resource directory. |
| [`dartwic/get-file`](dartwic/get-file.md) | Reads a text file and optionally creates it when missing. |
| [`dartwic/move-file`](dartwic/move-file.md) | Moves a file or directory to a new path within the selected root. |
| [`dartwic/projects/check-portability`](dartwic/projects/check-portability.md) | Checks declared dependencies and JSON resources in the active project. |
| [`dartwic/projects/create`](dartwic/projects/create.md) | Creates a project and makes it available to the engine. |
| [`dartwic/projects/get-active`](dartwic/projects/get-active.md) | Returns the active project. |
| [`dartwic/projects/list`](dartwic/projects/list.md) | Lists available projects. |
| [`dartwic/projects/rename`](dartwic/projects/rename.md) | Renames an existing project. |
| [`dartwic/projects/select`](dartwic/projects/select.md) | Selects the active project loaded by the engine. |
| [`dartwic/rename-file`](dartwic/rename-file.md) | Renames a file or directory without changing its parent directory. |
| [`dartwic/save-file`](dartwic/save-file.md) | Writes a file or creates a directory below a workspace root. |
| [`dartwic/search-files`](dartwic/search-files.md) | Searches file names, paths, and optionally text content in the active project. |
| [`dartwic/search-files/start`](dartwic/search-files/start.md) | Starts a detached job that searches project files. |
| [`dartwic/settings/configure`](dartwic/settings/configure.md) | Writes workspace/project overrides, or resets JSON pointers to inheritance. |
| [`dartwic/settings/get`](dartwic/settings/get.md) | Reads portable policy and its source scopes. |
| [`project/actions/apply`](project/actions/apply.md) | Applies an action with refreshed evidence, serializing it behind active actions. |
| [`project/actions/cancel`](project/actions/cancel.md) | Cancels queued actions immediately or requests cancellation at the next safe running step. Current work finishes before stopping; rename recovery restores prior state and completed deletions are retained and saved. |
| [`project/actions/create`](project/actions/create.md) | Creates a reviewed project operation. |
| [`project/actions/dismiss`](project/actions/dismiss.md) | Dismisses a persisted project action. |
| [`project/actions/list`](project/actions/list.md) | Lists persisted project actions and their current step status. |
| [`project/actions/update`](project/actions/update.md) | Rechecks a project action and optionally changes its rename destination. |
