# Build a wired-up project

In this tutorial you will place a real hardware part next to your microcontroller,
draw the wires between their pins, and watch Snakie save the whole layout to a
human-readable `robot.yml` beside your code. You will then flip the same project
into a schematic and export a parts list and a pinout table you can paste into a
README.

By the end you will have:

- a microcontroller and one part (a sensor) on the **Breadboard** canvas,
- a few coloured wires connecting their pins,
- a `robot.yml` file that records exactly what you drew,
- the same wiring shown as an auto-routed **Schematic**, and
- a **BOM** and **Pinouts** Markdown document for the project.

This page is about *documenting and visualising* your build. It does not flash
firmware or run code — see [Run & stop](../how-to/run-and-stop) for that.

## Before you start

```{important}
This tutorial uses the Board View's wiring canvas, which lives in its own window.
If you have not opened it before, skim [Visualise your wiring](visualise-wiring)
first — it covers opening the Board View and picking a board.
```

You will need:

- **A project folder open** in Snakie's file browser. The `robot.yml` Snakie
  writes lands in that folder, so it version-controls next to your code. (With no
  folder open Snakie still works, but it falls back to a per-user location.)
- **At least one parts library installed.** Snakie ships a local **My Parts**
  library and you can install community libraries from the Parts view. If you have
  none yet, follow [Author a part](author-a-part) to make one, or open the Parts
  view and use **Add library**. The schema is documented in
  [parts.yml reference](../reference/parts-yml).
- **A microcontroller to target**, such as the Raspberry Pi Pico 2 W. Any
  built-in board works, as does one you have authored — see
  [Add a board definition](../how-to/add-board-definition).

## 1. Open the Board View and switch to Breadboard

1. In the main editor toolbar, click the **board** button. The Board View opens
   as its own always-on-top window.
2. At the top-left of that window you will see three view-type tabs:
   **Node graph**, **Breadboard**, and **Schematic**. The window opens on
   **Breadboard** by default — if it is on another tab, click **Breadboard**.
3. Use the **board selector** in the title bar to choose your microcontroller
   (for example *Raspberry Pi Pico 2 W*). It is drawn as its real PCB, with every
   pad shown as a connectable dot. Your choice is remembered.

```{note}
The **Node graph** tab is the live, code-parsed view of which pins your *program*
uses. **Breadboard** and **Schematic** are the two wiring views: they put the
board and your parts on one canvas so you can draw connections by hand. All three
also highlight the board pins your open `.py` file drives, so the pins your code
uses and the parts you wire appear together.
```

```{figure} /_static/screenshots/build-a-robot-breadboard-empty.png
:alt: The Board View window on the **Breadboard** tab with a Raspberry Pi Pico 2 W selected and no parts placed yet, showin…
:width: 100%

The Board View window on the **Breadboard** tab with a Raspberry Pi Pico 2 W selected and no parts placed yet, showing the three view-type tabs at top-left and the empty dark canvas.
```

## 2. Open the parts library dock

The parts you place come from the library dock on the **right** edge of the
canvas.

1. If the dock is collapsed, click the **Library** tab on the right edge to open
   it.
2. Browse your installed libraries, or use the search box to find a part across
   every library. For this tutorial pick a sensor — a distance sensor such as the
   **VL53L0X ToF** is a good first choice.
3. Click the part to open its detail view. You will see its footprint, its pinout,
   and the catalogue metadata (manufacturer, family, part number, and so on).

```{tip}
You can collapse the dock with the **›** button in its header to give the canvas
the whole window, then reopen it from the **Library** tab. The same dock is the
full Parts Library — see [Install part drivers](../how-to/install-part-drivers)
and [Author a part](author-a-part) for managing what appears here.
```

## 3. Place the part on the canvas

1. With your sensor's detail open in the dock, click **+ Add to project**.
2. The part appears on the canvas next to the board, drawn with its real
   footprint, every pin a connectable dot.
3. Snakie immediately writes it to `robot.yml` as a placed part with a unique
   instance id (for example `vl53l0x1`).

Arrange the canvas to taste:

- **Move** a component by dragging its body. The new position is saved when you
  drop it.
- **Pan** the canvas by dragging empty space, and **zoom** with the scroll wheel.
- Click the **Fit** (zoom-to-fit) button on the zoom toolbar to reframe
  everything. The canvas also auto-fits whenever you switch view, change board, or
  add a part.

Click the placed part once to select it. A small toolbar appears above it with
buttons to **rotate 90°**, **rename** (a display-only label), **duplicate**, and
**delete from breadboard**. Renaming only changes the label shown on the canvas;
it does not alter the part itself.

:::{admonition} Screenshot needed — `build-a-robot-part-placed`
:class: screenshot
What to capture: The Breadboard canvas with the Pico on the left and a VL53L0X sensor placed to its right, the sensor selected so its rotate/rename/duplicate/delete mini-toolbar is visible, and the Library dock open on the right.
:::

