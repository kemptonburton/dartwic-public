---
title: "Directives"
summary: "Compile-time and module-level forms that import code, define parameters, or expand templates."
---

| Feature | Family | Syntax | Available in |
|---|---|---|---|
| [import](directive-import.md) | Modules | `import "<module>"` | File scope, Runtime block scope |
| [params = yaml](directive-params_yaml.md) | Templates | `<name> = yaml "<path>#<selector>"` | File scope |
| [template(params)](directive-template.md) | Templates | `template(<params>) <runtime block>` | File scope |
