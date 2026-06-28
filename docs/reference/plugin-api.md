# Plugin API

Reference for the Snakie plugin system: how a plugin is structured and
discovered, the `snakie` Python SDK surface (registry, context, action helpers),
the host JSON-RPC protocol, and the renderer IPC bridge.

Plugins are ordinary **Python** packages. Snakie spawns a Python host
(`python3 -m snakie.host`) that discovers and imports them and talks to the
editor over newline-delimited JSON-RPC. Plugin authors only write Python against
the `snakie` SDK.

For tasks see [Run and manage plugins](../how-to/plugins); for the design
rationale see [Plugin system](../explanation/plugin-system).

```{important}
Plugins are arbitrary Python executed as you, with your privileges. Install only
plugins you trust. There is no sandbox.
```

## Plugin structure

A plugin is a single-file module or a package:

| Form | Path |
| --- | --- |
| Single-file plugin | `~/.snakie/plugins/my_plugin.py` |
| Package plugin | `~/.snakie/plugins/my_plugin/__init__.py` |
| Installed package | declares a `snakie.plugins` entry point in its `pyproject.toml` |

A plugin imports the shared registry and registers commands/linters with
decorators. There is no required `register()` function — importing the module
runs its decorators.

```python
from snakie import plugin, Context, message, edit

@plugin.command("hello", "Say hello")
def hello(ctx: Context):
    return message("info", f"Editing {ctx.file.name} ({len(ctx.file.content)} chars)")

@plugin.command("upper", "Uppercase the file")
def upper(ctx: Context):
    return edit(ctx.file.content.upper())
```

## Discovery

Plugins are discovered from three places (all combined):

| Source | `PluginInfo.source` | Location |
| --- | --- | --- |
| User directory | `directory` | `~/.snakie/plugins/` |
| Extra directories | `directory` | `--plugin-dir` CLI args and the `SNAKIE_PLUGIN_DIRS` env var (`os.pathsep`-separated). Snakie passes its bundled `examples/plugins` dir this way. |
| Entry points | `entry-point` | the `snakie.plugins` entry-point group of any installed package (best-effort via `importlib.metadata`). |

Directory scanning rules:

- A child file matches if its suffix is `.py`; a child directory matches if it
  contains `__init__.py`.
- Children whose name starts with `.` or `_` are skipped.
- Directories are scanned in sorted order; duplicate directories are de-duplicated.

**Plugin id** is derived from the path: the directory name for a package
(`my_plugin/__init__.py` → `my_plugin`), or the file stem for a single file
(`my_plugin.py` → `my_plugin`). For entry-point plugins it is the entry-point
name. Each command registered during a plugin's import is tagged with that id so
the UI can group commands by plugin.

Import errors are captured **per plugin** — a failing plugin is reported with
`ok: false` and an `error` string, and never aborts discovery of the others.

```{note}
The bundled SDK and example plugins (`hello`, `lint_demo`, `python_linter`) make
the Plugins view work out of the box, before you `pip install snakie` or add any
plugins of your own.
```

## The `snakie` SDK

Import everything from the top-level `snakie` package. The SDK is
standard-library only (no third-party dependencies). Current `__version__` is
`0.1.0`.

```python
from snakie import (
    plugin, Plugin, Context, FileContext, Selection, Command, Linter,
    message, edit, status, diagnostic, fix,
)
```

### Registry — `plugin`

`plugin` is a single shared `Plugin` instance imported by every plugin. It
exposes two decorators.

`@plugin.command(id, title)`
: Register a command. `id` is unique and used to invoke it; `title` is the
  label shown in the Plugins view. The decorated function takes a `Context`
  and returns an action (or list of actions), or `None`.

