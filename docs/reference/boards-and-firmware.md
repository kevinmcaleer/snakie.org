# Supported boards and firmware

Reference for the two board-related registries Snakie ships:

- **Built-in board definitions** — the boards the [Board View](../how-to/board-view)
  can draw out of the box (their pinouts, MCU and onboard features).
- **The firmware catalog** — the MicroPython builds the
  [Flash firmware](../how-to/flash-firmware) dialog can download and flash, plus
  the per-chip flash targets and offsets.

These are separate concepts: a board *definition* describes how to **draw** a
board and where its GPIO pins live; the firmware catalog describes what to
**flash**. See [How parts and boards are modelled](../explanation/parts-and-boards-model)
and [The firmware model](../explanation/firmware-model) for the design rationale.

## Built-in board definitions

Snakie registers these boards for the Board View. Each is a `BoardDefinition`
(the same JSON shape a user authors — see
[Add a board definition](../how-to/add-board-definition)). A user file dropped in
`<userData>/boards/` with the same `id` overrides the built-in.

| id | name | mcu | Form factor | PCB colour | aspect | LED token |
|----|------|-----|-------------|------------|--------|-----------|
| `pico2w` | Raspberry Pi Pico 2 W | RP2350 | Pico 2×20 header | `#0f5a2e` | 0.46 | `LED` |
| `pico-plus-2` | Pimoroni Pico Plus 2 | RP2350 | Pico 2×20 header | `#23202b` | 0.46 | `25` |
| `tiny2040` | Pimoroni Tiny 2040 | RP2040 | Castellated, vertical | `#3a1d52` | 0.78 | `LED` |
| `tiny2350` | Pimoroni Tiny 2350 | RP2350 | Castellated, vertical | `#2a1745` | 0.78 | `LED` |
| `esp32-devkit` | ESP32 DevKit | ESP32 | DevKitC 2×15 header | `#1b2733` | 0.42 | `2` |

```{note}
`pico2w` is the **default board** (selected on first run, and whenever a saved
selection no longer resolves). Boards appear in the selector in the order above.
```

The LED token is matched against parsed `Pin(...)` tokens to light the onboard-LED
dot. `LED` (the CYW43/RGB convention) and a bare GPIO number (e.g. `25`) are both
valid — see [How board pins are parsed](../explanation/board-pin-parsing).

### Pinouts

Pins are transcribed from each board's published reference pinout in true physical
edge order. Power (`vcc`) and ground (`gnd`) pads are drawn as rails and are never
wired or highlighted; only `gpio` pads match parsed `Pin(...)` tokens.

#### Raspberry Pi Pico 2 W (`pico2w`) and Pimoroni Pico Plus 2 (`pico-plus-2`)

Both use the identical Pico 2×20 castellated header. Left edge = physical pins
1–20 (top→bottom); right edge = physical pins 40–21 (top→bottom).

| Left edge (1–20) | Right edge (40–21) |
|------------------|--------------------|
| GP0, GP1, **GND**, GP2, GP3, GP4, GP5, **GND**, GP6, GP7, GP8, GP9, **GND**, GP10, GP11, GP12, GP13, **GND**, GP14, GP15 | VBUS, VSYS, **GND**, 3V3_EN, 3V3, ADC_VREF, GP28, **GND**, GP27, GP26, RUN, GP22, **GND**, GP21, GP20, GP19, GP18, **GND**, GP17, GP16 |

Differences between the two:

- **Pico 2 W** — micro-USB, CYW43439 wifi can, RP2350 MCU. Onboard LED is driven
  through the CYW43 chip, so it is `Pin("LED")`, not a GPIO number.
- **Pico Plus 2** — USB-C, 16 MB flash + 8 MB PSRAM, a Qw/ST (STEMMA-QT / Qwiic
  I²C) connector and an SP/E (debug) connector. User LED on GP25.

#### Pimoroni Tiny 2040 (`tiny2040`) and Tiny 2350 (`tiny2350`)

Tiny castellated boards with pads down the two long edges (drawn vertically),
USB-C at the top short end, and an onboard RGB LED (R=GP18, G=GP19, B=GP20). Both
break out the same pin set; the only difference is the MCU (RP2040 vs RP2350).

