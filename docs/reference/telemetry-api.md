# On-device telemetry API

Reference for the MicroPython helpers in `instruments.py` that feed Snakie's
live instruments. Your program **prints** readings with these helpers; Snakie
**parses the serial stream** and routes each line to the matching instrument.
This is passive and non-blocking — it never interrupts a running program, so it
is safe inside a tight `while True:` loop.

For the task-oriented guide see [Use the instruments](../how-to/use-instruments)
and [Device-driven instruments](../how-to/device-instruments); for the design
rationale see [Telemetry design](../explanation/telemetry-design); for the
instrument windows themselves see [Instruments](instruments).

```{note}
This page documents the **board → IDE telemetry** direction (the emitters). The
reverse **IDE → board control channel** (`SNKCMD …`, the `control` object,
`start()`/`stop()`) is summarised under [Control channel](#control-channel)
below.
```

## Module

| | |
| --- | --- |
| File | `micropython/instruments.py` (copy onto the board) |
| Import | `import instruments as inst` |
| `__version__` | `"0.5.0"` — Snakie compares this against the on-board copy and offers a one-click UPDATE when they differ |
| Dependencies | none (pure MicroPython; imports under CPython too) |

Install by copying `instruments.py` next to your `main.py` on the board. See
[Use the instruments](../how-to/use-instruments) for the copy/update flow.

## Conventions

- **Every emitter does a single `print()` of one line.** No allocation-heavy
  work and no blocking (the **scanners** are the exception — see below).
- Each line is ASCII, space-delimited, and prefixed with the sentinel token
  `SNK`. Snakie uses the sentinel to **route** the line to an instrument,
  **hide** it from the REPL console, and keep the Plotter's number parser from
  graphing scope/meter rows.
