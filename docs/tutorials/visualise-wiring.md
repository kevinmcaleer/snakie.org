# Visualise your wiring in the Board View

In this tutorial you'll write a few lines of MicroPython that use real pins, then
open Snakie's **Board View** and watch it draw your wiring for you — the actual
board you picked, every used pad highlighted, and a colour-coded node graph of
each connection by type. By the end you'll be able to switch boards, turn on
**LIVE** to read pin values from a connected board, and zoom, rotate, and export
the diagram.

**What you'll end up with:** a Python file open in the editor and a separate
Board View window showing your `Pin`, `PWM`, and `I2C` connections wired to the
correct pads on a Raspberry Pi Pico (or any board you choose), updating live as
you type.

**Before you start**

- Snakie installed and running. If you haven't done this yet, follow
  [Getting started](getting-started) first.
- A few minutes. You do **not** need a board plugged in for most of this — the
  Board View parses your *code*, not your hardware. You only need a connected
  board for the optional LIVE step (see [Connect a device](../how-to/connect-device)).

```{note}
The Board View reads your code with a best-effort parser, so it never runs your
program just to draw the picture. It looks for the common `machine` constructors —
`Pin`, `PWM`, `ADC`, `I2C`, `SPI`, and `StateMachine` — and draws a wire from each
pin those use to a labelled connection node.
```

## Step 1 — Write some code that uses pins

Create a new file (or open one you already have) and save it with a `.py`
extension. Paste in this small example — it wires up four different kinds of
connection so you'll see the full range of node types:

```python
from machine import Pin, PWM, I2C

led = Pin("LED", Pin.OUT)              # onboard LED  → OUTPUT
button = Pin(14, Pin.IN, Pin.PULL_UP)  # a push button → INPUT
buzzer = PWM(Pin(15))                  # a buzzer      → PWM
display = I2C(0, sda=Pin(0), scl=Pin(1))  # an I2C bus  → SDA + SCL
```

That's it — you don't have to run anything. The Board View will read this source
directly.

```{tip}
The connection type is inferred from how you use each pin. `Pin(..., Pin.OUT)` is
an **OUTPUT** and `Pin(..., Pin.IN)` is an **INPUT**. For a bare `Pin(15)` with no
direction, Snakie looks at how you use the variable later — a write call such as
`.on()`, `.off()`, `.toggle()`, or `.value(1)` makes it an **OUTPUT**; a bare
`.value()` read makes it an **INPUT**; if it can't tell, it defaults to OUTPUT.
```

## Step 2 — Open the Board View

The Board View opens in its own always-on-top window so you can keep it beside
your editor.

1. Find the **mini board preview** in the main editor (it shows the current board
   name and a small pinout).
2. Click its **open** button (the diagonal-arrow "open in new window" icon, with
   the tooltip *Open the full Board Viewer*).

The Board View window appears. Across the top you'll see the title **BOARD VIEW**,
a **view-type** switch, the **board picker**, the board's chip label, and a row of
controls including **LIVE**.

:::{admonition} Screenshot needed — `visualise-wiring-open-button`
:class: screenshot
What to capture: the main editor's mini board preview panel with the cursor over its "Open the full Board Viewer" diagonal-arrow button.
:::

## Step 3 — Switch to the Node graph view

If your project has a wiring file, the Board View can show three representations:
**Node graph**, **Breadboard**, and **Schematic**. For visualising the pins your
*code* uses, you want the node graph.

- Click the **Node graph** tab in the title bar.

```{note}
The Node-graph tab, the **LIVE** control, and the *Pins in use* table only appear
in the node-graph view. The Breadboard and Schematic tabs are for placing parts
and drawing wiring by hand — see [The Board View](../how-to/board-view) and
[Build a robot](build-a-robot) for those.
```

You should now see your code drawn as a graph:

- On the **left**, one dark **node card** per connection — each labelled with the
  variable name and a short type tag (`OUT`, `IN`, `PWM`, `ADC`, `I²C`, `SPI`,
  `PIO`).
- On the **right**, the **real board** for your selection, with its full pinout
  drawn at the true edge positions.
- A drooping coloured **noodle** wire runs from each node to the exact pad it uses.
  Pads that a connection lands on are highlighted; idle pads are still drawn so you
  can read the whole header.

Each connection type has its own colour, so the picture is easy to scan:

| Node tag | Connection | Colour |
| -------- | ---------- | ------ |
| `OUT` | a pin you drive (`Pin.OUT`, `.on()`, `.value(1)`, …) | gold |
| `IN` | a pin you read (`Pin.IN`, a bare `.value()`) | blue |
| `PWM` | a `PWM(Pin(...))` | orange |
| `ADC` | an `ADC(Pin(...))` analog input | teal |
| `I²C` | an `I2C(..., sda=, scl=)` bus | cyan |
| `SPI` | an `SPI(..., sck=, mosi=, …)` bus | purple |
| `PIO` | a `StateMachine(...)` with a `Pin` | pink |

