# robot.yml schema

`robot.yml` is the **robot definition file**: the structured project spec that
records the microcontroller you chose, the parts placed on the wiring canvas, and
the pin-to-pin wires between them. It is the data the [Board View](../how-to/board-view)
Breadboard and Schematic views read and write, and the source for the generated
[BOM and pinout documents](../how-to/export-bom-pinouts).

The file is human-readable YAML and version-controls cleanly. See
[Parts & boards model](../explanation/parts-and-boards-model) for how it relates
to the parts library, and [robot.yml authoring](../tutorials/build-a-robot) for a
walkthrough.

## File location

| Condition | Path |
| --- | --- |
| A project folder is open | `robot.yml` in that folder (next to your code) |
| No folder open | `<userData>/robot.yml` (per-OS app data) |

There is one `robot.yml` per project folder.

## Top-level fields

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `name` | string | no | Project name. |
| `description` | string | no | Free-text project / robot description. |
| `board` | string | no | The microcontroller [board id](boards-and-firmware) (built-in or user board, e.g. `pico2w`). |
| `boardX` | number | no | Canvas X of the MCU box, in viewBox units. |
| `boardY` | number | no | Canvas Y of the MCU box, in viewBox units. |
| `parts` | list | yes | Placed part instances (may be empty `[]`). |
| `connections` | list | yes | Pin-to-pin wires (may be empty `[]`). |

```{note}
On **save**, empty string fields and `parts`/`connections` are written as empty
lists. On **load** the parser is tolerant: unknown or malformed entries are
dropped rather than raising an error, and a structurally-odd document yields empty
`parts`/`connections`.
```

## `parts[]` — placed part instances

Each entry is one instance of a [library part](parts-yml) dropped onto the canvas.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | yes | Unique instance id within the project (e.g. `dist1`). Wire endpoints reference it as `<id>.<Pin>`. |
| `lib` | string | yes | The library (folder id) the part comes from. |
| `part` | string | yes | The part id within that library. |
| `label` | string | no | Human label shown on the canvas. Defaults to the part name. |
| `x` | number | no | Canvas X of the box's top-left, in viewBox units. |
| `y` | number | no | Canvas Y of the box's top-left, in viewBox units. |
| `rotation` | number | no | Clockwise rotation in degrees. One of `0`, `90`, `180`, `270`. |

```{note}
`rotation` is snapped to the nearest multiple of 90 and normalised to the
`0–270` range on load and save; a value of `0` is omitted from the file.
```

A part entry missing `id`, `lib`, or `part` is discarded when the file is loaded.

```yaml
parts:
  - id: dist1            # unique instance id; wires reference "dist1.<Pin>"
    lib: snakie-basics   # the library it came from
    part: vl53l0x        # the part id within that library
    label: Distance      # optional; defaults to the part name
    x: 320
    y: 30
    rotation: 90         # optional; 0/90/180/270
```

## `connections[]` — wires

Each entry is one wire between two pins.

