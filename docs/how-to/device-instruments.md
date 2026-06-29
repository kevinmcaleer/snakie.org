# Use the device instruments

The **instrument dock** hosts a set of skeuomorphic panels that read from and
drive the hardware on your board: buttons, LEDs, a buzzer, a rotary encoder, an
IMU, a gamepad/teleop pad, an ultrasonic rangefinder, an I²C OLED, I²C / Wi-Fi /
Bluetooth scanners, and a SAM text-to-speech panel.

This page covers the **interactive device panels**. For the data instruments —
the Oscilloscope, Multimeter and Plotter — see [Use the instruments](use-instruments)
and [REPL & Plotter](repl-and-plotter).

```{note}
Most device panels talk to a small on-device library, `instruments.py`. When you
open a panel and the connected board doesn't have it yet, a banner offers to copy
it to `/lib/instruments.py` in one click. See [Telemetry API](../reference/telemetry-api)
for the helper functions and [How telemetry works](../explanation/telemetry-design)
for the design.
```

## Open the dock and add a panel

1. Click **Instruments** in the toolbar to show the **INSTRUMENT DOCK** (the
   rightmost panel, to the right of the chat panel).
2. The dock header has two engraved rows of icon toggles — **INPUTS** and
   **OUTPUTS** — plus an **＋ Add** button. Click a toggle to show or hide that
   panel.
3. For the full catalogue, click **＋ Add** to open the palette, type to filter by
   name or description, and click an entry to add it.

Panels your **code declares** are surfaced automatically: when the active file
imports a driver or uses a matching pin (e.g. an `MPU6050` import lights the IMU,
a `PWM` pin lights the Oscilloscope), that instrument gets an accent **in-use**
dot and starts visible. Everything else is one click away in the palette.

```{figure} /_static/screenshots/device-instruments-dock-header.png
:alt: The instrument dock with the INPUTS / OUTPUTS toggle rows, the ＋ Add palette open showing the searchable catalogue, a…
:width: 100%

The instrument dock with the INPUTS / OUTPUTS toggle rows, the ＋ Add palette open showing the searchable catalogue, and one in-use instrument carrying its accent dot.
```

### Dock, float, or hide a panel

Each panel's title bar has two keys:

- **Dock-to-side key** — flips the panel between sitting in the dock rail and
  **floating** over the whole window (drag it by the title bar).
- **Close (✕)** — *hides* the panel; it isn't destroyed. Bring it back from the
  header toggle or the ＋ Add palette.

## Two ways a panel talks to the board

The panels split into a few interaction styles. Knowing which one a panel uses
tells you what has to be running on the board.

Read panels (passive)
: **Button, Encoder, IMU, Range, Wi-Fi, Bluetooth, and the Display's *Mirror*
  mode** subscribe to the serial stream and update when your program **prints**
  `SNK …` telemetry lines (via the `instruments.py` helpers). This is passive —
  it never interrupts a running `while True:` loop.

Control panels (active)
: **LED, Buzzer, Gamepad, SAM, and the Display's *Push* mode / pin retargets**
  *send* commands to the board. These need a Snakie program that is **running and
  servicing the control channel** — one that calls `inst.start()` and
  `inst.control.poll()` in its loop. Snakie watches for the program's `SNK READY`
  heartbeat; when none is live, the panel offers to **open and run a bundled
  demo** instead of sending into the void.

One-shot panels
: **I²C detect** and **SAM** run a one-off command over the REPL (`device.exec`) —
  they work on demand with **no running program**, just a connected board.

```{tip}
The control panels with a live-status pill show **no board**, **no program**, or
**program live**. If it says *no program*, run your own program (calling
`inst.start()` + `inst.control.poll()`) or click the panel's **Run demo** button.
```

## Pin selection

Where a pin is chosen depends on the panel:

| Panel | Pin selection |
| --- | --- |
| Buzzer | **PIN (PWM)** dropdown (GP0–GP28) |
| Range | **TRIG** / **ECHO** dropdowns |
| Display | **SDA** / **SCL** dropdowns + **ADDR** |
| I²C detect | **Bus** / **SDA** / **SCL** (only valid combos offered) |
| SAM | **BUZZER PIN** dropdown (the board's GPIO pins) |
| Button, Encoder, IMU, LED, Gamepad | Defined in **your code**, not the panel |

For the **Buzzer, Range and Display**, changing a pin sends a live retarget
command to the running program *and* offers a one-click **Update code** when the
pin in the panel differs from the one declared in your open file.

---

## The panels

### Button

A read panel for digital inputs. Each named button your program reports with
`inst.button(name, state)` gets a row with a lit **PRESSED / released** lamp and
a **rising-edge counter**. The bottom strip shows **BUTTONS / LAST / EDGES**.

```python
import instruments as inst
from machine import Pin

a = Pin(14, Pin.IN, Pin.PULL_UP)
while True:
    inst.button("a", not a.value())  # active-low
```

### LED

A write panel for digital / PWM / RGB / NeoPixel outputs. Four modes:

- **DIGITAL** — an on/off rocker
- **PWM** — a brightness slider
- **RGB** — a colour picker
- **STRIP** — an 8-pixel NeoPixel strip with per-pixel swatches plus **rainbow**
  and **chase** animations

The screen glows the current output. Sends are optimistic (the board doesn't echo
LED state back) and require a program servicing the `led` control target.

### Buzzer

A music player for a passive buzzer / speaker on a PWM pin.

- A one-octave **piano keyboard** — click a key to sound it; **Shift-click** to
  append it to the sequencer.
- An editable **melody sequencer** — drag chips to reorder, click a chip to
  remove, **＋ Rest** to insert a pause, then **▶ Play**.
- A **musical staff** that highlights the playing note.
- An **RTTTL** paste box — paste a ringtone and play it or load it into the
  sequencer.
- **PIN (PWM)**, **OCTAVE**, **TEMPO** and **VOLUME** controls, **■ Stop**,
  **↧ Paste to code** (inserts the melody as MicroPython), and **⧉ Export .py**.

```{note}
The buzzer always previews through the IDE's audio so keys click locally even
with no board. To actually sound the speaker, a Snakie program must be servicing
the `buzzer` target — or click **▶ Run buzzer demo** when prompted.
```

### Encoder

A read panel for a rotary encoder. A knurled brass knob rotates to the running
**count** from `inst.encoder(...)`, with a **CW / CCW** direction lamp and a
bottom strip of **COUNT / DIR** and either **RPM** or, if the encoder reports a
push-switch, **BUTTON**.

### IMU

A read panel that shows a board's orientation as a small CSS-3D model that tilts
in real time from `inst.imu(roll, pitch, yaw)` or `inst.imu_quat(...)`, over an
artificial-horizon band. **LEVEL** captures the current pose as zero (calibrate);
**RESET** clears it. The readout shows **ROLL / PITCH / YAW**.

### Gamepad

Drive a connected robot live (teleop). Use a **physical gamepad** (browser
Gamepad API) or the on-screen **virtual stick**. Shaped inputs stream to the
board's `teleop` target at ~25 Hz.

Two safety controls are always present:

- **HOLD TO DRIVE** — a deadman: outputs only stream *while held*; releasing
  sends a single zero frame and stops.
- **E-STOP** — a latched stop that forces every output to zero and blocks driving
  until reset.

Open **edit mapping** to define outputs (name, source axis/button + index,
deadzone, scale, trim, invert) and buttons. The readout shows **OUTPUTS / STATE /
RATE**.

:::{admonition} Screenshot needed — `device-instruments-gamepad`
:class: screenshot
What to capture: The Gamepad panel showing the virtual stick, the mapped-output bars, and the HOLD TO DRIVE + E-STOP safety buttons.
:::

### Range (ultrasonic / ToF)

A radar display for a distance sensor that prints `inst.distance(mm, angle=...)`.
It picks its mode automatically:

- **Single sensor** (no angle) → a **gauge** needle plus a rolling
  distance-over-time history.
- **Swept sensor** (angle present) → a **polar radar** sweep with fading
  persistence trails.

Pick the **TRIG** / **ECHO** pins, the **max range** (0.5 m–4 m), the **units**
(mm / cm), and a proximity **ALERT** threshold that turns the display red on a
close obstacle. An out-of-range or missing echo shows **NO ECHO**. The readout
shows **RANGE / ANGLE / MIN**.

:::{admonition} Screenshot needed — `device-instruments-range-radar`
:class: screenshot
What to capture: The Range instrument in swept/RADAR mode showing the polar sweep with fading blips, plus the TRIG/ECHO pin selectors and the max-range / units / alert controls.
:::

### Display (SSD1306 OLED)

A panel for an I²C OLED / LCD with two modes:

- **Mirror** — renders the board's live screen from `inst.screen(...)` /
  `inst.screen_fb(...)` telemetry (text rows or a decoded framebuffer).
- **Push** — type rows and **Push →** them to the real display.

Choose the **SIZE** geometry, the **SDA** / **SCL** pins and the I²C **ADDR**
(0x3C / 0x3D). The panel warns if the SDA/SCL pair isn't a valid RP2040 I²C pair.
The readout shows **ADDR / SIZE / FPS**.

### I²C detect

The classic `i2cdetect` 8×16 address grid. Pick the **Bus**, **SDA** and **SCL**
from the connected board's valid I²C combinations, then **SCAN** — Snakie runs a
one-shot probe over the REPL and lights every responding address. No running
program is needed, just a connected board. The readout shows **FOUND / SDA /
SCL**.

### Wi-Fi scan

An on-demand network scanner. **SCAN** triggers a Wi-Fi scan on the board (run on
its second core by a live program); results stream in as one row per network with
the SSID, a lock icon for secured networks, a 0–4 bar signal meter, and the RSSI.
The readout shows **NETWORKS / BEST / BAND**.

```{important}
A scan only works while a Snakie program is running and servicing the scan
trigger. If none is live, the panel offers **▶ Run Wi-Fi demo** to open and run a
bundled demo that scans for you.
```

### Bluetooth scan

The BLE equivalent of the Wi-Fi panel. **SCAN** runs an on-device BLE scan;
results stream in as one row per device with the name, MAC and signal strength.
The readout shows **DEVICES / NEAREST / MODE**. Same running-program rule applies
— otherwise use **▶ Run BLE demo**.

### SAM (text-to-speech)

Software Automated Mouth: type text into the speech bubble, pick the **BUZZER
PIN**, and **🔊 SPEAK** (or press Ctrl/Cmd+Enter). Snakie makes sure the `sam`
library is on the board — mip-installing it the first time (see
[Install packages](install-packages)) — then synthesises the text out of that
single pin. **Open demo** drops a runnable `sam_demo.py` into the editor. Needs a
connected board.

## See also

- [Use the instruments](use-instruments) — the Oscilloscope, Multimeter and Plotter
- [REPL & Plotter](repl-and-plotter) — the console and live serial plot
- [Connect a device](connect-device) and [Run & stop](run-and-stop)
- [Board view](board-view) — launch a scope/meter from a PWM/ADC node
- [Instruments reference](../reference/instruments) and
  [Telemetry API](../reference/telemetry-api)
- [How telemetry works](../explanation/telemetry-design)