`@plugin.linter(name)`
: Register a linter. The handler takes a `Context` and returns a list of
  diagnostics (or a single diagnostic, or `None`). Linters run reactively as the
  active file changes (see [Reactive linting](#reactive-linting)).

The `Plugin` class also holds `commands: list[Command]`, `linters: list[Linter]`,
and `find(command_id) -> Command | None`.

### `Context`

The argument every command and linter receives.

| Attribute | Type | Description |
| --- | --- | --- |
| `file` | `FileContext` | The active editor file. |
| `selection` | `Selection \| None` | The current text selection, if any. |

**`FileContext`**

| Attribute | Type | Description |
| --- | --- | --- |
| `path` | `str` | Full path of the file. |
| `name` | `str` | File name. |
| `source` | `str` | `"local"` or `"device"`. |
| `content` | `str` | Full text of the active buffer. |

**`Selection`** (all line/column values are **1-based**)

| Attribute | Type |
| --- | --- |
| `start_line` | `int` |
| `start_column` | `int` |
| `end_line` | `int` |
| `end_column` | `int` |
| `text` | `str` (default `""`) |

### Action helpers

A command returns one action, a list of actions, `None`, or a bare string. The
host normalises the return value:

| Returned | Becomes |
| --- | --- |
| `None` | no actions |
| a `dict` (action) | a single-element list |
| a `list` / `tuple` | the `dict` items in it (non-dicts dropped) |
| a `str` | an `info` message action |

#### `message(level, text)`

Posts a notice in the Plugins panel.

| Parameter | Type | Description |
| --- | --- | --- |
| `level` | `str` | `"info"`, `"warning"`, or `"error"`. |
| `text` | `str` | The message text. |

Produces `{"type": "message", "level", "text"}`.

#### `edit(new_content)`

Replaces the active file's full contents with `new_content`. The buffer is
marked dirty; save as usual.

Produces `{"type": "edit", "content"}`.

#### `status(text, *, tooltip=None, href=None, priority=0)`

Posts a persistent message to Snakie's **status bar** (left group), distinct
from `message` which posts to the Plugins panel.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `text` | `str` | — | Status bar text. |
| `tooltip` | `str \| None` | `None` | Hover title. |
| `href` | `str \| None` | `None` | When set, the message is a clickable link opened externally in the browser. |
| `priority` | `int` | `0` | When several statuses are posted, the highest priority wins. |

Produces `{"type": "status", "text", "priority", "tooltip"?, "href"?}`. May be
returned from a command or a linter.

#### `diagnostic(line, message, *, ...)`

Produces a problem marker. Returned from a command it shows as a notice;
returned from a linter it becomes an editor squiggle.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `line` | `int` | — | 1-based line. |
| `message` | `str` | — | Marker text. |
| `severity` | `str` | `"warning"` | `"error"`, `"warning"`, `"info"`, or `"hint"`. |
| `column` | `int \| None` | `None` | 1-based start column. |
| `end_line` | `int \| None` | `None` | 1-based end line. |
| `end_column` | `int \| None` | `None` | 1-based end column. If omitted, the editor extends the squiggle to the end of the word or line. |
| `source` | `str` | `"snakie"` | Origin label shown with the marker. |
| `fixes` | `list \| None` | `None` | Quick-fixes built with `fix(...)`. |

Produces `{"type": "diagnostic", "item": {...}}`. A linter may also return the
bare `item` dict (`{line, message, ...}`) — the host normalises both forms.

#### `fix(title, new_text, *, ...)`

Builds a quick-fix attached to a diagnostic, surfaced on the editor lightbulb.

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `str` | — | Lightbulb label. |
| `new_text` | `str` | — | Replacement text. |
| `line` | `int \| None` | `None` | 1-based start line of the range to replace. |
| `column` | `int \| None` | `None` | 1-based start column. |
| `end_line` | `int \| None` | `None` | 1-based end line. |
| `end_column` | `int \| None` | `None` | 1-based end column. |

Produces `{"title", "edit": {"newText", ...range}}`. **Omit the range entirely**
to mean "replace the diagnostic's own range". Fixes are always ranged — there is
no whole-file replacement form.

```{tip}
Coordinates across diagnostics, fixes, and selections are all 1-based.
```

## Reactive linting

When the active file's content changes — and on file open/switch — Snakie
debounces ~400 ms, then runs every registered linter via the host's `lint` RPC
against the current `{file: {path, name, source, content}}`. Stale requests are
cancelled, so it never lints on every keystroke.

- Returned diagnostics become Monaco markers (severity-coloured squiggles).
- Diagnostics carrying `fixes` are offered as lightbulb quick-fixes; applying one
  edits the buffer in place (marking it dirty and re-linting).
- A linter may return a single diagnostic, a list, `None`, or a `status` action
  (the host surfaces it to the status bar).
- An exception raised inside one linter is isolated (logged to stderr) and never
  aborts the others.
- If Python is not found or the host is unavailable, linting is a silent no-op.

The bundled `python_linter` plugin implements real Python linting on this API:
it prefers **ruff** (rich rules + quick-fixes), falls back to **pyflakes**, and
returns no diagnostics when neither is installed. Its `python_linter.status`
command reports the detected tool (`ruff`, `pyflakes`, or `none`).

:::{admonition} Screenshot needed — `plugin-api-linter-squiggle`
:class: screenshot
What to capture: the editor showing a plugin-produced squiggle (e.g. the
lint_demo "Trailing whitespace" warning) with its lightbulb quick-fix menu open.
:::

## Host protocol

The host (`python3 -m snakie.host`) speaks **newline-delimited JSON-RPC** over
stdin/stdout — one JSON object per line. Requests are
`{"id", "method", "params"}`; responses are `{"id", "result"}` or
`{"id", "error": {"message", "traceback"}}`. stdout carries only protocol
messages; anything a plugin prints to stdout is redirected to stderr so it
cannot corrupt the channel.

| Method | Params | Result |
| --- | --- | --- |
| `initialize` | — | `{plugins: PluginInfo[]}` |
| `listCommands` | — | `{commands: CommandInfo[]}` |
| `runCommand` | `{commandId, context}` | `{actions: Action[]}` |
| `lint` | `{context}` | `{diagnostics: Diagnostic[], actions?: Action[]}` |
| `shutdown` | — | `{ok: true}` |

`context` = `{file: {path, name, source, content}, selection?}`.

The host accepts CLI flags: `--plugin-dir DIR` (repeatable) adds extra scan
directories, equivalent to the `SNAKIE_PLUGIN_DIRS` env var.

## Interpreter resolution

The main process locates an interpreter by trying, in order: `python3`, then
`python` on `PATH`. The host is spawned with `-u -m snakie.host` and:

- `PYTHONPATH` prepended with the bundled `python/` dir (so the `snakie` SDK
  imports without a `pip install`).
- `SNAKIE_PLUGIN_DIRS` set to the bundled `examples/plugins` dir.

If no interpreter works, the Plugins panel shows a "no Python" install prompt;
the rest of the app is unaffected, and reactive linting becomes a no-op.

## Renderer IPC bridge

The preload exposes `window.api.plugins`, mirroring the main-process
`plugins:*` IPC handlers.

| Method | Returns | Description |
| --- | --- | --- |
| `status()` | `PluginStatus` | Whether a Python host is available. |
| `list()` | `PluginListing` | Discovered plugins + their commands. |
| `runCommand(commandId, context)` | `RunCommandResult` | Run a command against editor context. |
| `lint(context)` | `LintResult` | Run all linters; concatenated diagnostics. |
| `reload()` | `PluginStatus` | Kill and re-spawn the host, picking up new plugins. |

### Serializable shapes

```typescript
interface PluginInfo {
  id: string
  name: string
  path?: string                       // directory-discovered plugins
  source: 'directory' | 'entry-point'
  ok: boolean
  error?: string                      // when ok is false
}

interface CommandInfo {
  id: string
  title: string
  pluginId: string
}

interface PluginStatus {
  pythonFound: boolean
  python?: string                     // the interpreter command used
  error?: string                      // reason when not found / host died
}

interface PluginListing { plugins: PluginInfo[]; commands: CommandInfo[] }
interface LintResult { diagnostics: Diagnostic[] }
interface RunCommandResult { actions: PluginAction[] }
```

`PluginAction` is one of `MessageAction`, `EditAction`, `DiagnosticAction`, or
`StatusAction` — the serialized equivalents of the SDK action helpers above.

## Example plugins

Snakie bundles three plugins as scaffolds; copy one into `~/.snakie/plugins/` to
start from it.

| Plugin | Demonstrates |
| --- | --- |
| `hello` | `message`, `edit`, and `status` actions (commands `hello`, `hello.upper`, `hello.status`). |
| `lint_demo` | `@plugin.linter` with `diagnostic` + `fix` (trailing whitespace and `# TODO` rules). |
| `python_linter` | A real reactive linter wrapping ruff / pyflakes. |

```{figure} /_static/screenshots/plugin-api-plugins-view.png
:alt: the Plugins activity-bar view listing the discovered plugins and their commands with Run buttons, and the Reload acti…
:width: 100%

the Plugins activity-bar view listing the discovered plugins and their commands with Run buttons, and the Reload action.
```