| Field | Type | Required | Notes |
| --- | --- | --- | --- |
| `id` | string | no | Stable wire id. Defaults to `<from>__<to>` if omitted. |
| `from` | string | yes | Start [endpoint token](#endpoint-token-format). |
| `to` | string | yes | End endpoint token. |
| `net` | string | no | Electrical net: `vcc`, `gnd`, or `signal`. Drives the default colour. |
| `color` | string | no | Explicit colour override (any CSS colour). Falls back to the net colour. |

A connection missing `from` or `to` is discarded on load. A `net` value that is
not one of the three allowed values is dropped.

```yaml
connections:
  - id: board.GP4#5__dist1.SDA#3
    from: board.GP4#5    # endpoint token (see below)
    to: dist1.SDA#3
    net: signal          # vcc | gnd | signal
    color: '#4ea1ff'     # optional explicit colour
```

(endpoint-token-format)=
## Endpoint token format

An endpoint identifies a single pin. Its form is:

```
<key>.<PIN>#<index>
```

| Part | Meaning |
| --- | --- |
| `<key>` | The subject: the literal `board` for the microcontroller, or a part instance `id` from `parts[]`. Parsed as everything **before the first dot**. |
| `<PIN>` | The pin name (e.g. `GP4`, `SDA`, `VCC`, `GND`). Parsed as everything between the first dot and the `#`. |
| `#<index>` | The flattened-header pin index — an internal disambiguator that uniquely identifies the physical pad even when a name repeats (e.g. multiple `GND` pads). Parsed as everything after the **last** `#`. |

Examples:

| Token | Subject | Pin | Index |
| --- | --- | --- | --- |
| `board.GP4#5` | `board` (the MCU) | `GP4` | 5 |
| `board.GND#22` | `board` | `GND` | 22 |
| `dist1.SDA#3` | part instance `dist1` | `SDA` | 3 |
| `mx1508.OUT1#6` | part instance `mx1508` | `OUT1` | 6 |

```{important}
The `#index` is the **fixed flattened-header index**, which is why a wire survives
toggling between the Breadboard and Schematic representations — pin identity is the
index, not the visual position. The generated docs strip `#index` for display.
```

```{note}
When Snakie creates a wire it writes the full `key.PIN#index` form. A hand-edited
file may use the shorter `key.PIN` form (no `#index`); the parser tolerates it,
but the index is needed to disambiguate repeated pin names such as multiple
grounds.
```

## Net colours

When a connection has no explicit `color`, the wire colour is derived from `net`:

| `net` | Colour |
| --- | --- |
| `vcc` | Red (`#c0392b`) |
| `gnd` | Black on a light background, white on a dark background |
| `signal` | A distinct palette colour assigned round-robin; neutral grey as a fallback |

The signal palette (assigned in order as signal wires are created):

```
#4ea1ff  #46e06a  #d6a531  #b06af0  #ef6f9b  #3ec8c8  #e8843c  #8a9bff
```

An explicit `color` always wins over the net colour.

## Complete example

```yaml
name: Bugerbot
board: raspberry-pi-pico
boardX: 3.4087
boardY: 4.5043
parts:
  - id: mx1508
    lib: my-parts
    part: mx1508
    label: MX1508
    x: 260.0681
    y: 13.6422
  - id: n20-motor
    lib: my-parts
    part: n20-motor
    label: Left Motor
    x: 541.4440
    y: -66.3206
    rotation: 90
  - id: hr-sr04
    lib: my-parts
    part: hr-sr04
    label: HR SR04
    x: -51.1925
    y: -223.6679
connections:
  - id: board.VBUS#20__mx1508.VCC#0
    from: board.VBUS#20
    to: mx1508.VCC#0
    net: vcc
  - id: board.GND#22__mx1508.GND#1
    from: board.GND#22
    to: mx1508.GND#1
    net: gnd
  - id: board.GP0#0__mx1508.IN1#2
    from: board.GP0#0
    to: mx1508.IN1#2
    net: signal
    color: '#4ea1ff'
  - id: mx1508.OUT1#6__n20-motor.GND#1
    from: mx1508.OUT1#6
    to: n20-motor.GND#1
    net: gnd
```

:::{admonition} Screenshot needed — `robot-yml-connections-table`
:class: screenshot
What to capture: the Board View connections table beneath the canvas, showing the from/to/net/colour columns and the colour swatch for one signal wire — the same data that lives in `connections[]`.
:::

## See also

- [Use the Board View](../how-to/board-view) — author wiring that writes this file.
- [Export BOM & pinouts](../how-to/export-bom-pinouts) — documents generated from `robot.yml`.
- [parts.yml schema](parts-yml) — the part definitions referenced by `lib`/`part`.
- [Boards & firmware reference](boards-and-firmware) — valid `board` ids.
- [Parts & boards model](../explanation/parts-and-boards-model) — how parts, boards, and wiring fit together.
</content>
</invoke>