- The channel label `ch` (or `name`) is a string you choose; Snakie uses it to
  match a reading to an open instrument — see [The channel label](#the-channel-label-ch).
- Numbers are formatted with Python's default `str()` / `%s`. Pass already
  rounded values if you want short lines.

## Core emitters

| Function | Signature | Emits | Returns |
| --- | --- | --- | --- |
| `scope` | `scope(value, ch="ch1")` | `SNK SCOPE <ch> <value>` | `None` |
| `meter` | `meter(value, ch="adc0", unit="V")` | `SNK METER <ch> <value> <unit>` | `None` |
| `plot` | `plot(*args, **kwargs)` | `SNK PLOT <tok> [<tok> ...]` | `None` |

```{eval-rst}
.. py:function:: scope(value, ch="ch1")

   Emit one **Oscilloscope** sample. Call repeatedly in a loop to feed a live
   waveform. Routed to an open Oscilloscope whose source matches ``ch``.

   :param value: the sample (float-like; printed verbatim).
   :param ch: channel label (default ``"ch1"``).

.. py:function:: meter(value, ch="adc0", unit="V")

   Emit one **Multimeter** reading. Snakie shows the latest value and folds it
   into the meter's MIN / MAX / AVG.

   :param value: the reading (float-like).
   :param ch: channel label (default ``"adc0"``).
   :param unit: unit string shown by the meter (default ``"V"``).

.. py:function:: plot(*args, **kwargs)

   Emit one **Plotter** row of bare numbers and/or named series. Positional
   args become bare numbers; keyword args become ``name=value`` tokens (kwarg
   order is preserved). The two styles can be mixed.

   :param args: positional bare-number series.
   :param kwargs: named ``name=value`` series.
```

```python
inst.scope(0.5, ch="pwm")          # -> SNK SCOPE pwm 0.5
inst.meter(1.65, ch="adc0")        # -> SNK METER adc0 1.65 V
inst.plot(1, 2, 3)                 # -> SNK PLOT 1 2 3
inst.plot(temp=21.4, light=80)     # -> SNK PLOT temp=21.4 light=80
inst.plot(0.5, temp=21.4)          # -> SNK PLOT 0.5 temp=21.4
```

The `plot` payload is parsed with the Plotter's own `name=value` / bare-number
grammar (see [REPL & plotter](../how-to/repl-and-plotter)); a bare number gets
a positional label (`series 1`, `series 2`, …).

## Convenience read helpers

These are the only helpers that **touch hardware** — they read a peripheral,
emit the matching line, and return the value so the caller can reuse it.

| Function | Signature | Reads | Emits | Returns |
| --- | --- | --- | --- | --- |
| `read_adc` | `read_adc(adc, ch="adc0")` | `adc.read_u16()` → volts (16-bit, 3.3 V ref) | a meter reading (unit `V`) | volts (float) |
| `read_pwm` | `read_pwm(pwm, ch="pwm")` | `pwm.duty_u16() / 65535` | a scope sample | duty fraction `0..1` (float) |

```python
from machine import ADC, PWM, Pin
adc = ADC(26); pwm = PWM(Pin(0))
v = inst.read_adc(adc, ch="adc0")   # meters volts, returns e.g. 1.65
d = inst.read_pwm(pwm, ch="pwm")    # scopes the duty fraction, returns 0..1
```

## Robotics emitters

Each is a single cheap, non-blocking `print()` — loop-safe like `scope`/`meter`.

| Function | Signature | Emits |
| --- | --- | --- |
| `imu` | `imu(roll, pitch, yaw, ch="imu")` | `SNK IMU <ch> <roll> <pitch> <yaw>` (Euler degrees) |
| `imu_quat` | `imu_quat(w, x, y, z, ch="imu")` | `SNK IMUQ <ch> <w> <x> <y> <z>` (quaternion) |
| `distance` | `distance(mm, angle=None, ch="dist")` | `SNK DIST <ch> <mm>` (or `… <mm> <angle>`) |
| `button` | `button(name, state)` | `SNK BTN <name> <0\|1>` |
| `encoder` | `encoder(count, ch="enc", pressed=None)` | `SNK ENC <ch> <count>` (or `… <count> <0\|1>`) |
| `screen` | `screen(lines, addr="0x3C")` | `SNK SCR <addr> text <row> [<row> ...]` |
| `screen_fb` | `screen_fb(data, w, h, addr="0x3C", encoding="b64")` | `SNK SCR <addr> fb <w> <h> <enc> <data>` |
| `emit_bt` | `emit_bt(name, mac, rssi)` | `SNK BT <name> <mac> <rssi>` |

Details:

- **`distance`** — `angle` (degrees) is optional; pass it for a sweeping
  servo/lidar so the range view plots a bearing. Omit it for a fixed sensor.
- **`button`** — `state` is coerced to `1` if truthy, else `0`.
- **`encoder`** — `pressed` is omitted from the line when `None`; pass a value
  for an encoder with an integrated push switch (coerced to `1`/`0`).
- **`screen`** — `lines` is an iterable of strings (one per row). Each row is
  emitted as one token with spaces encoded as `_` (Snakie decodes them back).
  An empty `lines` emits a bare `SNK SCR <addr> text`.
- **`screen_fb`** — `data` is the already-packed payload string; `encoding`
  documents the packing: `b64` (base64 of the raw 1-bpp buffer, row-major,
  MSB-first within each byte) or `rle` (run-length `<count>x<0|1>` joined by
  commas).
- **`emit_bt`** — emit one Bluetooth device from your own BLE scan callback
  (the `name` spaces are `_`-encoded; falls back to `?` when empty).

```python
inst.imu(0.0, 1.2, 90.0)            # -> SNK IMU imu 0.0 1.2 90.0
inst.imu_quat(1.0, 0.0, 0.0, 0.0)   # -> SNK IMUQ imu 1.0 0.0 0.0 0.0
inst.distance(250, 45, ch="lidar")  # -> SNK DIST lidar 250 45
inst.button("a", True)              # -> SNK BTN a 1
inst.encoder(-3, ch="dial", pressed=1)  # -> SNK ENC dial -3 1
inst.screen(["Hello world", "Line 2"])  # -> SNK SCR 0x3C text Hello_world Line_2
inst.screen_fb("AAEC", 8, 8)        # -> SNK SCR 0x3C fb 8 8 b64 AAEC
```

## Scanners

These **block briefly** to run a scan, then emit the result set. Call them
**occasionally** (emit-on-complete), not inside a tight loop. Each tolerates a
missing radio by degrading to no output.

| Function | Signature | Emits | Returns |
| --- | --- | --- | --- |
| `i2c_scan` | `i2c_scan(i2c)` | one `SNK I2C <addr> …` set (addresses as `0x..` hex; bare `SNK I2C` when empty) | list of int addresses |
| `wifi_scan` | `wifi_scan()` | one `SNK WIFI <ssid> <rssi> <ch> <sec>` per network | list of `(ssid, rssi, ch, sec)` (`[]` if no `network` module) |
| `bt_scan` | `bt_scan(ms=4000)` | one `SNK BT <name> <mac> <rssi>` per unique device | list of `(name, mac, rssi)` (`[]` if no `bluetooth` module) |

- **`i2c_scan(i2c)`** — `i2c` is a `machine.I2C` / `SoftI2C`; calls `i2c.scan()`.
- **`wifi_scan()`** — activates `network.WLAN(STA_IF)` and runs `.scan()`; SSID
  spaces are `_`-encoded.
- **`bt_scan(ms=…)`** — actives the `bluetooth` radio and runs an **active**
  `gap_scan` for ~`ms` (active so devices return their names), keeping the
  strongest RSSI per device. Blocks for ~`ms` plus a short grace window.

```python
from machine import I2C, Pin
i2c = I2C(0, sda=Pin(0), scl=Pin(1))
inst.i2c_scan(i2c)        # -> SNK I2C 0x3C 0x68
inst.wifi_scan()          # -> SNK WIFI My_Network -42 6 WPA2   (one line per net)
inst.bt_scan(4000)        # -> SNK BT My_Tag AA:BB:CC -57       (one line per device)
```

## The channel label `ch`

`ch` (or `name` for `button`) is a label you choose — typically the pin, the
peripheral, or the variable name. Snakie matches it to an open instrument:

- If the label matches the instrument's source variable, that reading feeds it.
- If only **one** scope (or one meter) is open, it receives the telemetry
  **regardless** of the label — so "open one scope and print" just works.

## Wire protocol

One reading per line, ASCII, space-delimited, prefixed with `SNK`. `[...]`
marks optional tokens.

```text
SNK SCOPE <ch> <value>                   # scope sample (value: float)
SNK METER <ch> <value> [<unit>]          # meter reading (default unit "V")
SNK PLOT  <tok> [<tok> ...]              # each tok is name=value or a bare number
SNK IMU   <ch> <roll> <pitch> <yaw>      # Euler-angle orientation (degrees)
SNK IMUQ  <ch> <w> <x> <y> <z>           # orientation quaternion
SNK DIST  <ch> <mm> [<angle>]            # range mm, optional bearing (degrees)
SNK BTN   <name> <0|1>                   # button up(0)/down(1)
SNK ENC   <ch> <count> [<0|1>]           # encoder count, optional press state
SNK SCR   <addr> text <row> [<row> ...]  # display text; row spaces -> '_'
SNK SCR   <addr> fb <w> <h> <enc> <data> # display framebuffer; enc in {b64, rle}
SNK I2C   <addr> [<addr> ...]            # one bus-scan result set (may be empty)
SNK WIFI  <ssid> <rssi> <ch> <sec>       # one network per line; SSID spaces -> '_'
SNK BT    <name> <mac> <rssi>            # one BLE device per line; name spaces -> '_'
SNK READY <caps ...>                     # presence heartbeat from inst.start()
```

### Parsing notes (IDE side)

How Snakie's parser treats each line (it never throws; a malformed line is
ignored and falls through to normal console handling):