## 4. Wire pins together

Now connect the sensor to the microcontroller. A hint at the bottom of the canvas
reminds you: **"Drag from a pin to another pin to wire them."**

1. Press on the sensor's **VIN** pin dot and drag to a power pad on the board
   (for example **3V3**). Release on the pad to create the wire.
2. Drag the sensor's **GND** pin to a board **GND** pad.
3. Drag **SDA** to a GPIO such as **GP4**, and **SCL** to **GP5**.

```{tip}
Hover a part pin in the Breadboard view to see its capability badges (for example
`i2c`, `digital`) so you pick a compatible pad. The grab radius around each dot
stays roughly constant on screen, so dense footprints are still easy to hit.
```

Wires are coloured by what they carry, against the dark canvas:

| Wire     | Colour                                   |
| -------- | ---------------------------------------- |
| Power    | red (a `pwr`/`vcc` pin at either end)    |
| Ground   | white                                    |
| Signal   | a distinct palette colour per wire       |

Each wire in Breadboard is drawn as a rounded **noodle** that curves cleanly out
of the pad and auto-routes around the parts in the way.

:::{admonition} Screenshot needed — `build-a-robot-wired-noodles`
:class: screenshot
What to capture: The Breadboard canvas with a red VIN→3V3 wire, a white GND→GND wire, and two coloured signal noodles (SDA→GP4, SCL→GP5) running between the sensor and the Pico.
:::

## 5. Watch it save to robot.yml

Every change — placing a part, moving it, drawing or deleting a wire — is written
straight to `robot.yml` in your open project folder. You do not need to press
save.

Open `robot.yml` in the editor and you will see something like:

```yaml
name: Distance Demo
board: pico2w
parts:
  - id: vl53l0x1
    lib: snakie-basics
    part: vl53l0x
    label: Distance
    x: 320
    y: 30
connections:
  - id: vl53l0x1.SDA__board.GP4
    from: vl53l0x1.SDA
    to: board.GP4
    net: signal
    color: '#4ea1ff'
```

Wire endpoints are written as `"<partId>.<PinName>"`, or `"board.<PinName>"` for
the microcontroller. The `net` (`vcc` / `gnd` / `signal`) is what drives the wire
colour. Because the file is plain YAML next to your code, it diffs cleanly and
version-controls with everything else — see
[Version control](../how-to/version-control).

```{note}
Beneath the canvas is the **connections table**: one row per wire, showing
*from · to · net · colour*, with a colour swatch you can change and a button to
delete the wire. It is the same data that lives in `robot.yml`.
```

For the full file format, see the [robot.yml reference](../reference/robot-yml).

## 6. Flip to the Schematic view

Click the **Schematic** tab at the top-left.

The exact same connections are redrawn as a proper schematic:

- the microcontroller becomes a generic **IC block** with **power on top**, a
  **single combined GND at the bottom**, and signals on the sides;
- each part is drawn as its schematic symbol;
- wires become **orthogonal** (right-angle) runs, **auto-routed** around the
  symbols.

Switching between Breadboard and Schematic never breaks a wire — pin identity is
fixed, so your connections survive the change of representation. Try toggling back
and forth.

:::{admonition} Screenshot needed — `build-a-robot-schematic`
:class: screenshot
What to capture: The Schematic tab showing the Pico as an IC block with power on top and a single GND at the bottom, the VL53L0X symbol, and orthogonal right-angle wires routed between them.
:::

## 7. Export a BOM and pinout

Your drawn project can now become portable documentation.

1. On the zoom toolbar, open the **Export** menu (the download icon).
2. Choose **BOM (Markdown)** to save a Bill of Materials. The microcontroller is
   listed first, then every placed part grouped by type with a quantity, filled
   from each part's metadata. It saves as `<project>-bom.md`.
3. Choose **Pinouts (Markdown)** to save a pin-assignment table. Wires that touch
   the board become MCU-pin-first rows; any part-to-part wires follow under an
   *Other connections* table. It saves as `<project>-pinouts.md`.

The same menu also exports the canvas drawing itself as **PNG**, **SVG**, or
**PDF**. Both Markdown documents are generated purely from `robot.yml` plus the
resolved library parts, so they always match what is on the canvas.

For more on these outputs, see [Export BOM & pinouts](../how-to/export-bom-pinouts).

## What you built

You placed a part, wired it to a microcontroller, and Snakie captured the whole
layout in a `robot.yml` you can commit. You saw the same wiring as both a
breadboard and a schematic, and exported a parts list and pinout for your docs.

## Where to go next

- [Author a part](author-a-part) — design your own sensor or board so it appears
  in the library dock.
- [Board View](../how-to/board-view) — every control on the canvas in one place.
- [robot.yml reference](../reference/robot-yml) and
  [parts.yml reference](../reference/parts-yml) — the file formats behind this view.
- [Parts and boards model](../explanation/parts-and-boards-model) — how parts,
  boards and projects fit together.
