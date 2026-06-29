# Install and enable plugins

Snakie plugins are ordinary **Python** packages that extend the editor with
commands and linters. This page shows you how to install a plugin, get Snakie to
pick it up, and run its commands from the **Plugins** panel.

For the design behind all this, see [The plugin system](../explanation/plugin-system)
and the [Plugin API reference](../reference/plugin-api).

## Open the Plugins panel

Click the **puzzle-piece** icon in the activity bar. The panel is styled as a
"module rack": each discovered plugin is a faceplate seated on mounting rails.

```{figure} /_static/screenshots/plugins-rack-overview.png
:alt: The Plugins panel open in the activity bar, showing the "PLUGIN RACK" header and at least one MOUNTED module (lit gre…
:width: 100%

The Plugins panel open in the activity bar, showing the "PLUGIN RACK" header and at least one MOUNTED module (lit green LED) such as the bundled Hello plugin.
```

The rack splits plugins into two groups:

MOUNTED
: Plugins that imported successfully. The knob points up, a green LED is lit,
  and clicking the faceplate expands its list of commands with **RUN** buttons.

AVAILABLE MODULES
: Plugins that were found but **failed to import**. No LED; the faceplate shows
  the load error and a gold **GET** button that reloads the host to retry. This
  group is hidden when everything loaded cleanly.

:::{note}
The Plugins panel reflects what the Python host actually **discovered and
loaded** — there is no separate "installed vs enabled" toggle. You enable a
plugin by making it discoverable (below) and reloading; you disable it by
removing it and reloading.
:::

## Make sure Python is available

The plugin host runs your local Python. Snakie tries `python3`, then `python`,
on your `PATH`. If neither is found, the panel shows an install prompt instead of
the rack and the rest of the app is unaffected.

To fix it: install Python 3, then install the SDK:

```bash
pip install snakie
```

Press the reload knob (the **⟳** button in the panel header) afterwards.

:::{admonition} Screenshot needed — `plugins-no-python`
:class: screenshot
What to capture: The Plugins panel "Python not found" state showing the install prompt and the `pip install snakie` code line.
:::

:::{tip}
Snakie ships a bundled copy of the `snakie` SDK plus example plugins, so the
panel works out of the box even before you `pip install` anything.
:::

## Bundled example plugins

Snakie loads its own example plugins so you have something to run immediately:

| Plugin | What it does |
| --- | --- |
| **Hello** | A minimal command plugin. `Hello` reports the active file's name and size; `Uppercase file` rewrites the buffer in upper case; `Show status link` posts a clickable status-bar message. |
| **lint-demo** | A reactive linter that flags trailing whitespace and `# TODO` comments, with a "Remove trailing whitespace" quick-fix. |
| **python** | A real Python linter built on `ruff` (preferred) or `pyflakes`, surfacing squiggles and Problems-panel rows as you edit `.py` files. |

The linter plugins run **automatically** as you type — see
[REPL & plotter](repl-and-plotter) and the editor's Problems panel for where
their output appears. The Hello commands are run on demand from the panel.

## Install a third-party plugin

Snakie discovers plugins from two places:

1. **`~/.snakie/plugins/`** — drop a plugin here and it is picked up on the next
   reload. This is the simplest way to install one.
2. **`snakie.plugins` entry points** — any installed Python package that declares
   this entry point in its `pyproject.toml` is discovered automatically.

### Option A — drop it in `~/.snakie/plugins/`

A plugin can be a single file or a package:

```bash
# single-file plugin
~/.snakie/plugins/my_plugin.py

# package plugin
~/.snakie/plugins/my_plugin/__init__.py
```

Create the folder if it does not exist, copy the plugin in, then **reload**
(below).

### Option B — pip install a package

If the plugin is distributed as a package, install it into the **same** Python
that Snakie uses (`python3`/`python` on your `PATH`):

```bash
pip install some-snakie-plugin
```

Then reload.

:::{warning}
Plugins are **arbitrary Python executed as you** — they can read and write your
files and run any code. Only install plugins you trust. The panel shows the same
reminder: "Modules run Python code on your machine. Only mount modules you trust."
:::

## Reload after installing or editing

The host loads plugins when it starts, so a newly added or edited plugin won't
appear until you reload. Press the **⟳** reload knob in the panel header (or the
**GET** button on a failed module). Snakie re-spawns the Python host and
re-discovers everything.

If a plugin appears under **AVAILABLE MODULES** with an error, it imported badly
— read the error on its faceplate, fix the Python, and reload again.

## Run a plugin command

Plugin commands act on the **active editor file**.

1. Open the file you want to act on in the editor.
2. In the Plugins panel, click a **mounted** module's faceplate to expand it.
3. Press **RUN** next to the command.

Results are applied automatically:

- A `message` result appears as a notice at the bottom of the panel.
- An `edit` result replaces the active buffer's contents and marks it dirty —
  save it as usual.
- A `status` result posts a message to the status bar.

:::{admonition} Screenshot needed — `plugins-run-command`
:class: screenshot
What to capture: An expanded mounted module (e.g. Hello) showing its commands with RUN buttons and a resulting info notice in the panel's output area.
:::

:::{note}
If no file is open you'll see "Open a file first — commands run against the
active file." Open or create a file, then run the command.
:::

Use the **Search modules…** box at the top to filter the rack by plugin name, id,
source, or command title when you have many plugins installed.

## Disable or remove a plugin

There is no per-plugin off switch in the current panel. To stop a plugin
loading, remove it from discovery and reload:

- Delete it from `~/.snakie/plugins/`, **or**
- `pip uninstall` the package that provided it.

Then press the **⟳** reload knob.

## Write your own

Plugins are just Python against the `snakie` SDK. To build one, start from the
bundled **Hello** example and see the [Plugin API reference](../reference/plugin-api)
for the full command, linter, and quick-fix API.
