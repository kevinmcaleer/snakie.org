# Write and run your first program

In this tutorial you will write a short MicroPython program, run it on a real
board, read its output in the Shell, try the interactive REPL, and finally graph
some live numbers on the Plotter. By the end you will have done a full
edit → save → run → observe loop — the core rhythm of working in Snakie.

## Before you start

You will need:

- Snakie installed and open (see [Getting started](getting-started)).
- A MicroPython board **connected** over USB. If you have not done this yet,
  follow [Connect a device](../how-to/connect-device) first — the **Run** button
  stays disabled until a device is connected.

The whole tutorial takes about ten minutes.

```{tip}
You can read this page without a board to learn the workflow, but the **Run**,
**Stop/Reset**, REPL and Plotter steps only do something once a device is
connected.
```

## 1. Create a new file

The editor sits in the centre of the window. When nothing is open it shows
"Open a file to start editing". Make a fresh buffer to work in:

- Click the **+** at the right of the tab strip, **or**
- Click the **New file** button (the page-with-a-plus icon) in the top toolbar.

A new tab called `untitled-1.py` appears and the editor is ready for typing. The
tab shows a small dot while it has unsaved changes.

```{figure} /_static/screenshots/first-program-new-tab.png
:alt: The centre editor with a fresh `untitled-1.py` tab open and the cursor in an empty buffer, the New file button visibl…
:width: 100%

The centre editor with a fresh `untitled-1.py` tab open and the cursor in an empty buffer, the New file button visible in the top toolbar.
```

## 2. Type your program

Type this small program. It blinks the on-board LED and prints a counter:

```python
from machine import Pin
import time

led = Pin("LED", Pin.OUT)

for i in range(10):
    led.toggle()
    print("blink", i)
    time.sleep(0.5)
```

```{note}
`Pin("LED", ...)` targets the on-board LED on a Raspberry Pi Pico / Pico W. On
other boards the LED may be a numbered GPIO (for example `Pin(2, Pin.OUT)` on
many ESP32 boards) — adjust to match your hardware.
```

### Autocomplete helps you type

As you type, Snakie offers MicroPython-aware suggestions on top of Monaco's
normal word completion:

- After `import ` or `from ` it suggests module names — type `import mach` and
  `machine` is offered.
- After a dot it suggests members — `machine.` offers `Pin`, and `Pin.` offers
  `OUT`, `IN` and friends.

Press **Ctrl-Space** at any time to pop the suggestion list manually, then
**Enter** or **Tab** to accept the highlighted item.

### Optional: AI ghost-text

If you have configured a chat provider with an API key, Snakie can also show
greyed-out **AI ghost-text** that predicts the rest of the line or block; press
**Tab** to accept it. This is opt-in and off until you enable it — see
[Use the AI assistant](../how-to/ai-assist) to set it up. It is entirely optional
for this tutorial.

## 3. Save the file

Press **Ctrl-S** / **Cmd-S** (or the floppy-disk **Save** button in the
toolbar). Because this is a brand-new untitled buffer, Snakie opens a **Save As**
dialog — choose a folder and name it `blink.py`. The dirty dot on the tab clears
once it is written.

```{tip}
Saving to your computer is separate from putting the file **on the board**. For
this tutorial you do not need to copy it to the device — **Run** sends the
current editor contents straight to the board for you. To manage files on the
device itself, see [Manage files](../how-to/manage-files).
```

## 4. Run it on the board

Click the green **▶ Run** button in the toolbar. Snakie sends the active file's
contents to the connected board and executes them immediately. You do not have
to save to the device first — Run streams the code you see in the editor.

```{note}
**Run** is disabled until both conditions are met: a device is **connected** and
a file is **open**. Hover the button to see why it is greyed out ("Connect to a
device to run" or "Open a file to run").
```

```{figure} /_static/screenshots/first-program-run-button.png
:alt: The top toolbar with the green Run button and the red Stop/Reset button, with a device shown as connected.
:width: 100%

The top toolbar with the green Run button and the red Stop/Reset button, with a device shown as connected.
```

## 5. Read the output in the Shell

The **Shell** panel runs along the bottom of the window (it is open by default).
Its **Console** view shows your board's output, so you will see:

```text
blink 0
blink 1
blink 2
...
```

