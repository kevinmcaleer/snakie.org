# parts.yml schema

A **part** is one hardware component — a microcontroller board, a sensor breakout,
a motor driver — stored as a single human-readable `parts.yml` file inside the
part's own folder, alongside any image asset. This page documents every field of
that file.

```
<userData>/parts/<libraryId>/<partId>/parts.yml   # + image.png|jpg|svg
```

You rarely hand-write this file: the [Part Editor](../tutorials/author-a-part)
authors it visually. It is still plain YAML, so it round-trips through hand
editing. For the storage layout and the community registry, see
[Install part drivers](../how-to/install-part-drivers) and the
[parts & boards model](../explanation/parts-and-boards-model).

```{note}
The on-disk shape is defined by `src/shared/part.ts` and (de)serialised by
`src/shared/part-yaml.ts`. The parser is **tolerant on read** (it coerces and
defaults dodgy fields, lowercases capabilities, and skips entries it can't make
sense of) and **tidy on write** (it drops empty/`undefined` fields and never
writes the runtime-only inlined image blob).
```

## Required fields

Only three things are required for a part to be usable:

Field | Type | Notes
----- | ---- | -----
`id` | string | Unique within its library; also the part's folder name.
`name` | string | Display name. Defaults to `id`, then `"Untitled Part"`, if absent.
`headers` | list | At least one [header](#headers) carrying at least one [pin](#pin-fields).

Everything else is optional. A malformed `parts.yml` is skipped on load; it
will not stop the rest of the library loading.

## Catalogue metadata (header)

The top block is the catalogue metadata shown in the Parts Library panel and the
part's detail card.

`id`
: Unique id within the library; the folder name. Required.

`name`
: Display name (e.g. `"Raspberry Pi Pico 2 W"`). Required.

`description`
: One-line / short description.

`manufacturer`
: Manufacturer (e.g. `"Raspberry Pi"`, `"Pimoroni"`).

`family`
: Family / category (e.g. `"Microcontroller"`, `"Sensor"`, `"Motor Driver"`).

`tags`
: List of free-text strings for search/filter (e.g. `[rp2350, wifi]`). Blank
  entries are dropped on load.

`package`
: How the part mounts. One of `THT` (through-hole) or `SMD` (surface-mount). Any
  other value is ignored.

`pinSpacing`
: Header pitch in millimetres. The 0.1" header standard is `2.54`, which is also
  the grid-snap default in the editor.

`voltage`
: Operating voltage, free text (e.g. `"3.3V"`, `"2.8–5V"`).

`partNumber`
: Manufacturer part number (e.g. `"SC0918"`).

`properties`
: A map of arbitrary user-defined key/value spec rows. Values are coerced to
  strings; rows with empty values are dropped.

  ```yaml
  properties:
    range: 2m
    interface: I²C
  ```

`version`
: Semantic version (`MAJOR.MINOR.PATCH`) of **this part**. Drives update checks
  against the community registry.

## Geometry and rendering

These fields control the drawn footprint and life-like representation.

`mcu`
: MCU sub-label, when the part is a board (e.g. `"RP2350"`).

`pcbColor`
: PCB fill colour — any CSS colour (e.g. `"#0f5a2e"`).

`aspect`
: Outline width ÷ height. Drives the drawn proportions of the rounded-rectangle
  outline.

`dimensions`
: Physical board size in millimetres. Informational plus footprint scale. Both
  sub-fields are required for the object to load.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `width` | number | Width in mm.
  `height` | number | Height in mm.

`polygon`
: Physical board outline as a list of normalised `0..1` points (`{x, y}`),
  `0,0` = top-left. Used when [`shape.kind`](#shape) is `polygon`. Requires at
  least 3 valid points; fewer ⇒ ignored. Absent ⇒ a rounded rectangle of
  `aspect` is drawn.

  ```yaml
  polygon:
    - { x: 0, y: 0 }
    - { x: 1, y: 0 }
    - { x: 1, y: 1 }
    - { x: 0, y: 1 }
  ```

(shape)=
`shape`
: The board outline kind. Absent ⇒ a plain rounded rectangle.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `kind` | `rect` \| `polygon` | `rect` (default) uses `aspect`; `polygon` uses [`polygon`](#geometry-and-rendering). Any value other than `polygon` becomes `rect`.
  `cornerRadius` | number | Corner radius for `rect`, normalised to the smaller board side (`0..0.5`).

## Headers & pins

(headers)=
`headers`
: A list of headers. Each header is a run of pins laid evenly along one edge of
  the board, in array order. A header with no valid pins is dropped.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `edge` | `left` \| `right` \| `top` \| `bottom` | Which edge the pins sit on. `left`/`right` ⇒ vertical; `top`/`bottom` ⇒ horizontal. An unrecognised value becomes `left`.
  `pins` | list | The [pins](#pin-fields), spaced evenly along the edge.

(pin-fields)=
### Pin fields

A pin needs a name; everything else is optional. `gpio` and `capabilities` are
only meaningful on `io` pins and are dropped from non-`io` pins on load.

Field | Type | Notes
----- | ---- | -----
`name` | string | GPIO / signal name (`GP0`, `SDA`, `VBUS`). The primary label. **Required** (falls back to `label`; a pin with neither is dropped).
`type` | `pwr` \| `gnd` \| `io` \| `other` | Electrical role. Unrecognised ⇒ `io`. `pwr` = power, `gnd` = ground, `io` = GPIO, `other` = non-GPIO signal (RUN, EN, …).
`number` | number | Physical board pin number (1-based silk numbering), if the part prints one.
`gpio` | number | GPIO number this pin breaks out — matched against `Pin(n)` when rendered. `io` pins only.
`capabilities` | list | What an `io` pin supports: any of `digital`, `pwm`, `adc`, `spi`, `i2c`, `uart`. Lowercased on load; unknown values dropped. `io` pins only.
`label` | string | Alternate silk text, when the printed label differs from `name`. Dropped if equal to `name`.
`castellated` | boolean | Legacy flag for a castellated edge pad (vs a regular header hole). Superseded by `shape: castellated`; still read for compatibility.
`shape` | `square` \| `round` \| `castellated` \| `header` | How the pad is drawn. `square` = solid square SMD pad (default), `round` = solid round pad, `castellated` = plated half-moon edge pad, `header` = through-hole annular ring with the drill hole showing.
`rotation` | number | Castellation outward direction in degrees: `0` = right, `90` = down, `180` = left, `270` = up. Absent ⇒ derived from the pin's side. Only affects `castellated` pads.
`x`, `y` | number | Absolute position on the board canvas, normalised `0..1` (`0,0` = top-left). The Part Editor uses free placement, so this is the source of truth for where the pad is drawn. Legacy edge-based headers with no position are migrated from their edge + order on load.

## Holes, buttons & decorations

`mountingHoles`
: List of mounting holes positioned within the outline. An entry missing `x` or
  `y` is dropped; a missing `diameter` defaults to `2`.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `x` | number | Normalised X within the outline (`0` = left, `1` = right). Required.
  `y` | number | Normalised Y within the outline (`0` = top, `1` = bottom). Required.
  `diameter` | number | Hole diameter in mm (e.g. `2.0` for M2, `3.0` for M3). Defaults to `2`.

`buttons`
: List of push-buttons. An entry missing `x` or `y` is dropped.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `label` | string | Silk label (e.g. `"BOOT"`, `"RESET"`). Defaults to empty.
  `x`, `y` | number | Normalised position within the outline. Required.

`ledLabel`
: Onboard-LED pin token — a pin name or GPIO number (e.g. `"LED"` or `"25"`).

`features`
: Legacy decorative components drawn as labelled rounded rects. The Part Editor
  migrates these into [`shapes`](#components-shapes) for editing. Each entry
  requires `x`, `y`, `w`, `h`.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `label` | string | Silk text on the feature (e.g. `"RP2350"`, `"USB-C"`).
  `kind` | `mcu` \| `wifi` \| `usb` \| `chip` \| `led` | Visual style. Unrecognised ⇒ `chip`.
  `x`, `y` | number | Normalised top-left within the outline. Required.
  `w`, `h` | number | Normalised size. Required.

(components-shapes)=
### shapes — component shapes

`shapes`
: The Components layer: coloured rectangles, circles and polygons drawn on the
  board. Positions/sizes are normalised `0..1`. An entry missing `x` or `y` is
  dropped.

  Field | Type | Notes
  ----- | ---- | -----
  `kind` | `rect` \| `circle` \| `polygon` | Shape kind. Unrecognised ⇒ `rect`.
  `x`, `y` | number | Top-left (`rect`) / centre (`circle`) / bounding ref (`polygon`), normalised. Required.
  `w`, `h` | number | Size for `rect`.
  `r` | number | Radius for `circle`, as a fraction of board width.
  `points` | list | Vertices (`{x, y}`, normalised) for `polygon`. Requires ≥ 3.
  `label` | string | Optional caption drawn centred on the shape.
  `fill` | string | Fill colour (any CSS colour).
  `stroke` | string | Outline colour.
  `strokeWidth` | number | Outline width in canvas (viewBox) units.
  `cornerRadius` | number | Corner radius in viewBox units for `rect`; `0` = sharp. Absent ⇒ legacy default `3`. Clamped to ≥ 0.
  `rotation` | number | Clockwise degrees about the centre; snapped to `0/90/180/270`.
  `z` | number | Draw order within the Components layer; higher = on top. Absent ⇒ array index (below labels).
  `labelFontSize` | number | Caption font size in viewBox units.
  `labelBold` | boolean | Bold caption.
  `labelItalic` | boolean | Italic caption.
  `labelUnderline` | boolean | Underlined caption.
  `labelAlign` | `left` \| `center` \| `right` | Caption alignment.
  `labelWrap` | boolean | Wrap the caption to the shape's width.
  `labelColor` | string | Caption colour (any CSS colour).

(labels)=
### labels — text labels

`labels`
: Free-floating text labels placed on the board canvas. An entry missing `text`,
  `x`, or `y` is dropped.

  Field | Type | Notes
  ----- | ---- | -----
  `text` | string | The label text. Required.
  `x`, `y` | number | Normalised `0..1` position. Required.
  `fontSize` | number | Font size in SVG user units (the canvas viewBox is ~420 wide).
  `z` | number | Draw order within the Components layer (see [`shapes.z`](#components-shapes)).
  `rotation` | number | Clockwise degrees; snapped to `0/90/180/270`.
  `bold` | boolean | Bold text.
  `italic` | boolean | Italic text.
  `underline` | boolean | Underlined text.
  `align` | `left` \| `center` \| `right` | Horizontal alignment; default `center`.
  `color` | string | Text colour (any CSS colour); defaults to the theme text colour.

## Image asset

`image`
: Relative filename of the board image within the part folder (e.g.
  `"image.png"`). This is what is written to disk and committed; it stays small
  and diff-friendly because the pixels live in the separate file.

`imageData`
: **Runtime only — never written to `parts.yml`.** The main process inlines the
  image as a self-contained data URL (`data:image/png;base64,…`) when it reads
  the part, so the renderer can draw it without filesystem access. Listed here
  only so you know it exists in memory; do not author it.

`imageLayer`
: Where the image sits on the board canvas as its own layer, normalised `0..1`.
  Absent ⇒ the image covers the whole board box (legacy "fit" behaviour).
  Requires `x`, `y`, `w`, `h` to load.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `x`, `y` | number | Normalised top-left of the image relative to the board box. Required.
  `w`, `h` | number | Normalised size. Required.
  `opacity` | number | Layer opacity `0..1` (default `1`).
  `rotation` | number | Rotation in degrees (default `0`).

## Schematic symbol

`schematic`
: An optional schematic symbol — a labelled box with pin terminals. Loads only
  if it has at least one pin.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `aspect` | number | Symbol box aspect (w/h); sensible default when absent.
  `pins` | list | The terminals, each linked to a physical pin by name.

  Each `schematic.pins` entry:

  Field | Type | Notes
  ----- | ---- | -----
  `pin` | string | The physical pin this terminal maps to, by `name`. Required.
  `side` | `left` \| `right` \| `top` \| `bottom` | Which side of the symbol box the terminal sticks out of. Unrecognised ⇒ `left`.
  `order` | number | Order along that side (0-based, top→bottom / left→right). Defaults to `0`.

## Code library link

`library`
: A MicroPython library/module linked to the part (so Snakie can offer to install
  the driver and check the project's imports). Loads if any sub-field is present.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `module` | string | The import/module name the code uses (e.g. `"vl53l0x"`).
  `url` | string | Where to install it from — a `mip` spec, package name, or git/file URL.
  `docs` | string | URL of the library's docs / README.

## Drivers

`drivers`
: MicroPython driver file(s) the part needs on the board. When the part is placed
  on the breadboard in the [Board View](../how-to/board-view), Snakie offers to
  install these onto the connected device. An entry missing `source` or `target`
  is dropped. See [Install part drivers](../how-to/install-part-drivers).

  Field | Type | Notes
  ----- | ---- | -----
  `source` | string | Where the driver comes from: a `mip` spec, a URL, or a filename bundled alongside `parts.yml`. Required.
  `target` | string | Where it lands. For `mip` installs (a `github:`/`gitlab:`/`pypi:` spec or bare micropython-lib package) this is the **install folder** (e.g. `lib`; omit for the device default `/lib`). For copies (an `http(s)://` URL or bundled filename) this is the full destination **path** including filename (e.g. `lib/vl53l0x.py`); intermediate folders are created. Required.
  `label` | string | Human label shown in the install prompt; defaults to `source`.

```{tip}
The install mechanism is chosen from `source`: a `github:`/`gitlab:`/`pypi:`
spec or a bare package name is installed with `mip`; an `http(s)://` URL or a
bare filename shipped next to `parts.yml` is copied verbatim.
```

## Layer visibility

`layerVisibility`
: Which layers are shown when the part is drawn (Part Editor, Parts Library
  preview and Board View). A key set to `false` hides that layer everywhere;
  absent keys default to visible. Hiding the `image` keeps its bytes for later
  refinement while showing the footprint.

  Sub-field | Type | Notes
  --------- | ---- | -----
  `pcb` | boolean | The PCB body (outline + fill). Off for parts with no board (e.g. a bare motor).
  `image` | boolean | The uploaded board photo (separate from the PCB body).
  `holes` | boolean | The mounting holes.
  `pins` | boolean | The pads.
  `components` | boolean | The component shapes + labels.

## Complete example

A minimal sensor breakout with pins, mounting holes and a bundled driver:

```yaml
id: vl53l0x
name: VL53L0X ToF
description: Time-of-flight distance sensor breakout (I²C).
manufacturer: STMicroelectronics
family: Sensor
tags:
  - i2c
  - distance
  - tof
package: SMD
pinSpacing: 2.54
voltage: 2.8–5V
partNumber: VL53L0X
properties:
  range: 2m
  interface: I²C
version: 1.0.0
pcbColor: "#101820"
aspect: 1.4
dimensions:
  width: 25
  height: 18
headers:
  - edge: bottom
    pins:
      - name: VIN
        type: pwr
        number: 1
      - name: GND
        type: gnd
        number: 2
      - name: SCL
        type: io
        number: 3
        gpio: 5
        capabilities:
          - i2c
          - digital
      - name: SDA
        type: io
        number: 4
        gpio: 4
        capabilities:
          - i2c
          - digital
mountingHoles:
  - { x: 0.12, y: 0.5, diameter: 2.5 }
  - { x: 0.88, y: 0.5, diameter: 2.5 }
drivers:
  - source: vl53l0x.py
    target: lib/vl53l0x.py
    label: VL53L0X driver
```

:::{admonition} Screenshot needed — `parts-yml-editor-inspector`
:class: screenshot
What to capture: the Part Editor with a pin selected, showing its inspector
fields (name, type, GPIO number, capabilities checkboxes, pad shape) next to the
laid-out part — illustrating the visual fields that map to this schema.
:::

## See also

- [Author a part](../tutorials/author-a-part) — the visual workflow that writes this file.
- [Install part drivers](../how-to/install-part-drivers) — how `drivers` are installed.
- [Parts & boards model](../explanation/parts-and-boards-model) — why a part is a superset of a board definition.
- [robot.yml schema](robot-yml) — the sibling format for robots.
