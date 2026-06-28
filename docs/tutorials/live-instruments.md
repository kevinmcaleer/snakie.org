# Read live signals with the instruments

In this tutorial you will turn your board into a live data source and watch it on
Snakie's skeuomorphic **Oscilloscope**, **Multimeter** and **Plotter**. You will
copy a tiny MicroPython library onto the board, add a few one-line telemetry calls
to a program, open the instruments, and read the values updating in real time —
all while your `while True:` loop keeps running, untouched.

By the end you will have:

- the Snakie instrument library on your board,
- a running program that **prints** readings Snakie understands,
- an Oscilloscope drawing a live waveform, a Multimeter showing a live voltage,
  and a Plotter graphing named series over time,
- those instruments docked on the right or floated over your editor.

## Before you start

You need:

- Snakie open with a **connected** MicroPython board. If you have not connected
  one yet, follow [Connect a device](../how-to/connect-device).
- A board with PWM and ADC pins (a Raspberry Pi Pico / RP2040 or RP2350 is the
  reference target — the Multimeter assumes the Pico's 12-bit, 3.3 V ADC).
- Comfort running a program on the board. If this is new, do
  [Write your first program](first-program) and [Run & stop](../how-to/run-and-stop)
  first.

```{note}
This whole feature is **opt-in and non-invasive**. The instrument library only
ever does cheap `print()` calls, and Snakie reads those passively from the serial
stream. Your program is never interrupted — the readings keep flowing from inside
a tight loop. (That is the difference from the per-instrument **LIVE** toggle,
which reaches into the REPL and *does* pause a running program. You will not need
it here.)
```

## Step 1 — Install the instrument library on the board

The telemetry helpers live in a single MicroPython file, `instruments.py`, that
Snakie bundles. Get it onto the board one of two ways.

**The easy way — the install banner.** When Snakie is connected to a board that
does not have the library, a manila banner appears across the top of the window:

> The Snakie instrument library isn't on your board — install it to stream live
> scope/meter/plotter readings.

Click **Download & install**. Snakie writes the library to `/lib/instruments.py`
on the board. (If a newer version of the library ships with Snakie later, the
banner returns offering **Update library** instead.)

:::{admonition} Screenshot needed — `live-instruments-install-banner`
:class: screenshot
What to capture: the manila "instrument library isn't on your board" banner
pinned across the top of the Snakie window, with the gold "Download & install"
key visible.
:::

**The manual way.** Copy `micropython/instruments.py` from the Snakie repo onto
the board's filesystem (drag it across in Snakie's file view — see
[Manage files on the device](../how-to/manage-files)). Placing it alongside your
`main.py`, or in `/lib`, both work because both are on MicroPython's import path.

```{tip}
The library is pure MicroPython with no dependencies, so it is safe to run on a
Pico. Either location is fine — `/lib/instruments.py` (the banner's choice) keeps
it out of the way of your own code.
```

## Step 2 — Add telemetry calls to your program

Open a new file (or your existing one) and write a short program that drives a PWM
pin and reads an ADC pin, then **emits a reading per loop**. Import the library
and call its one-line helpers:

```python
import time
from machine import ADC, PWM, Pin
import instruments as inst

pwm = PWM(Pin(0))
pwm.freq(1000)
adc = ADC(26)

duty = 0
while True:
    duty = (duty + 2048) & 0xFFFF      # sweep the PWM duty
    pwm.duty_u16(duty)

    d = inst.read_pwm(pwm, ch="pwm")   # -> Oscilloscope (the duty fraction 0..1)
    v = inst.read_adc(adc, ch="adc0")  # -> Multimeter (the ADC voltage)
    inst.plot(volts=round(v, 3))       # -> Plotter (a named series over time)

    time.sleep(0.05)
```

What each call does:

| Call | Feeds | Notes |
| --- | --- | --- |
| `inst.read_pwm(pwm, ch="pwm")` | the **Oscilloscope** | reads `pwm.duty_u16()/65535` and prints a scope sample |
| `inst.read_adc(adc, ch="adc0")` | the **Multimeter** | reads `adc.read_u16()`, converts to volts, prints a meter reading |
| `inst.plot(volts=…)` | the **Plotter** | one row of named (and/or positional) numbers over time |

