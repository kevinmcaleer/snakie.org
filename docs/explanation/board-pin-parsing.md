# How the Board View understands your code

The [Board View](../how-to/board-view) doesn't run your program to find out which
pins it uses — it **reads the source statically**. This page explains how it turns
code into a drawn, wired board.

## From code to connections

A parser scans the active Python file for the patterns that claim a pin —
`Pin(...)`, `PWM(...)`, `I2C(...)`, `SPI(...)`, `ADC(...)`, `StateMachine(...)`
and friends — and produces a list of **connections**. Each connection records:

- the **pin token(s)** it uses (e.g. `GP4`, or an SDA/SCL pair for a bus);
- a **type** (input, output, PWM, I²C, SPI, PIO, ADC, …), which drives its colour
  and its node-card tag;
- the **variable name** it was assigned to, so the board can label the pad with
  *your* name for it;
- for buses, the **bus number** and each pin's **role** (SDA/SCL, SCK/MOSI/…).

Because it's parsed, the view updates **live** as you type — no need to run anything.

## From connections to pads

Each pin token is resolved against the selected board's pad list to a real
**pad coordinate**. A board defines its pads once, in a canonical order, and that
same order is the identity used everywhere (the node graph, the wiring endpoints
in `robot.yml`, the schematic symbol), so a token always lands on the same
physical pad in every view.

How the pads are *positioned* depends on the board:

- An **authored board** (a Parts-Library microcontroller part) carries each pad's
  real `x`/`y`, so the board is drawn as its true life-like body via the shared
  `PartBody` renderer — identical to the Part Editor and the mini board preview.
- A **built-in board** with no positioned pads falls back to laying pads evenly
  along each header's edge.

A single shared helper computes pad positions for both the mini board view and the
node graph, so the two can never drift apart.

## Drawing it

The node graph draws one **node card** per connection on the left, the board on
the right, and a drooping "noodle" wire from each card to its pad. Pads your code
uses are highlighted; idle pads stay drawn so the full pinout reads. The Breadboard
and Schematic views instead place the parts from `robot.yml` and route real wires
between them.

## Further reading

- [The parts and boards model](parts-and-boards-model) — why boards are parts.
- [robot.yml schema](../reference/robot-yml) — the wiring data model.