| Line | Parsed fields | Defaults / rules |
| --- | --- | --- |
| `SCOPE` | `ch`, `value` | rejected if `value` is not finite |
| `METER` | `ch`, `value`, `unit` | `unit` defaults to `V` when omitted |
| `PLOT` | `series[]` | bare numbers get labels `series 1`, `series 2`, … |
| `IMU` | `ch`, `roll`, `pitch`, `yaw` | rejected unless all three are finite |
| `IMUQ` | `ch`, `w`, `x`, `y`, `z` | rejected unless all four are finite |
| `DIST` | `ch`, `mm`, `angle?` | `angle` parsed only when present and finite |
| `BTN` | `name`, `pressed` | last token must be exactly `0` or `1` |
| `ENC` | `ch`, `count`, `pressed?` | `pressed` set only when token is `0` or `1` |
| `SCR text` | `addr`, `rows[]` | each row's `_` decoded back to a space |
| `SCR fb` | `addr`, `{w, h, encoding, data}` | rejected if `w`/`h` not finite or `data` missing |
| `I2C` | `addrs[]` | addresses kept as printed (e.g. `0x3C`); may be empty |
| `WIFI` | `ssid`, `rssi`, `channel`, `security` | SSID `_` decoded to spaces |
| `BT` | `name`, `mac`, `rssi` | name `_` decoded to spaces |
| `READY` | `caps[]` | capability tokens; may be empty |

