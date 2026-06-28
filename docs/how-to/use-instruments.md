# Open and dock instruments

Snakie's instruments — the **Oscilloscope**, **Multimeter**, **Plotter** and the
robotics panels — live in the **Instrument Dock**, a fixed-width region on the
far right of the main window (to the right of the chat panel). This page shows
how to open them, dock them, float them, and read the live-poll warning.

```{note}
This page covers *placing* and *managing* instrument windows. For what each
panel shows and how to feed it data from your program, see
[Use device instruments](device-instruments) and the
[Instruments reference](../reference/instruments).
```

## Open the dock

The dock is collapsed by default. Reveal it from the **Instruments** button in
the toolbar (the small scope/gauge knob, to the right of the chat-panel toggle).
Click it again to hide the dock.

The dock also opens **automatically** whenever you launch a scope or meter from
the [Board View](board-view) — you don't have to open it first.

When open, the dock shows, top to bottom:

- a compact **mini board view** (the MCU plus the pins your code uses),
- the **INSTRUMENT DOCK** header with two groups of icon toggles —
  **INPUTS** and **OUTPUTS** — plus a **`+ Add`** button,
- the stack of currently-shown instrument windows.

:::{admonition} Screenshot needed — `use-instruments-dock-open`
:class: screenshot
What to capture: the main window with the Instrument Dock open on the right, showing the mini board view, the INPUTS/OUTPUTS toggle rows with the `+ Add` button, and a docked Oscilloscope and Multimeter in the stack.
:::

## Show or hide an instrument

Each icon in the **INPUTS / OUTPUTS** header rows toggles one instrument's
visibility. A lit toggle means that instrument is shown in the dock; click it to
hide it (and again to bring it back). Instruments your **active file** declares
as in use carry a small accent dot, so the ones your code touches stand out.

Hiding an instrument does not forget it — its window and settings are remembered,
the toggle just controls whether it is on screen.

### Find one with the Add palette

Not every instrument has a header toggle visible at once. Click **`+ Add`** to
open the searchable catalogue: every instrument grouped under **INPUTS** and
**OUTPUTS**, each with an icon, name and one-line description. Type in the search
box to filter by name or description, then click an entry to show it and close
the palette. Entries already on screen read as **shown**; ones your file uses
read as **in use**.

:::{admonition} Screenshot needed — `use-instruments-add-palette`
:class: screenshot
What to capture: the `+ Add instrument` palette open over the dock, with the search box at the top and the INPUTS/OUTPUTS grouped list of instruments (showing the "shown" and "in use" badges).
:::

## Open a scope or meter from the Board View

The Oscilloscope and Multimeter are tied to a specific pin, so you open them from
the pin's node in the [Board View](board-view):

1. Open the Board View and let it parse your program's pins.
2. On a **PWM** node, click the small **scope** launcher next to its value to
   open an **Oscilloscope** for that pin.
3. On an **ADC** node, click the **meter** launcher to open a **Multimeter** for
   that pin.

The launcher carries the full parsed connection (pin, variable, constructor) to
the main window, which adds the instrument, docks it, makes its kind visible, and
opens the dock — so the new scope/meter reliably appears in the dock even if the
editor is showing a different file.

```{tip}
A scope only renders a **PWM** connection and a meter only an **ADC** one. Use
the green **source pill** dropdown in an instrument's title bar to retarget it to
another matching pin without re-launching.
```

## Dock vs float a window

Every scope/meter window has a **dock-to-side** key in its title bar (the small
panel icon, between the LIVE control and the ✕):

- **Docked** is the default — the window sits in the dock stack. Click the key
  (tooltip *Float as overlay*) to undock it.
- **Floating** windows live on a layer over the *whole* window, above the panels.
  Drag one by the grip on the left of its title bar; it stays clamped so the
  title bar and ✕ never leave the screen. Stacked floats cascade so each title
  bar is visible. Click the key again (tooltip *Dock to side*) to redock it.

Hiding the dock with the toolbar Instruments button also hides any floating
windows; their positions are kept and return when you reveal the dock again.

```{note}
The robotics singleton panels (LED, button, buzzer, range, IMU, encoder, I²C
display, Wi-Fi/Bluetooth/I²C scanners, gamepad) can also be docked or floated the
same way. See [Use device instruments](device-instruments).
```

## Close vs hide

The **✕** key on an instrument **hides** it rather than deleting it: the window's
kind visibility turns off and the instrument is returned to the dock, ready to
reappear. To bring it back, click its header toggle (or re-open it from the Board
View). This is the same close-then-restore model the Plotter's ✕ uses.

## The live-poll warning

Scope and Multimeter windows carry a **LIVE** toggle in their title bar. This is
a single **global** switch for all instruments, and it is **off by default**.

- **LIVE off** — instruments show their static / telemetry readings. Nothing
  touches the board's REPL.
- **LIVE on** — while a board is connected and at least one scope/meter is open,
  Snakie polls the device over the raw REPL roughly every 0.8 s to read each pin.
  **This interrupts a running program on every poll.**

When live polling is active, the status bar (bottom-left) shows a warning —
**"Live polling is interrupting the board"** with a **Stop** button that turns
the global poll off. The warning appears only while polling is genuinely
happening: LIVE on, **and** a board connected, **and** at least one scope/meter
open.

:::{admonition} Screenshot needed — `use-instruments-live-warning`
:class: screenshot
What to capture: the status bar at the bottom of the window showing the "Live polling is interrupting the board" warning with its Stop button, alongside the connected-device indicator.
:::

```{tip}
You usually don't need LIVE at all. If your program **prints** telemetry with the
on-device helpers, the Plotter, Oscilloscope and Multimeter update live from the
serial stream **without** entering the REPL — so they work inside a `while True:`
loop and never interrupt it. See [Use device instruments](device-instruments) and
the [Telemetry API](../reference/telemetry-api).
```

## See also

- [Use the Board View](board-view) — where you launch a scope/meter from a pin.
- [Use device instruments](device-instruments) — the robotics panels and the
  telemetry/control channels that feed them.
- [REPL and Plotter](repl-and-plotter) — the Plotter and serial output.
- [Run and stop programs](run-and-stop) — stopping a program the live poll
  interrupted.
- [Instruments reference](../reference/instruments) and
  [Telemetry design](../explanation/telemetry-design).
