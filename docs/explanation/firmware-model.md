# How firmware flashing works

Snakie can install MicroPython onto a range of boards and notify you when a newer
build exists. This page explains the model behind
[Flash MicroPython firmware](../how-to/flash-firmware).

## One catalog, three flash paths

The flasher's board list is a **catalog** merged from Thonny's curated firmware
sources, so the available versions stay current without Snakie hard-coding them.
The catalog is a cascade of **Family → Model → Variant → Version**, where each
version is a downloadable firmware file. Three families of board flash in three
different ways:

| Family | Firmware | How it's flashed |
| --- | --- | --- |
| **rp2** (RP2040 / RP2350 — Pico family) | `.uf2` | Copy the UF2 onto the board's **boot drive** (`RPI-RP2`). |
| **esp32 / esp8266** | `.bin` | Flash over serial with **esptool** at the chip's correct offset. |
| **nrf51 / nrf52** (BBC micro:bit v1 / v2) | `.hex` | Copy the `.hex` onto the **DAPLink drive** (`MICROBIT`). |

The per-chip esptool offset matters (e.g. `0x1000` for the original ESP32, `0x0`
for most others), and the UF2/`.hex` paths need the right removable drive mounted —
Snakie detects these automatically.

## micro:bit specifics

A connected micro:bit is detected by its `MICROBIT` DAPLink drive; reading
`DETAILS.TXT` tells **v1 (nRF51)** from **v2 (nRF52833)** from its board ID, so the
dialog pre-selects the matching firmware. If the board is in **maintenance /
bootloader mode** (the `MAINTENANCE` drive), Snakie detects it and **blocks the
flash** with guidance to reconnect normally — flashing MicroPython there can
soft-brick the board.

## The "update available" check

When [the firmware-update check](../reference/settings) is on, Snakie reads the
device's running MicroPython version from its **boot banner** and compares it to the
newest stable build in the catalog. The comparison is **scoped to the connected
board's own family**: MicroPython's ports share a `1.x` version line, but the
micro:bit ships its own `2.x` line, so a catalog-wide maximum would wrongly tell,
say, a Pico on `1.28.0` that a micro:bit's `2.1.2` is "newer". Scoping to the
family — and reading the *most recent* banner, so a previously-connected board's
banner left in the console can't mislead it — keeps the notification correct.
