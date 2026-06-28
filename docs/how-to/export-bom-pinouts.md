# Export a BOM and pinouts

Turn the parts and wiring in your project into two portable **Markdown** documents
you can paste straight into a README or wiki:

- a **Bill of Materials (BOM)** — the microcontroller plus every placed part,
  grouped by type with quantities and the metadata from each part's `parts.yml`.
- a **pinouts table** — every wired connection, listed microcontroller-pin-first
  for wires that touch the board, with any part-to-part wires listed separately.

Both are generated from the project's `robot.yml` (the wiring you've laid out) and
the resolved [part definitions](../reference/parts-yml). They are plain Markdown
tables — no extra tooling required to read or render them.

## Before you start

You export from the **Board View**, working from the project that holds your
`robot.yml`. Make sure you have:

- A board selected in the Board View and at least one part placed and wired. See
  [Visualise wiring on a board](board-view) and [Build a robot](../tutorials/build-a-robot).
- The part libraries available so their metadata can be resolved — see
  [Install part drivers](install-part-drivers). Missing metadata simply renders as
  an em dash (`—`) in the table.

## Generate the documents

1. Open the **Board View**.
2. On the zoom toolbar, click the **Export** button (the down-arrow / download
   icon).
3. From the menu, choose:
   - **BOM (Markdown)** — to generate the Bill of Materials.
   - **Pinouts (Markdown)** — to generate the pinouts table.
4. Your browser/OS saves the file to your **Downloads** folder.

The same menu also offers **PNG image**, **SVG image** and **PDF document** for
exporting a picture of the board itself.

:::{admonition} Screenshot needed — `export-bom-pinouts-export-menu`
:class: screenshot
What to capture: The Board View zoom toolbar with the Export menu open, showing the PNG / SVG / PDF items, the separator, and the "BOM (Markdown)" and "Pinouts (Markdown)" items.
:::

## Output filenames

Each document is saved with a filename derived from the project name:

| Document        | Filename                |
| --------------- | ----------------------- |
| Bill of Materials | `<project>-bom.md`     |
| Pinouts table   | `<project>-pinouts.md`  |

`<project>` is your project name, lower-cased with non-word characters replaced by
dashes (for example `Line Follower` becomes `line-follower-bom.md`). If the project
has no name, the stem falls back to `board` (so `board-bom.md`).

## What the BOM contains

The Bill of Materials lists the **microcontroller first** (quantity 1), then every
placed part **grouped by type** with a count, sorted alphabetically by name. The
columns are:

| Column | Source |
| --- | --- |
| Qty | Number of instances of that part in the project |
| Part | The part's `name` |
| Description | The part's `description` |
| Manufacturer | The part's `manufacturer` |
| Family | The part's `family` (the microcontroller defaults to "Microcontroller") |
| Part # | The part's `partNumber` |

A generated BOM looks like this:

```markdown
# Line Follower — Bill of Materials

| Qty | Part | Description | Manufacturer | Family | Part # |
| --- | --- | --- | --- | --- | --- |
| 1 | Raspberry Pi Pico 2 W | ... | Raspberry Pi | Microcontroller | RP2350 |
| 2 | IR Line Sensor | ... | — | Sensor | — |
| 1 | Motor Driver | ... | Pimoroni | Driver | — |
```

```{note}
Empty metadata fields render as an em dash (`—`). Fill in `name`, `description`,
`manufacturer`, `family` and `partNumber` in each [`parts.yml`](../reference/parts-yml)
to get a complete BOM.
```

## What the pinouts table contains

The pinouts document has up to two sections.

**Board wires** — any connection that touches the microcontroller is listed
microcontroller-pin-first:

| Column | Meaning |
| --- | --- |
| MCU Pin | The board pad the wire lands on |
| Part | The connected part (its instance label, else its part name) |
| Part Pin | The pin on that part |
| Net | The connection's net, upper-cased (defaults to `SIGNAL`) |

Rows are sorted so numbered GPIO pins (`GP14`, `GPIO2`, `IO34`, or a bare `14`)
come first in numeric order, then named pins (`3V3`, `GND`, `A0`) alphabetically,
so power and ground rails don't interleave with the GPIOs.

**Other connections** — wires between two parts (where neither end is the board)
are listed under their own `## Other connections` heading, as `From` / `To` / `Net`.

```markdown
# Line Follower — Pinouts

| MCU Pin | Part | Part Pin | Net |
| --- | --- | --- | --- |
| GP0 | Motor Driver | IN1 | SIGNAL |
| GP2 | IR Line Sensor | OUT | SIGNAL |
| 3V3 | IR Line Sensor | VCC | POWER |

## Other connections

| From | To | Net |
| --- | --- | --- |
| IR Line Sensor.GND | Motor Driver.GND | GND |
```

## Empty projects

If there is nothing to document, the export still produces a valid Markdown file
with a placeholder line:

- A project with no parts: `_No parts in this project yet._`
- A project with no connections: `_No connections in this project yet._`

## See also

- [Visualise wiring on a board](board-view) — lay out and wire parts in the Board View.
- [The robot.yml reference](../reference/robot-yml) — the file the documents are generated from.
- [The parts.yml reference](../reference/parts-yml) — where the BOM metadata comes from.
- [Parts and boards model](../explanation/parts-and-boards-model) — how parts, boards and wiring fit together.
