# Flash MicroPython firmware

Put (or update) MicroPython on your board from inside Snakie — no separate tool
hunting. The flasher handles the **RP2040 / Pico** (copy a UF2), **ESP32 /
ESP8266** (via `esptool`), and the **BBC micro:bit** (copy a `.hex`), and can
download the right build straight from MicroPython.org.

```{note}
This page assumes you can already plug a board in. For wiring up the serial
connection and choosing a port for everyday coding, see
[Connect a device](connect-device). Background on each board family lives in
[Boards & firmware](../reference/boards-and-firmware) and
[The firmware model](../explanation/firmware-model).
```

## Open the firmware flasher

Click **⚡ Flash firmware** at the far-right end of the status bar (bottom of the
window). The **Flash MicroPython firmware** dialog opens.

:::{admonition} Screenshot needed — `flash-firmware-dialog`
:class: screenshot
What to capture: The Flash MicroPython firmware modal open with the "Download from MicroPython.org" source selected, showing the Family → Model → Variant → Version dropdowns.
:::

The dialog drives everything from two choices:

1. **Board type** — ESP32, ESP8266, RP2040 / Pico, or BBC micro:bit. Press
   **⟳ Detect** to auto-scan for connected boards (see below); detected boards
   are listed under the dropdown.
2. **Firmware source** — **Download from MicroPython.org** (a curated catalog) or
   **Local file** (browse for a file you already have).

Watch the live log and the **% progress** bar as it runs. When it finishes
(success or failure) a **Done** button appears. The **Close** button is disabled
while a flash is in progress — don't unplug the board mid-write.

## Let Snakie detect the board

Press **⟳ Detect** to re-scan. Detection is best-effort and never blocks manual
selection:

| Board | How it's detected |
|-------|-------------------|
| ESP32 / ESP8266 | The USB-to-serial bridge chip's VID/PID (CP210x, CH340/CH341, FTDI, or Espressif native USB). The same bridge ships on many boards, so Snakie guesses the **most likely** family and lets you override the **Board type**. |
| RP2040 / Pico | The `RPI-RP2` boot drive that appears when the board is held in BOOTSEL mode. |
| BBC micro:bit | The `MICROBIT` drive, reading `DETAILS.TXT` to tell **v1 from v2** (and to spot maintenance mode). |

If nothing is detected, pick the board type yourself and select the port or drive
manually.

## Choose the firmware

### From the MicroPython.org catalog (recommended)

