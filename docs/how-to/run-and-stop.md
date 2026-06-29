# Run and stop code

Run the file you are editing on a connected board, stop a runaway program, and
reset the board between runs — all from the two big buttons in the top toolbar.

```{note}
This page assumes you have already
[connected a device](connect-device). The **Run** and **Stop / Reset** buttons
are disabled until a board is connected.
```

## Run the active file

1. Open or switch to the file you want to run so it is the active editor tab.
2. Make sure a device is connected (check the status bar at the bottom of the
   window).
3. Click **▶ Run** in the top toolbar.

Snakie streams the current file to the board and runs it. The program's output
(`print()`, tracebacks, anything it writes to stdout) appears live in the
**Shell** console at the bottom of the window — see
[REPL and Plotter](repl-and-plotter).

```{tip}
**Run** sends whatever is in the editor right now — you do **not** have to save
the file or copy it to the device first. It runs the in-editor text directly.
```

Under the hood, Run feeds your file to the board in MicroPython's *paste mode*,
which is why the output streams straight into the Shell instead of being captured
silently. (The background device layer — live pin values, file transfers — uses
the machine-friendly raw-REPL protocol; see
[Architecture](../explanation/architecture).)

```{figure} /_static/screenshots/run-and-stop-run-button.png
:alt: The top toolbar with the green ▶ Run button and the red Stop / Reset button, with a connected board, and the Shell co…
:width: 100%

The top toolbar with the green ▶ Run button and the red Stop / Reset button, with a connected board, and the Shell console below showing live program output.
```

### When Run is disabled

The **Run** button is greyed out unless **both** conditions are met. Hover it to
see why:

| State | Run button tooltip |
| --- | --- |
| No device connected | "Connect to a device to run" |
| Connected, no file open | "Open a file to run" |
| Connected, file open | "Run *filename* on the device" |

## Stop a running program

While a program is running, the red toolbar button reads **■ Stop**.

- Click **■ Stop** to interrupt the program. This sends a `KeyboardInterrupt`
  (Ctrl-C) to the board, the same as pressing Ctrl-C at the REPL.

Use this to break out of an infinite loop or halt long-running code. After
stopping, the board returns to the interactive prompt and the button switches
back to **Reset**.

```{tip}
You can also press **Ctrl-C** directly in the [Shell](repl-and-plotter) to
interrupt a program, exactly as you would in a terminal REPL.
```

## Reset the board

When nothing is running, the same red button reads **⟳ Reset**.

- Click **⟳ Reset** to soft-reset the board. This sends Ctrl-D at the prompt,
  triggering a soft reboot that clears all variables, imported modules and pin
  state — a quick way to get back to a clean slate without unplugging anything.

```{important}
A soft reset re-runs the board's startup files (`boot.py` and `main.py`) if they
exist on the device, just like power-cycling it. It does **not** erase files from
the board's filesystem.
```

So the single red button is dual-purpose, and its label tells you what it will
do:

| Button label | When it shows | What clicking it does |
| --- | --- | --- |
| **■ Stop** | A program started with **Run** is still running | Interrupts it (Ctrl-C) |
| **⟳ Reset** | Nothing is running | Soft-resets the board (Ctrl-D) |

```{note}
Both **Run** and **Stop / Reset** are disabled while no device is connected.
```

## Related

- [Connect a device](connect-device) — get a board attached first.
- [REPL and Plotter](repl-and-plotter) — read output and type commands interactively.
- [Manage files](manage-files) — copy your script to the board so it runs on boot.
- [Keyboard shortcuts](../reference/keyboard-shortcuts) — the full shortcut list.
