# Use the REPL shell and Plotter

The **Shell** (the bottom region of the window) hosts an interactive MicroPython
REPL, and the **Plotter** (an instrument in the right-hand dock) graphs numbers
your program prints. This page covers typing at the REPL, clearing and scrolling
the console, and feeding the live Plotter.

This page assumes you can already [connect a device](connect-device). For how to
run a file, see [Run & stop](run-and-stop).

## Type at the interactive REPL

The Shell's **Console** view is a live terminal wired straight to the board's
MicroPython REPL.

1. Connect a board (the [connection control](connect-device) is in the Shell
   header).
2. Click into the Console and press <kbd>Enter</kbd> — you should see the `>>>`
   prompt.
3. Type any Python and press <kbd>Enter</kbd> to run it on the device:

```python
>>> 2 + 2
4
>>> from machine import Pin
>>> Pin("LED", Pin.OUT).on()
```

Keystrokes are forwarded raw to the board, so the usual REPL control keys work:

| Key | Effect |
| --- | --- |
| <kbd>Ctrl</kbd>+<kbd>C</kbd> | Interrupt — stop a running loop and return to the prompt |
| <kbd>Ctrl</kbd>+<kbd>D</kbd> | Soft reset the board |
| <kbd>↑</kbd> / <kbd>↓</kbd> | MicroPython's own REPL history |

```{tip}
If a program you ran with **Run** is stuck in a `while True:` loop, click into the
Console and press <kbd>Ctrl</kbd>+<kbd>C</kbd>, or use the toolbar **Stop**
button. See [Run & stop](run-and-stop).
```

:::{admonition} Screenshot needed — `repl-and-plotter-console`
:class: screenshot
What to capture: The Shell region with the Console view active, showing the `>>>`
prompt and a couple of evaluated expressions, plus the Console/Problems toggle and
the connection control in the header.
:::

## Clear the console and scroll back

- **Clear:** click the **Clear** (✕) button in the Shell header (Console view
  only) to wipe the terminal.
- **Scrollback:** the console keeps the last 5000 lines; scroll up with the mouse
  wheel or trackpad to review earlier output.

The Console and **Problems** views share the same region — switch between them
with the segmented toggle in the header. Toggling does not lose console
scrollback; the inactive view is just hidden.

```{note}
The Console hides Snakie's instrument telemetry lines (the `SNK …` rows emitted
by the [instruments library](use-instruments)) so machine data doesn't clutter
your output. Ordinary `print()` output, prompts and tracebacks are shown as-is.
```

## Graph numbers with the Plotter

The **Plotter** is a strip-chart instrument that graphs numeric values your
program prints, over time. It lives in the **instrument dock** (the rightmost
panel, to the right of the chat panel).

1. Click the **instruments** button in the toolbar to show the dock if it's
   hidden.
2. Make sure **PLOT** is enabled in the dock header (the Plotter is shown by
   default).
3. [Run](run-and-stop) a program that prints numbers — the Plotter draws a trace
   for each value as the lines arrive.

The Plotter reads the same serial stream the console does, passively — it never
interrupts your program or polls the board, so it keeps drawing while your code
runs.

### What the Plotter understands

Each completed line of output is parsed into one or more numeric samples. Trim is
applied first; lines with no parsable number are ignored.

| Line your program prints | Plotted as |
| --- | --- |
| `12.5` | one value on a single auto-named series |
| `1, 2, 3` | three values (comma, tab, or space separated) |
| `1 2 3` | three values |
| `temp:21.4, humidity:48` | named series `temp` and `humidity` |
| `x=1 y=2` | named series `x` and `y` |

Unlabelled columns map to positional series named `series 1`, `series 2`, … in
order. Labelled tokens (`name:value` or `name=value`) always map to the series of
that name, so you can mix the two styles across lines without them colliding.

```python
import time
from machine import ADC

sensor = ADC(26)
while True:
    raw = sensor.read_u16()
    print("raw:", raw, "scaled:", raw / 65535)
    time.sleep_ms(100)
```

```{tip}
For richer, console-free plotting use the on-device [instruments
library](use-instruments): `inst.plot(temp=21.4, light=80)` emits a labelled row
that the Plotter graphs while staying hidden from the console.
```

### Reading the chart

- **Auto-scale:** the Y axis fits the visible data automatically; the X axis is
  the sample index, newest at the right (the chart scrolls right-to-left).
- **Rolling window:** the Plotter keeps the most recent ~200 samples per series
  and up to 16 series at once.
- **Legend:** each series' name and colour appear on-screen; before any data
  arrives it reads `no data` / `waiting for numeric data…`.
- **Readout:** the bottom-right shows `<N> samples · <rate> Hz` — the total sample
  count and the live streaming rate estimated from recent timing.

:::{admonition} Screenshot needed — `repl-and-plotter-plotter`
:class: screenshot
What to capture: The Plotter in the instrument dock graphing two live traces, with
the on-screen legend, the `N samples · M Hz` readout, and the metal CLEAR key
visible.
:::

### Clear the Plotter

Press the **CLEAR** key on the Plotter to wipe its buffer — all series, the
legend and the readout reset to empty. (The Plotter has no other controls; it
auto-scrolls and auto-scales on its own.)

## See also

- [Run & stop](run-and-stop) — running a file vs. typing at the REPL.
- [Use the live instruments](use-instruments) — Oscilloscope, Multimeter and the
  `inst.plot()` helper.
- [Connect a device](connect-device) — port selection and connection state.
- [Telemetry API](../reference/telemetry-api) — the `SNK …` line format the
  instruments speak.