Select **Download from MicroPython.org**. Snakie fetches a curated catalog
(sourced from Thonny's published lists) and presents a cascade:

**Family → Model → Variant → Version**

The newest version is pre-selected; a ★ marks popular variants. The catalog
covers UF2 builds (RP2040), `.bin` builds for ESP chips, and `.hex` builds for the
micro:bit, all merged into one list.

```{important}
In catalog mode the **Family** you pick is authoritative — it sets the **Board
type** (shown read-only) and the correct ESP flash offset automatically. Pick the
family that matches your chip and the right inputs (serial port for ESP, boot
drive for RP2040 / micro:bit) appear for you.
```

If the catalog can't be reached (offline, or a fetch timed out), the dialog says
so and you can still use **Local file**. Press **⟳ Refresh** to re-fetch.

### From a local file

Select **Local file**, then **Browse…** to pick a firmware you downloaded
yourself:

- `.uf2` for RP2040 / Pico
- `.bin` for ESP32 / ESP8266
- `.hex` for the BBC micro:bit

## Flash an RP2040 / Pico (UF2)

1. **Hold BOOTSEL** while plugging the board in. It mounts as the `RPI-RP2`
   drive.
2. Press **⟳ Detect** — Snakie selects the **RP2040 boot drive (RPI-RP2)**.
3. Choose the firmware (catalog `rp2` family, or a local `.uf2`).
4. Click **Download & Flash** (catalog) or **Flash** (local file).

Snakie copies the UF2 onto the boot drive. The board reboots itself into the new
firmware as soon as the copy completes — there's no separate tool to run.

```{tip}
If no `RPI-RP2` drive shows up, the board isn't in BOOTSEL mode. Unplug it, hold
the **BOOTSEL** button, plug it back in, then press **Detect**.
```

## Flash an ESP32 / ESP8266 (esptool)

ESP boards are flashed over the serial port by `esptool`.

```{warning}
**Snakie does not bundle `esptool`.** Install it yourself first:

```bash
pip install esptool
# or
pipx install esptool
```

The dialog probes your `PATH` and shows whether `esptool` was found (and its
version). If it's missing, the **Flash** button stays disabled.
```

1. Plug the ESP board in and press **⟳ Detect** to find its **serial port**.
2. Select the **Board type** (ESP32 or ESP8266) if detection guessed wrong.
3. Check the **Flash offset**. Snakie pre-fills the per-chip default — `0x1000`
   for the original ESP32, `0x0` for ESP8266 and the other ESP variants. You can
   override it.
4. Choose the firmware (catalog `esp*` family, or a local `.bin`).
5. Click **Download & Flash** or **Flash**.

Snakie runs `esptool ... write_flash <offset> <file>` and streams its output into
the log.

```{note}
The offset is per-chip and the **wrong offset fails the flash**. Picking the
right Family in catalog mode sets it for you.
```

## Flash a BBC micro:bit (.hex)

1. Plug the micro:bit in via USB. It mounts as the `MICROBIT` drive.
2. Press **⟳ Detect**. Snakie reads `DETAILS.TXT` and auto-detects **v1 or v2**,
   pre-selecting the matching catalog build (`nrf51` for v1, `nrf52` for v2).
3. Choose the firmware (or a local `.hex`).
4. Click **Download & Flash** or **Flash**.

The `.hex` is copied onto the `MICROBIT` drive. The board flashes it and reboots —
the yellow LED blinks during the write.

### Maintenance mode is blocked

If the micro:bit mounted as the `MAINTENANCE` drive (DAPLink bootloader mode,
used for interface-firmware updates), Snakie detects it and **blocks the flash**
with a warning. Flashing MicroPython there can soft-brick the board.

To recover: **unplug it and plug it back in without holding the reset button** so
the normal `MICROBIT` drive appears, then press **Detect**.

:::{admonition} Screenshot needed — `flash-firmware-microbit-maintenance`
:class: screenshot
What to capture: The flasher with a micro:bit selected and the orange "maintenance mode" warning banner explaining to reconnect without holding reset.
:::

## The "newer firmware available" prompt

When a device is connected, Snakie reads its running MicroPython version from the
REPL boot banner and compares it against the newest **stable** build in the
catalog **for that board's family** (so a micro:bit's 2.x line is never offered to
a Pico on 1.x).

If a newer version exists, a prompt appears above the **Flash firmware** button
with a one-click **Flash** that opens the dialog ready to go.

:::{admonition} Screenshot needed — `flash-firmware-update-prompt`
:class: screenshot
What to capture: The status-bar popup reading "MicroPython vX.Y.Z is available (device runs v…)" with the Flash and dismiss (✕) buttons, anchored above the Flash firmware button.
:::

To turn this check off, open **Settings → Firmware updates** and clear **Check for
newer MicroPython firmware**. See [Settings & themes](settings-and-themes).

```{note}
The firmware-update prompt is separate from the **app** updater, which notifies
you about new Snakie releases — see [Update Snakie](update-snakie).
```

## Related

- [Connect a device](connect-device) — choose a serial port for everyday coding.
- [Boards & firmware](../reference/boards-and-firmware) — supported families and offsets.
- [The firmware model](../explanation/firmware-model) — why ESP uses esptool and the others copy a file.
- [Settings & themes](settings-and-themes) — the firmware-update check toggle.