| Left edge (USB at top) | Right edge (USB at top) |
|------------------------|-------------------------|
| 5V, **GND**, 3V3, GP0, GP1, GP2, GP3 | GP7, GP6, GP5, GP4, A3 (GP26), A2 (GP27), A1 (GP28), A0 (GP29) |

#### ESP32 DevKit (`esp32-devkit`)

ESP32-WROOM-32, the common 30-pin DevKitC: WROOM-32 module (metal can) at the top,
micro-USB at the bottom, two 15-pin headers. Held USB-down, labels run top→bottom.

| Left edge | Right edge |
|-----------|------------|
| 3V3, EN, IO36 (VP), IO39 (VN), IO34, IO35, IO32, IO33, IO25, IO26, IO27, IO14, IO12, **GND**, IO13 | VIN, **GND**, IO23, IO22, TX0 (IO1), RX0 (IO3), IO21, IO19, IO18, IO5, IO17, IO16, IO4, IO0, IO2 |

```{note}
IO34, IO35, IO36 and IO39 are **input-only**. Many DevKitC clones wire an onboard
LED to GPIO2 (the most common, hence the `2` LED token), but it varies by clone.
```

:::{admonition} Screenshot needed — `boards-and-firmware-board-selector`
:class: screenshot
What to capture: The Board View selector dropdown expanded, listing all five
built-in boards (Pico 2 W, Pico Plus 2, Tiny 2040, Tiny 2350, ESP32 DevKit) with
the Pico 2 W rendered behind it.
:::

## Firmware catalog

The Flash dialog pulls a curated list of official MicroPython builds rather than
making you hunt for a file. All network access happens in the Electron **main**
process (the renderer CSP forbids outbound requests); the feature degrades
gracefully when offline.

### Catalog sources

Three published Thonny catalogs are fetched and merged. Each source is fetched
independently (8 s timeout each): if one fails the catalog is still built from the
others; an error is only surfaced when **all** sources fail or the merged catalog
is empty.

| Source | File type | Families | Flash mechanism |
|--------|-----------|----------|-----------------|
| `micropython-variants-uf2.json` | `.uf2` | `rp2` (and other UF2 boards) | Copy to boot drive |
| `micropython-variants-esptool.json` | `.bin` | `esp32`, `esp32s2/s3`, `esp32c2/c3/c5/c6`, `esp32p4`, `esp8266` | `esptool write_flash` |
| `micropython-variants-daplink.json` | `.hex` | `nrf51` (micro:bit v1), `nrf52` (micro:bit v2) | Copy to MICROBIT drive |

The base URLs are:

```text
https://raw.githubusercontent.com/thonny/thonny/master/data/micropython-variants-uf2.json
https://raw.githubusercontent.com/thonny/thonny/master/data/micropython-variants-esptool.json
https://raw.githubusercontent.com/thonny/thonny/master/data/micropython-variants-daplink.json
```

### Catalog shape

The merged sources are reshaped into a four-level cascade rendered by the dialog's
dropdowns. Only downloads whose URL ends in `.uf2`, `.bin` or `.hex` are kept;
entries missing a family, model or flashable download are skipped.

```text
Family  →  Model        →  Variant        →  Version
rp2        Raspberry Pi    (e.g. SPIRAM)     v1.28.0
           Pico                              v1.27.0
```

Fields (from the source JSON):

`family`
: Family id, e.g. `rp2`, `esp32`, `esp8266`, `nrf51`, `nrf52`. Top of the cascade.

`vendor` / `model`
: Combined into the Model dropdown label (e.g. `Raspberry Pi Pico`).

`title`
: The Variant label (e.g. a SPIRAM vs non-SPIRAM build, or a vendor sub-model).

`popular`
: Optional flag Thonny sets on common choices.

`info_url`
: Optional human info page for the variant.

`downloads[]`
: Each `{ version, url }` becomes a selectable Version (versions are de-duplicated
  by URL within a variant, sorted newest-first).

## Flash targets and offsets