scroll past as the loop runs, with the LED blinking in time.

A few things to know about the Shell:

- The **Console / Problems** toggle in the Shell header switches between device
  output and code diagnostics. Leave it on **Console** for now.
- The **Clear** button (✕) wipes the console scrollback.
- If you cannot see the Shell, toggle it with the bottom-panel knob in the
  toolbar.

```{figure} /_static/screenshots/first-program-shell-output.png
:alt: The bottom Shell panel on its Console view showing several "blink N" lines printed by the running program.
:width: 100%

The bottom Shell panel on its Console view showing several "blink N" lines printed by the running program.
```

## 6. Stop or reset the board

The red button next to **Run** is dual-purpose, and its label changes to tell
you what it will do:

| Button shows | When | What it does |
| --- | --- | --- |
| **■ Stop** | while your program is running | Interrupts it (sends Ctrl-C) |
| **⟳ Reset** | when nothing is running | Soft-reboots the board (Ctrl-D) to clear its state |

So if your loop were endless, you would press **Stop** to break out of it. Once
the program finishes (or after you stop it), the button reads **Reset** — a
quick way to clear variables and start the board fresh without unplugging it.

```{tip}
A soft reset re-runs the board's startup, clearing any variables and imports you
created in the REPL. It does not erase files on the device.
```

## 7. Try the interactive REPL

The Shell is a live MicroPython REPL, not just a log. Click into the Console and
type at the `>>>` prompt:

```python
>>> from machine import Pin
>>> led = Pin("LED", Pin.OUT)
>>> led.on()
>>> led.off()
>>> 2 ** 10
1024
```

Each line runs on the board the moment you press Enter, so the REPL is perfect
for poking at hardware and trying expressions before you commit them to a file.
For more on the REPL, see [REPL & Plotter](../how-to/repl-and-plotter).

## 8. Graph live numbers on the Plotter

Snakie can turn printed numbers into a live scrolling chart. The **Plotter**
lives in the instrument dock on the right.

1. Click the **instruments** knob (the small oscilloscope-screen icon) at the
   far right of the toolbar to show the dock. The Plotter is visible by default.
2. In the editor, replace your program with this (or type it at the REPL):

   ```python
   import math
   import time

   t = 0
   while True:
       print(math.sin(t), math.cos(t))
       t += 0.1
       time.sleep(0.05)
   ```

3. Press **Run**. Two traces — one for each number — sweep across the Plotter,
   auto-scaling as they go. The legend names them `series 1` and `series 2`.
4. Press **Stop** when you have seen enough, then use the Plotter's **CLEAR**
   key to wipe its buffer.

### What the Plotter understands

The Plotter reads the same serial output as the Console and graphs any line it
can find numbers in. Each line becomes one sample per series:

| You print | The Plotter draws |
| --- | --- |
| `print(12.5)` | one trace |
| `print(1, 2, 3)` | three traces (comma/space/tab separated) |
| `print("temp:21.4, humidity:48")` | two named traces, `temp` and `humidity` |
| `print("x=1 y=2")` | two named traces, `x` and `y` |

Lines with no number in them are simply ignored, so ordinary log messages do not
disturb the chart. Labelled values (`name:value` or `name=value`) always map to a
trace of that name, so you can mix labelled and plain prints freely.

```{tip}
The fastest way to plot a sensor is to `print()` its reading in a loop with a
small `time.sleep()` between samples — exactly like the sine/cosine example
above.
```

:::{admonition} Screenshot needed — `first-program-plotter`
:class: screenshot
What to capture: The instrument dock Plotter showing two smooth scrolling sine/cosine traces with the "series 1 / series 2" legend and the samples/Hz readout.
:::

## What you have learned

You created and saved a file, ran it on a real board, watched its output in the
Shell, used the REPL interactively, and plotted live numbers — the everyday loop
you will repeat for every project.

Where to next:

- [Visualise your wiring](visualise-wiring) — let Snakie draw the actual board
  and pins your code uses.
- [REPL & Plotter](../how-to/repl-and-plotter) — go deeper on the interactive
  shell and live charts.
- [Run & stop](../how-to/run-and-stop) — the full details of running, stopping
  and resetting.
- [Live instruments](live-instruments) — drive the oscilloscope and multimeter
  from a running program.
