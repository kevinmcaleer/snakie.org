# Getting started

Welcome to Snakie, a cross-platform MicroPython editor. In this tutorial you will
install Snakie, connect it to a microcontroller over USB, and run your first
program. By the end you will have an onboard LED **blinking** on real hardware.

This should take about ten minutes.

## What you will need

- A computer running **Windows (x64)**, **macOS** (Apple Silicon or Intel), or
  **Linux (x64)**.
- A MicroPython-capable board — for example a Raspberry Pi Pico / Pico 2 W, an
  ESP32, or a Pimoroni Pico Plus 2 — with a USB cable that carries data (not a
  charge-only cable).
- The board must **already be running MicroPython firmware**.

```{important}
If your board is brand new, or you are not sure it has MicroPython on it, flash
the firmware first. Snakie can do this for you — see
[Flash firmware](../how-to/flash-firmware). Then come back here.
```

## What you will end up with

A small `blink.py` program running on your board, toggling its onboard LED on and
off once a second.

## Step 1 — Install Snakie

Download the installer for your platform from the
[**Snakie Releases**](https://github.com/kevinmcaleer/Snakie/releases/latest)
page on GitHub, then pick the file that matches your machine:

| Platform | File to download |
| --- | --- |
| Windows (x64) | `Snakie.Setup.<version>.exe` |
| macOS (Apple Silicon) | `Snakie-<version>-arm64.dmg` |
| macOS (Intel) | `Snakie-<version>.dmg` |
| Linux (x64) | `Snakie-<version>.AppImage` or `snakie_<version>_amd64.deb` |

Then install it the usual way for your OS:

- **Windows** — run the `.exe` and follow the installer.
- **macOS** — open the `.dmg` and drag **Snakie** into your Applications folder.
- **Linux** — make the `.AppImage` executable and run it, or install the `.deb`
  with your package manager.

```{note}
macOS builds are code-signed and notarized, so they open without extra steps.
Windows and Linux builds are currently **unsigned**, so the first launch may show
a SmartScreen or "unidentified developer" warning — choose **Run anyway** /
**Open** to continue.
```

Now launch Snakie. You will see the main window: a top **toolbar**, the code
**editor** in the middle, a file tree on the left, and the **Shell** (the REPL
console) along the bottom.

## Step 2 — Plug in your board

Connect your board to your computer with the USB cable. Give it a couple of
seconds to be recognised by the operating system.

```{tip}
On some Windows machines a USB-serial driver is needed before the board's port
shows up. Snakie will prompt you if it detects a board that needs one. See
[Connect a device](../how-to/connect-device) for details.
```

## Step 3 — Connect Snakie to the board

The connection control lives in the header of the **Shell** panel at the bottom
of the window. It has three parts:

1. A **port dropdown** listing the serial ports it found.
2. A **refresh** button (the ⟳ icon) to re-scan for ports.
3. A **Connect** button.

Do this:

1. Open the **port dropdown** and select your board. Each entry shows the port
   path and, where available, a friendly name or manufacturer (for example
   `/dev/cu.usbmodem1101 — Board in FS mode` or `COM4 — USB Serial Device`) to
   help you pick the right one.
2. If your board is not listed, press the **⟳ refresh** button and look again.
3. Click **Connect**.

The button changes to **Connecting…** and then to **Disconnect** once you are
linked. At the same time, the **status bar** at the very bottom-left of the
window switches from *Disconnected* to **Connected · `<your port>`**.

:::{admonition} Screenshot needed — `getting-started-connection-control`
:class: screenshot
What to capture: The Shell panel header with the serial-port dropdown open
showing a connected board, the ⟳ refresh button, and the Connect/Disconnect
button.
:::

## Step 4 — Confirm the REPL banner

Switch the Shell panel to the **Console** tab (it is selected by default). When
the connection is live you can see MicroPython's REPL. Press **Enter** in the
console and you should see the `>>>` prompt; if the board has just been reset you
will also see its boot banner, something like:

```text
MicroPython v1.24.0 on 2024-10-25; Raspberry Pi Pico 2 W with RP2350
Type "help()" for more information.
>>>
```

Seeing the banner and the `>>>` prompt means Snakie is talking to your board.

:::{admonition} Screenshot needed — `getting-started-repl-banner`
:class: screenshot
What to capture: The Shell Console showing the MicroPython boot banner and the
`>>>` REPL prompt just after connecting.
:::

```{tip}
The Console is a full interactive REPL — you can type Python at the `>>>` prompt
and the board runs it immediately. There is also a live serial **Plotter**; see
[REPL & Plotter](../how-to/repl-and-plotter).
```

## Step 5 — Write blink.py

Now create the program.

1. In the toolbar, click the **New file** button (the page-with-a-plus icon).
2. Type the following into the editor:

```python
from machine import Pin
import time

led = Pin("LED", Pin.OUT)  # onboard LED on most Pico boards

while True:
    led.toggle()
    time.sleep(1)
```

3. Click the **Save** button (the floppy-disk icon) and save the file as
   `blink.py`.

```{note}
On a Raspberry Pi Pico / Pico W the onboard LED is named `"LED"`. On boards
without a named LED, use the right pin number instead — for example
`Pin(25, Pin.OUT)` on an original Pico, or `Pin(2, Pin.OUT)` on many ESP32
boards. Check your board's pinout if the LED does not blink.
```

## Step 6 — Run it

Make sure `blink.py` is the active editor tab, then click the green **Run**
button (▶) in the toolbar.

```{note}
The **Run** button is greyed out until two things are true: you are **connected**
to a board, and a **file is open** in the editor. If it is disabled, re-check
Step 3.
```

Run sends the current file straight to the board and runs it; the program's
output streams into the Shell **Console**. Within a second your board's onboard
LED should start blinking — on for a second, off for a second. **That is your
first MicroPython program running from Snakie.** 🎉

:::{admonition} Screenshot needed — `getting-started-run-blink`
:class: screenshot
What to capture: The editor with `blink.py` open and the toolbar's green Run
button, with the Console showing the program running.
:::

## Step 7 — Stop it

Your program runs forever in a `while True:` loop. To stop it, click the
toolbar's red button:

- While a program is running it reads **■ Stop** — clicking it interrupts the
  program (the equivalent of Ctrl-C in the REPL).
- When nothing is running it reads **⟳ Reset** — clicking it soft-reboots the
  board to clear its state.

Click **■ Stop** now and the LED stops blinking.

When you are finished, click **Disconnect** in the Shell header to release the
serial port.

## What you learned

You installed Snakie, connected to a MicroPython board over USB, confirmed the
REPL, and wrote, ran, and stopped a program on real hardware.

## Where to go next

- [Write your first program](first-program) — go deeper than blink: read inputs
  and structure a small program.
- [Connect a device](../how-to/connect-device) — port selection, drivers, and
  troubleshooting connections.
- [Run & stop](../how-to/run-and-stop) — exactly what Run, Stop, and Reset do.
- [REPL & Plotter](../how-to/repl-and-plotter) — use the interactive console and
  graph live values.
- [Keep Snakie up to date](../how-to/update-snakie) — about the in-app updater.
