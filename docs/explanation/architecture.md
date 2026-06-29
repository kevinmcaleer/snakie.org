# Architecture

Snakie is an [Electron](https://www.electronjs.org/) desktop application built
with electron-vite, React and TypeScript, with Monaco for editing and
`node-serialport` for talking to MicroPython devices. This page explains how the
pieces fit together.

## Three processes

Electron splits an app into cooperating processes, and Snakie follows the standard
`src/main` · `src/preload` · `src/renderer` layout:

- **Main** (`src/main/**`) — the Node.js process. It owns the windows, the
  application menu, and all the privileged work: the serial **device** layer
  (the MicroPython raw-REPL protocol), the **filesystem**, **git**, the
  **plugin** host, firmware flashing, package installs, and the auto-updater.
- **Preload** (`src/preload/**`) — a small bridge that runs with Node access but
  in the renderer's context. It uses Electron's `contextBridge` to expose a
  curated `window.api` to the UI — nothing more. (It is built as `index.cjs`
  because the preload `require()`s Node modules.)
- **Renderer** (`src/renderer/src/**`) — the React UI: the activity bar and side
  views, the editor and tabs, the shell, the status bar and the panels. It never
  touches Node directly; it calls `window.api`.

```{note}
Every IPC handler returns a **serializable `IpcResult<T>`** — a plain
`{ ok, value | error }` object the preload unwraps — so a failure in the main
process surfaces as a value the UI can handle, never an exception across the IPC
boundary.
```

## More than one window

Beyond the main editor window, Snakie opens a few **secondary windows**, each its
own renderer entry point:

- the **Board View** (`board.html`) — the live, node-graph / breadboard /
  schematic board visualiser, which also hosts the Parts Library and Part Editor;
- **Find & Replace** (`find.html`) — a small always-on-top window that drives
  find/replace in the main editor over IPC (it can't reach Monaco directly);
- **instruments** — floating instrument windows.

These windows use native OS chrome and the main process relays messages between
them (e.g. a board-selection broadcast, or a find command → the editor → a match
count back).

## The device layer

Connecting to a board opens its serial port and speaks MicroPython's **raw REPL**:
Snakie can send code to run, read output, soft-reset the board, and read/write
files on it. Because entering the raw REPL interrupts whatever is running, Snakie
is careful about *when* it talks to the device — see
[Non-invasive live telemetry](telemetry-design).

:::{admonition} Screenshot needed — `architecture-windows`
:class: screenshot
What to capture: the Snakie main window alongside the separate Board View and an
instrument window, to illustrate the multi-window architecture.
:::

## Further reading

- [How the Board View understands your code](board-pin-parsing)
- [The parts and boards model](parts-and-boards-model)
- [How firmware flashing works](firmware-model)