If you prefer to print values you already have, the raw emitters do the same job:
`inst.scope(value, ch="ch1")`, `inst.meter(value, ch="adc0", unit="V")`, and
`inst.plot(temp=21.4, light=80)`. Each is a single cheap `print()`, safe to call
at speed inside the loop.

```{note}
The `ch="…"` label is how Snakie matches a reading to an open instrument. If the
label matches the instrument's source variable, that reading feeds it — but if
only **one** scope (or meter) is open, it receives the telemetry regardless of the
label. So the simple "open one scope and print" case just works.
```

Save the file to the board (for a program that should run on power-up, save it as
`main.py`). See [Manage files on the device](../how-to/manage-files) if you need a
refresher.

## Step 3 — Open the instruments

The instruments live in the **Instrument Dock**, the rightmost panel of the main
window. Each kind has an icon toggle grouped under **INPUTS** / **OUTPUTS** at the
top of the dock:

1. Click the **Oscilloscope** toggle to show the scope.
2. Click the **Multimeter** toggle to show the meter.
3. Click the **Plotter** toggle to show the strip-chart.

If you do not see a toggle for what you want, click **+ Add** to open the
instrument palette, search by name, and pick it — every instrument is reachable in
a couple of clicks there.

```{tip}
You can also launch a scope or meter straight from a pin in the
[Board View](../how-to/board-view): a PWM pin node shows a green square-wave
launcher (opens the Oscilloscope), and an ADC pin node shows a teal dial launcher
(opens the Multimeter), each already pointed at that pin.
```

## Step 4 — Run the program and watch them update

Run your program (the Run control, or `main.py` on reset). As the loop prints
`SNK …` telemetry lines, the instruments come alive:

- the **Oscilloscope** draws the real sampled waveform of your `pwm` channel, with
  a `LIVE ●` marker and a **LAST / MIN / MAX** readout strip,
- the **Multimeter** shows the live voltage on its 7-segment LCD and big readout,
  the 0–3.3 V bargraph, and rolling **MIN / MAX / AVG**,
- the **Plotter** scrolls a trace per series with a legend and a
  `N samples · <rate> Hz` readout.

No **LIVE** toggle is needed — telemetry is passive, so the instruments track your
running loop without pausing it.

:::{admonition} Screenshot needed — `live-instruments-dock`
:class: screenshot
What to capture: the Instrument Dock on the right of Snakie showing the
Oscilloscope (live waveform), Multimeter (a voltage reading + bargraph) and
Plotter (a scrolling trace) all updating from a running program.
:::

```{note}
The Plotter graphs `SNK PLOT` rows from `inst.plot(...)` **and** plain numeric
`print()` output (e.g. `print(temp, light)`), so it works even without the
library. The scope/meter telemetry lines are routed to their instruments and
hidden from the REPL console — see [Use the REPL & plotter](../how-to/repl-and-plotter).
```

## Step 5 — Dock or float each instrument

Each instrument window has a **dock-to-side** key in its title bar (the
split-rectangle icon):

- Click it on a docked window to **float** that instrument over the whole editor.
  Drag the floating window by its title bar to position it anywhere.
- Click it again on a floating window to **re-dock** it back into the rail.

The close (✕) key hides an instrument; bring it back any time with its toggle in
the dock header. Your live data keeps flowing while you rearrange — docking is
purely about placement.

:::{admonition} Screenshot needed — `live-instruments-float`
:class: screenshot
What to capture: a single instrument (e.g. the Oscilloscope) floated as a movable
window over the code editor, away from the dock rail.
:::

## What you built

You installed the instrument library, added a few non-blocking `print` calls, and
watched a live waveform, a live voltage and a scrolling chart driven by a running
loop — without ever interrupting it. That is the whole telemetry workflow.

## Where to next

- [Use the instruments](../how-to/use-instruments) — task recipes for the scope,
  meter and plotter, including retargeting a scope to another pin.
- [Drive device-facing instruments](../how-to/device-instruments) — the IMU,
  range, encoder, buzzer, gamepad and scanner panels, and the control channel
  that lets the IDE drive the board.
- [Instruments reference](../reference/instruments) and the
  [Telemetry API](../reference/telemetry-api) — every helper and the exact
  `SNK …` wire format.
- [How telemetry works](../explanation/telemetry-design) — why the design is
  passive and loop-safe.
</content>
</invoke>