For the example above you'll see four nodes: `led` (gold OUT) wired to the LED,
`button` (blue IN) on GP14, `buzzer` (orange PWM) on GP15, and `display` (cyan
I²C) wired to **two** pads — GP0 and GP1, labelled **SDA** and **SCL**.

```{figure} /_static/screenshots/visualise-wiring-node-graph.png
:alt: the Board View node-graph showing the four example nodes (led/button/buzzer/display) with coloured noodle wires reach…
:width: 100%

the Board View node-graph showing the four example nodes (led/button/buzzer/display) with coloured noodle wires reaching the Pico pads, including the I2C bus reaching two pads.
```

```{tip}
The view is **live**. Leave it open, go back to your editor, and add another line —
say `extra = Pin(16, Pin.OUT)` — and a new node appears the moment you type it. No
save or run required.
```

If you don't see a graph, check the message in the canvas:

- *"Open a Python (.py) file to visualise its pin wiring."* — the active file isn't
  Python. Switch to your `.py` file.
- *"No pins detected…"* — the file is Python but doesn't use any `machine`
  constructors yet. Add a `Pin(...)` and it'll appear.

## Step 4 — Switch boards in the picker

The wires target the **selected** board's real pinout, so picking the right board
matters.

1. Click the **board name** in the title bar to open the picker.
2. Choose a board — the built-ins include the **Raspberry Pi Pico 2 W**,
   **Pimoroni Pico Plus 2**, **Pimoroni Tiny 2040**, **Pimoroni Tiny 2350**, and
   **ESP32 DevKit**, plus any boards you've added yourself.

The whole pinout redraws and every wire re-targets the new board's pads. Your
choice is remembered, and the mini preview in the main editor follows along.

```{figure} /_static/screenshots/visualise-wiring-board-picker.png
:alt: the Board View board picker dropdown open in the title bar, listing the built-in boards with one highlighted.
:width: 100%

the Board View board picker dropdown open in the title bar, listing the built-in boards with one highlighted.
```

```{note}
Don't see your exact board? You can add one. See
[Add a board definition](../how-to/add-board-definition) to author a board, or
[How pins are matched to pads](../explanation/board-pin-parsing) for how Snakie
resolves a `Pin(15)` token to the right pad.
```

## Step 5 — Turn on LIVE to read pin values (optional)

So far everything is static analysis of your code. With a board connected, you can
also read the **actual** value of each pin.

1. Make sure a board is connected (see [Connect a device](../how-to/connect-device)).
2. Click the **LIVE** control in the title bar.

The LED beside the word LIVE lights **green** when it's reading a connected board.
Each node's readout now shows the pin's current value, refreshed a few times a
second.

```{warning}
Reading a pin uses the device's raw REPL, which **interrupts a running program**.
That's why LIVE is an explicit, off-by-default toggle — when it's off, the Board
View never touches your board. Turn LIVE off again when you're done so it doesn't
disturb your next Run.
```

If the LED stays **amber**, Snakie is waiting for a readable board (connecting, or
the port is busy). Click LIVE again to turn it off.

:::{admonition} Screenshot needed — `visualise-wiring-live-values`
:class: screenshot
What to capture: the node-graph with LIVE toggled on (green LED lit) and live pin values shown on the node cards for a connected board.
:::

```{tip}
A **PWM** node carries a small launcher that opens the **Oscilloscope**, and an
**ADC** node one that opens the **Multimeter**, in the main window — a quick way to
jump from a pin to its instrument. See [Live instruments](live-instruments).
```

## Step 6 — Zoom, rotate, and export

The graph lives inside a pan-and-zoom viewport with a floating control cluster
(bottom of the canvas). Use it to frame and share your diagram.

- **Zoom** with the **−** / **+** buttons, or scroll the mouse wheel to zoom where
  you point. **Drag** an empty part of the canvas to pan.
- The **percent** button toggles between **actual size (100%)** and **zoom to fit**;
  the **fit** (frame) button always re-fits the whole drawing.
- **Rotate** turns the board 90° clockwise each click — handy when your real board
  sits sideways on the bench. Labels stay upright so they're always readable.
- **Export** saves the diagram. Pick a format in the dropdown — **SVG**, **PNG**,
  or **PDF** — then click the export (download) button to save the file.

```{tip}
Export an **SVG** for a crisp, scalable diagram to drop into documentation or a
wiki, or a **PDF** to print a wiring sheet for the bench.
```

## What you've learned

You wrote pin-using MicroPython and saw Snakie draw it for you: a node graph of
every connection by type, wired to the real pads of the board you chose. You
switched boards, read live values from a connected device, and zoomed, rotated,
and exported the picture.

**Where to go next**

- [Build a robot](build-a-robot) — place parts and wire them up in the Breadboard
  and Schematic views, saved to a `robot.yml` project.
- [Live instruments](live-instruments) — feed the Oscilloscope, Multimeter, and
  Plotter from a running program.
- [The Board View](../how-to/board-view) — the full how-to reference for every
  Board View control.
- [How pins are matched to pads](../explanation/board-pin-parsing) — the design
  behind the parser and pad resolution.
