# User interface overview

This page enumerates every region of the Snakie window and the separate OS
windows it can open. Each region is named by what the source calls it; behaviour
is described, not taught. For the gestures that drive these regions see
[Keyboard shortcuts](keyboard-shortcuts).

The main window is laid out top-to-bottom as: an optional **notification banner**,
the **top toolbar**, the **body** (activity bar · left sidebar · editor + shell ·
chat · instrument dock), and the **status bar**. Three regions also exist as
separate windows: the **Board View**, **Find & Replace**, and floating
**instruments**.

```{figure} /_static/screenshots/ui-overview-full-window.png
:alt: The full Snakie main window in the Skeuomorph theme with a Python file open, the Files sidebar showing, the Shell con…
:width: 100%

The full Snakie main window in the Skeuomorph theme with a Python file open, the Files sidebar showing, the Shell console at the bottom, and the status bar visible — annotated regions optional.
```

## Top toolbar

A single horizontal `header` (`role="toolbar"`) pinned below any banner. Left to
right:

| Group | Control | Action |
| --- | --- | --- |
| Brand | Snake logo + **Snakie** wordmark | None (identity) |
| File actions | **New file** | Create an untitled buffer |
| | **Open folder** | Native folder picker; sets the workspace folder |
| | **Save** | Save the active file (disabled when no file is open) |
| Run | **Run** | Run the active file on the device via paste mode; output streams to the Shell. Disabled unless connected and a file is open |
| | **Stop / Reset** | Dual-purpose: interrupts a running program (Ctrl-C) when one is running, otherwise soft-resets the board (Ctrl-D). Label and glyph switch between **Stop** (■) and **Reset** (⟳). Disabled when disconnected |
| Utility knobs | **Settings** (gear) | Open the [Settings](settings) dialog on the Editor tab |
| | **Board View** (board) | Toggle the [Board View](../how-to/board-view) window open/closed |
| | **Theme** (sun/moon) | Toggle between the Skeuomorph (light) and dark themes |
| Panel knobs | **Files** | Show/hide the left sidebar |
| | **Shell** | Show/hide the bottom shell panel |
| | **Chat** | Show/hide the right chat pane |
| | **Instruments** | Show/hide the instrument dock; tooltip reports the open-instrument count |

