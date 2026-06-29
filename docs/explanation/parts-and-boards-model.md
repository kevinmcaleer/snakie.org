# The parts and boards model

Snakie's hardware features — the Parts Library, the Part Editor, and all three
Board View modes — sit on one small idea: **everything is a part**, described by a
portable `parts.yml`.

## A part is a folder

A part is a directory containing a human-readable [`parts.yml`](../reference/parts-yml)
(plus an optional board image and driver files). The YAML records the metadata
(name, manufacturer, family, part number, dimensions), the **pins** (with their
type, capabilities, pad shape and real positions), **mounting holes**, decorative
**shapes** and **text labels**, and optional **drivers** and a linked MicroPython
**library**. Because it's plain text in a folder, a part is easy to read,
diff, share, and version.

Parts are organised into **libraries**, and libraries can be installed and updated
from a community **registry** — so a part someone else authored drops straight
into your editor.

## A board is just a part

There is no separate "board" format. A microcontroller is simply a part in the
**Microcontroller** family. That has a few nice consequences:

- You **author a board in the same Part Editor** you use for any other part —
  there's no separate Board Creator to learn.
- The board you place on the wiring canvas is the *same* definition the
  [pin parser](board-pin-parsing) resolves your code against, so the picture and
  the wiring identities can't disagree.
- A board can carry its own life-like artwork (a board photo + pads at their real
  positions), which is why the node graph, the Breadboard view, the mini board
  preview and the Part Editor all show *the same* board.

## One renderer, everywhere

A single component, `PartBody`, draws a part's life-like scene — the PCB outline,
the board image clipped to it, holes cut through, the pads by shape, and the
component shapes and labels. Every surface that shows a part uses it, so a part
(or board) looks **exactly as authored** whether you're in the Part Editor, the
mini board view, or the full Board View. (Sizing is shared too, so even fixed-size
details like castellated pads read identically across views.)

## How it all connects

When you place parts and wire them, the result is saved to a project
[`robot.yml`](../reference/robot-yml): which board, which parts (and where), and
the pin-to-pin connections. That file is what the Breadboard and Schematic views
read and write, and the source for the generated
[BOM and pinouts](../how-to/export-bom-pinouts).