The flasher dispatches by `BoardType`, derived from the catalog `family`:

| BoardType | Mechanism | Mount / port |
|-----------|-----------|--------------|
| `rp2040` | Copy `.uf2` to the boot drive | `RPI-RP2` volume (hold BOOTSEL while connecting) |
| `esp32` | `esptool write_flash` | serial port |
| `esp8266` | `esptool write_flash` | serial port |
| `microbit` | Copy `.hex` to the drive | `MICROBIT` volume |

`flashTargetForFamily(family)` maps a catalog family to `{ board, offset }`:

| Family prefix | BoardType | esptool offset |
|---------------|-----------|----------------|
| `rp2*` | `rp2040` | — (UF2 copy, no offset) |
| `esp32` (exact) | `esp32` | `0x1000` |
| any other `esp*` (`esp32s2/s3`, `esp32c2/c3/c5/c6`, `esp32p4`) | `esp32` | `0x0` |
| `esp8266` | `esp8266` | `0x0` |
| `nrf*` / `microbit` | `microbit` | — (`.hex` copy, no offset) |
| unknown | `rp2040` | — (assumes a UF2 copy) |

```{warning}
The esptool offset is per-chip — the **wrong** offset fails the flash. Only the
original `esp32` flashes at `0x1000`; every other ESP chip uses `0x0`.
```

Default ESP `write_flash` settings (applied when not overridden):

| Setting | esp32 | esp8266 |
|---------|-------|---------|
| Offset | `0x1000` | `0x0` |
| Baud | `460800` | `460800` |

```{important}
ESP flashing requires the external **esptool** executable (`esptool` or
`esptool.py`) on your `PATH`. Snakie does not bundle it — install with
`pip install esptool` (or `pipx install esptool`). RP2040 and micro:bit flashing
use a plain file copy and need no extra tool.
```

## Board detection

The Flash dialog auto-detects connected boards to pre-select a target. Detection
is best-effort and always overridable.

### ESP boards (serial VID/PID)

Matched against a table of common USB-to-serial bridge chips (VID/PID are
lowercase hex):

| Vendor ID | Product ID | Chip | Default BoardType |
|-----------|-----------|------|-------------------|
| `10c4` | `ea60` | Silicon Labs CP210x | `esp32` |
| `1a86` | `7523` | WCH CH340 | `esp8266` |
| `1a86` | `5523` | WCH CH341 | `esp8266` |
| `0403` | `6001` | FTDI FT232R | `esp32` |
| `303a` | (any) | Espressif native USB (S2/S3/C3 USB JTAG/serial) | `esp32` |

```{note}
The same bridge chip can ship on different boards, so these are heuristics. The
detected family defaults to the more common choice and the user confirms or
changes it before flashing.
```

### UF2 / DAPLink drives

- **RP2040** — a board held in BOOTSEL mounts as a FAT volume labelled `RPI-RP2`
  containing `INFO_UF2.TXT` (and usually `INDEX.HTM`).
- **micro:bit** — mounts as `MICROBIT` (normal) or `MAINTENANCE` (bootloader
  mode), identified by `DETAILS.TXT`. The generation is read from the `Board ID`:

  | Board ID | Generation | Family |
  |----------|-----------|--------|
  | `9900`, `9901` | v1 (nRF51) | `nrf51` |
  | `9903`–`9910` | v2 (nRF52833) | `nrf52` |

```{warning}
A micro:bit in **maintenance/bootloader mode** mounts as `MAINTENANCE`.
MicroPython cannot be flashed in this mode (copying a target `.hex` here can
soft-brick the board); Snakie surfaces the device but blocks the flash and tells
you to reconnect normally.
```

## See also

- [Flash firmware](../how-to/flash-firmware) — the step-by-step flashing workflow.
- [Add a board definition](../how-to/add-board-definition) — author your own board.
- [Connect a device](../how-to/connect-device) — connecting over serial.
- [The firmware model](../explanation/firmware-model) — why flashing is structured this way.
- [How board pins are parsed](../explanation/board-pin-parsing) — how `Pin(...)` matches pads.