Each panel knob shows a pressed-in (`is-active`) state while its panel is
visible. Connection state and the Flash-firmware action are **not** here — they
live in the [status bar](#status-bar).

## Activity bar

A narrow vertical icon strip on the far left (`nav`, `aria-label="Activity
bar"`). It switches the left sidebar between views. The selected view is
persisted across restarts (default **Files**).

| Group | View | Sidebar content |
| --- | --- | --- |
| Top | **Files** | Local + device file trees |
| | **Source** | Git source control |
| | **Packages** | Package + module installers |
| | **Plugins** | Python plugin rack |
| | **Inspect** | Code outline + device variables |
| Bottom | **Help** | In-app help |

Behaviour:

- Clicking a **different** view selects it and re-expands the sidebar if it was
  collapsed.
- Clicking the **already-active** view toggles the sidebar collapsed/expanded.

## Left sidebar views

Only one view is shown at a time, chosen by the activity bar. Most views drop a
redundant title bar (the activity bar already labels them); **Help** keeps its
label.

### Files

Two stacked, draggable-split browsers:

Local file tree
: The local filesystem under the open workspace folder. Browse, create, rename,
  and delete files. See [Manage files](../how-to/manage-files).

Upload controls
: A transfer bridge between local and device (upload / download).

Device file tree
: Files on the connected MicroPython board (Thonny-style). Empty until a board
  is connected.

### Source

A VS Code-style Git panel: branch indicator with ahead/behind counts; staged,
changed, and untracked file lists with per-file stage / unstage / discard; a
commit box; push / pull; and an inline unified diff. A non-repo folder shows an
empty state rather than an error. See [Version control](../how-to/version-control).

### Packages

A tab bar over two installers:

**Packages**
: An in-app MicroPython package installer (PyPI search + a curated discovery
  set). A flash-usage meter reads `os.statvfs('/')` off the board. Advanced
  options: overwrite existing files, convert to `.mpy`, and a custom index URL.
  The active list splits into **INSTALLED** (this session) and **REGISTRY**.
  Install controls require a connected board. See
  [Install packages](../how-to/install-packages).

**Modules**
: The per-component module manager — installs only the driver behind an
  instrument a robot uses. Grouped by instrument (Range, IMU, LED, …); each entry
  shows INSTALLED vs AVAILABLE with install progress and inline errors.

### Plugins

A "module rack" listing the Python plugins Snakie discovered and the commands
each registered. **MOUNTED** plugins imported OK and expand to show Run buttons;
**AVAILABLE** plugins failed to import and offer a re-spawn (GET) with the load
error. When no Python interpreter is found, an install prompt is shown instead.
A plugin command's `status` action posts a message into the status bar. See
[Plugins](../how-to/plugins).

### Inspect

Two stacked, draggable-split panels:

Outline
: Top-level `def`, `class`, and column-0 assignments in the **active editor
  file**. Clicking a symbol reveals its line in the editor. Parsing is a
  defensive line scan, not a full parser.

Variables
: The connected board's user globals (name, type, repr), read over the REPL.
  Shows a hint when no board is connected.

### Help

Self-contained in-app help: a welcome overview, a getting-started walkthrough,
and a MicroPython syntax quick reference with copy-pasteable snippets.

## Editor region

The center-top region. Top to bottom:

Tab strip
: One tab per open file, with a dirty dot and a close (×); middle-click also
  closes. A trailing **+** creates a new untitled buffer. `Ctrl/Cmd-W` closes the
  active tab; `Ctrl-Tab` / `Ctrl-Shift-Tab` cycle tabs.

Header actions
: A **Find** button (shown when at least one file is open) opens the
  [Find & Replace](../how-to/find-replace) window. `Ctrl/Cmd-F` and
  `Ctrl/Cmd-H` open the same window.

Editor
: The Monaco-based editor bound to the active file (MicroPython syntax
  highlighting, autocomplete, optional AI ghost-text). Monaco is loaded lazily —
  when no file is open the region shows an "Open a file to start editing"
  placeholder.

## Shell panel

The center-bottom region (`aria-label="Shell"`), open by default. Its header
carries a **Console / Problems** segmented toggle (mutually exclusive,
full-body), and depending on the active view:

| View | Header controls |
| --- | --- |
| Console | **Send to chat** (only when the chat pane is open), **Clear**, and the connect/disconnect control |
| Problems | A **Lint** checkbox to toggle Python linting; the Problems tab label shows the diagnostic count |

The **Console** is an interactive xterm.js terminal bound to the device's
friendly REPL (see [REPL & plotter](../how-to/repl-and-plotter)). The
**Problems** body lists YAML/JSON and lint diagnostics (see
[Validate YAML & JSON](../how-to/validate-yaml-json)). Both bodies stay mounted;
the inactive one is hidden so console scrollback survives toggling.

```{note}
The live Plotter is no longer in this panel — it lives in the instrument dock.
```

## Right pane (Chat)

A collapsible pane on the right, **collapsed by default**, dedicated to the
in-app LLM chat assistant. It holds the message thread, an input box, and a
footer to pick provider / model / effort / speed plus toggles to attach the
active file and recent console output as context. Per-provider API keys and
sign-in live in the Settings dialog's Chat tab. See
[AI assist](../how-to/ai-assist).

## Instrument dock

A fixed-width region to the right of the chat pane, shown by the toolbar
**Instruments** knob (or when an instrument is opened from a Board View node). It
hosts the live [instruments](instruments) — Oscilloscope, Multimeter, Plotter,
and the per-peripheral panels — plus a mini board view. Instruments declared
in-use by the active file are surfaced automatically. See
[Use instruments](../how-to/use-instruments).

Each instrument can be **docked** (in this rail) or **undocked** (floated). A
single global **live-poll** switch drives all instruments; it is off by default
because polling enters the raw REPL and interrupts a running program.

Undocked scope/meter instruments float in an app-root layer **over the whole
main window** (above the panels, below modals) — not as separate OS windows.

## Status bar

A thin bar pinned at the very bottom (`role="contentinfo"`).

**Left group**

| Item | Shows |
| --- | --- |
| Connection | `Connecting…`, `Connected · <port>`, `Error`, or `Disconnected`, with a status dot |
| Live-poll warning | Appears only while the instrument live-poll is on, a board is connected, and ≥1 scope/meter is open; includes a **Stop** link |
| Plugin status | The highest-priority message posted by a plugin command (optionally a link) |

**Right group**

| Item | Shows |
| --- | --- |
| Changed files | `⎇ N` — Git changes in the workspace repo (hidden when not a repo) |
| Lines | Line count of the active file |
| Save status | `Saved`, `Unsaved`, or `—` |
| Version / update | `v<version>` (click to check for updates); becomes an **Update** / **Restart** button or a download-progress label as an update progresses |
| Coffee link | A support link |
| Flash firmware | Opens the firmware flasher; a popup offers a newer MicroPython when one is detected for the connected device |

See [Flash firmware](../how-to/flash-firmware) and
[Update Snakie](../how-to/update-snakie).

## Notification banners

When applicable, a full-width banner appears above the toolbar:

Instrument library banner
: Offered when the instrument dock is open, a board is connected, and
  `instruments.py` is missing or outdated. One-click installs it to the board.

Parts import banner
: Offered when the project's placed parts need libraries the active file doesn't
  import or the board doesn't have. Installs the missing modules.

## Modal dialogs

These open over the main window, not as separate OS windows:

- **Settings** — tabbed (Editor · Chat); see [Settings](settings).
- **Firmware flasher** — opened from the status bar's Flash firmware button.
- **Prompt modal** (`usePrompt`) — the in-app text-input prompt, used in place of
  `window.prompt` (which does not work in the renderer).

## Separate windows

Two regions render in their own frameless OS `BrowserWindow`s:

Board View
: A frameless, always-on-top window. It parses the active file for pin usage and
  draws the actual board as a **node graph**, with **Breadboard** and
  **Schematic** wiring modes, a visual **Board Creator**, a docked **Parts
  Library** and **Part Editor**, live pin values, and zoom / rotate / export
  (SVG · PNG · PDF). The main window relays the active file, theme, and project
  folder to it over IPC so it updates live. See
  [Board View](../how-to/board-view).

Find & Replace
: A frameless native window with Find and Replace rows and **Match case** /
  **Whole word** toggles (find is plain-text). It has no editor access — it ships
  commands to the main window over IPC and shows the returned match count. Enter
  = find next, Shift+Enter = previous, Esc = close. See
  [Find & Replace](../how-to/find-replace).

```{figure} /_static/screenshots/ui-overview-board-window.png
:alt: The separate Board View window in node-graph mode showing a parsed board with connection nodes, sitting alongside the…
:width: 100%

The separate Board View window in node-graph mode showing a parsed board with connection nodes, sitting alongside the main Snakie window.
```

## Persistence

Panel sizes, collapsed flags, the active activity-bar view, the file-tree split,
the instrument visibility and live-poll switch, and the theme are all persisted
across restarts (panel layout via `react-resizable-panels` `autoSaveId`, the rest
via local storage). For the underlying process model see
[Architecture](../explanation/architecture).