## Module constants

| Name | Value | Meaning |
| --- | --- | --- |
| `__version__` | `"0.5.0"` | library version; drives the in-IDE UPDATE prompt |
| `SENTINEL` | `"SNK"` | prefix on every telemetry line |
| `CONTROL_SENTINEL` | `"SNKCMD"` | prefix on every IDE → board control line |
| `READY_CAPS` | `("scan:wifi", "scan:bt", "teleop", "led", "buzzer", "range", "screen")` | default capability tokens announced by `start()` / `ready()` |

(control-channel)=
## Control channel

The reverse direction (IDE → board) shares the same module. It is summarised
here for completeness; full reference lives in [Instruments](instruments) and
the rationale in [Telemetry design](../explanation/telemetry-design).

The IDE writes `SNKCMD <target> <payload>` lines; the on-device `control`
object polls stdin non-blockingly and keeps the **latest** payload per target.

| Member | Signature | Purpose |
| --- | --- | --- |
| `control.poll()` | `poll()` | drain pending `SNKCMD` lines (non-blocking) + emit the `SNK READY` heartbeat (~every 2 s). Call once per loop. |
| `control.get` | `get(target)` | latest raw payload string for `target`, or `None` |
| `control.axes` | `axes(target)` | parsed `axes=name:value,…` dict (`{}` if none) |
| `control.pressed` | `pressed(target, btn)` | `True` if `btn:<btn>=1` is in the latest payload |
| `control.on` | `on(target, handler)` | register `handler(payload)` to fire inside `poll()` |
| `control.feed` | `feed(text)` | feed raw stdin text directly (tests / custom transports) |
| `start` | `start(i2c=None, buzzer_pin=None, range_trig=None, range_echo=None, screen_sda=None, screen_scl=None, screen_addr=0x3C, background=False, hz=50)` | register built-in receivers + scan triggers, attach the buzzer, then announce `SNK READY` |
| `ready` | `ready(extra=())` | emit one `SNK READY <caps...>` announcement |
| `stop` | `stop()` | stop the background service and silence the buzzer |

```python
import time
import instruments as inst

inst.start(buzzer_pin=15)          # register receivers + announce SNK READY
while True:
    inst.control.poll()            # drain commands + emit the heartbeat
    time.sleep(0.02)
```

```{warning}
`inst.start(background=True)` (a second-core `_thread` poller) is
**experimental and unreliable on the RP2040** — the thread shares `stdin` with
the REPL and can wedge the board on Stop / soft-reset. Prefer calling
`control.poll()` from your main loop.
```

:::{admonition} Screenshot needed — `telemetry-api-instruments-live`
:class: screenshot
What to capture: The Oscilloscope, Multimeter and Plotter windows updating live
from a running program that calls `inst.scope`/`inst.meter`/`inst.plot`, with no
LIVE toggle enabled.
:::

## See also

- [Use the instruments](../how-to/use-instruments) — copy the library and open the windows.
- [Device-driven instruments](../how-to/device-instruments) — IMU, range, buttons, encoders, scanners.
- [Instruments](instruments) — the instrument windows and their controls.
- [Telemetry design](../explanation/telemetry-design) — why the protocol is print-based.
- [Live instruments tutorial](../tutorials/live-instruments) — a guided walkthrough.
