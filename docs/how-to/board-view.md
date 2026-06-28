# Use the Board View

The **Board View** is a separate window that visualises the wiring of the file
you are editing. It parses your MicroPython for pin usage, draws it against a
real board pinout, and lets you place and wire parts. This page covers driving
that window: the three view tabs, the board picker, zoom/fit/rotate, export, and
live pin values.

For *why* pins are detected the way they are, see
[How board pins are parsed](../explanation/board-pin-parsing). To add your own
board to the picker, see [Add a board definition](add-board-definition).

## Open (and close) the window

You can open the Board View three ways:

- Click the **Board View** button in the toolbar (the dev-board icon next to
  Run/Stop). It is a toggle.
- Use the application **Window** menu.
- Click the **expand** icon in the top-right of the **mini board view** — the
  compact board preview that sits above the instruments panel in the main
  window.

The window streams the active file live, so the drawing updates as you type. To
close it, use the OS window controls or press <kbd>Esc</kbd>.

```{figure} /_static/screenshots/board-view-window.png
:alt: The Board View open as its own OS window beside the main editor, showing the styled title bar (drag grip, BOARD VIEW …
:width: 100%

The Board View open as its own OS window beside the main editor, showing the styled title bar (drag grip, BOARD VIEW label, view tabs, board picker, MCU chip) above the board drawing.
```

```{note}
The Board View is a standard OS window with native title-bar chrome
(minimise / maximise / close), so it appears in the OS **Window** menu. It is
**not** always-on-top, so you can put it wherever you like — on a second
monitor, for instance.
```

## Switch between the three views

The title bar carries three tabs:

| Tab | What it shows |
| --- | --- |
| **Node graph** | One card per parsed connection on the left, each wired by a coloured "noodle" to its real pad on the board, plus a **PINS IN USE** table below. Read-only — derived entirely from your code. |
| **Breadboard** | A life-like layout: the board drawn as its real body with placed parts you can position and wire with node-RED-style cables. |
| **Schematic** | The same wiring drawn as an orthogonal schematic. |

Click a tab to switch. **Breadboard** is the default, and your **last-used tab is
remembered** across sessions.

The Breadboard and Schematic views let you drop parts from the **Library** dock
on the right and wire them up; see [Install part drivers](install-part-drivers)
and [Export a BOM & pinouts](export-bom-pinouts) for what you can do with a wired
project.

```{figure} /_static/screenshots/board-view-tabs.png
:alt: Close-up of the title-bar tabs (Node graph / Breadboard / Schematic) with one selected, alongside the board picker dr…
:width: 100%

Close-up of the title-bar tabs (Node graph / Breadboard / Schematic) with one selected, alongside the board picker dropdown and the MCU chip badge.
```

## Pick a board

Click the board name in the title bar to open the **board picker** — a dropdown
listing every built-in board plus any boards you have authored. Each row shows
the board name and its MCU.

Your choice is **remembered**, and it is shared: picking a board here updates the
main window's mini board view too, and (in a wired project) records the board in
`robot.yml` so your saved wiring resolves against the same board it was drawn on.

The MCU chip badge next to the picker shows the selected board's microcontroller.

```{tip}
Don't see your board? Add it as a definition — see
[Add a board definition](add-board-definition). Boards are now authored as
Microcontroller-family parts in the Part Editor.
```

## Zoom, fit, 100%, and rotate

In the **Node graph** view a floating control cluster sits over the canvas:

| Control | Action |
| --- | --- |
| **−** / **+** | Zoom out / in one step, centred on the board. |
| **100%** | Toggle between actual size (1:1) and zoom-to-fit. When at 1:1 the button shows the current zoom percentage; click again to re-fit. |
| **Fit** (corner-bracket icon) | Frame the whole drawing in the window. |
| **Rotate** (circular-arrow icon) | Rotate the stage 90° clockwise. Labels stay upright (never upside-down). |
| **Export** | Save the view — see below. |

You can also:

- **Wheel-zoom** anywhere on the canvas — the point under the cursor stays put.
- **Drag** an empty area of the canvas to pan.

The view **auto-fits** until you first interact, so opening it (or switching
board) always frames the whole pinout. Zoom ranges from 20% to 400%.

The **Breadboard** and **Schematic** views have their own zoom toolbar with the
same **−/+**, **fit**, and **rotate** controls for arranging your parts.

```{figure} /_static/screenshots/board-view-controls.png
:alt: The node-graph canvas with the floating control cluster visible (zoom −, the 100%/fit toggle, +, fit, rotate, and the…
:width: 100%

The node-graph canvas with the floating control cluster visible (zoom −, the 100%/fit toggle, +, fit, rotate, and the export button with its format dropdown).
```

## Export SVG, PNG, or PDF

To save a picture of the board view:

1. Pick a format from the dropdown next to the **export** button: **SVG**,
   **PNG**, or **PDF**.
2. Click the **export** button (down-arrow). The file downloads immediately.

| Format | Notes |
| --- | --- |
| **SVG** | Vector — scales cleanly, best for embedding or editing. |
| **PNG** | High-resolution raster (rendered at your display's pixel ratio). |
| **PDF** | A single image-only page — a real, openable PDF, but the weakest of the three (no vector text). |

The export captures the full drawing at 1:1, independent of your current
pan/zoom. The Breadboard and Schematic views export the same three formats (and
can additionally export a BOM or pinout table — see
[Export a BOM & pinouts](export-bom-pinouts)).

## Show live pin values

In the **Node graph** view, a **LIVE** button sits in the title bar. It is an
opt-in toggle, **off by default**. Turn it on and, when a board is connected,
each node card shows the pin's current value polled from the device, and the LED
indicator lights.

```{warning}
Reading pins enters the raw REPL, which **interrupts a running program**. That is
why LIVE is off by default and must be turned on explicitly. When off, the Board
View never touches the device. When on, it polls gently (roughly once a second)
and falls back to idle placeholders whenever the board is busy or disconnected.
```

The LED indicator follows the connection: dim when off, lit (green) when reading
a connected board, amber while waiting for one. See
[Connect a device](connect-device) for getting a board attached.

PWM and ADC nodes also carry a launcher that opens the Oscilloscope or
Multimeter in the main window — see [Live instruments](device-instruments).

## Mini board view

The main window shows a compact **mini board view** above the instruments panel.
It draws only the microcontroller and the pads your code uses — a quick glance
without opening the full window. Its **expand** icon opens the full Board View
described here; the two always agree on the selected board.

## See also

- [Visualise your wiring](../tutorials/visualise-wiring) — a guided walkthrough.
- [How board pins are parsed](../explanation/board-pin-parsing) — what counts as a connection.
- [Add a board definition](add-board-definition) — get your board into the picker.
- [Boards & firmware reference](../reference/boards-and-firmware) — the built-in boards.
- [Keyboard shortcuts](../reference/keyboard-shortcuts).
