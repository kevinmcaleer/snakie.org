# Connect to a device

This page shows you how to attach Snakie to a MicroPython board over USB serial:
choose a port, connect, read the live status, and disconnect again. If the board
isn't showing up or won't open, jump to [Troubleshooting](#troubleshooting).

Snakie talks to **one board at a time** over the serial (raw-REPL) protocol at
**115200 baud**. There's nothing to configure beyond picking the right port.

## Where the connection control lives

The connect/disconnect control sits in the header of the **Shell** panel at the
bottom of the window — the same panel that hosts the REPL console. It has three
pieces:

| Element | What it does |
| --- | --- |
| **Port dropdown** | Lists every serial port the OS can see. Each entry shows the port path, plus a friendly name or manufacturer when the OS reports one (e.g. `/dev/cu.usbmodem1101 — Raspberry Pi Pico`). |
| **Refresh button** (`⟳`) | Re-scans for ports. Shown only while disconnected. |
| **Connect / Disconnect button** | Opens or closes the connection. Its label and colour follow the live state. |

:::{admonition} Screenshot needed — `connect-device-shell-header`
:class: screenshot
What to capture: The Shell panel header showing the port dropdown (with at least one device listed), the refresh button, and the green Connect button, all disconnected.
:::

## Connect

1. Plug your board into a USB port with a **data-capable** cable.
2. Open the **port dropdown** in the Shell header and pick your board's port.
   - macOS: typically `/dev/cu.usbmodem…` (RP2040/native USB) or
     `/dev/cu.usbserial…` (CP210x/CH340 USB-serial chips).
   - Linux: `/dev/ttyACM0` (native USB) or `/dev/ttyUSB0` (USB-serial).
   - Windows: `COM3`, `COM4`, etc.
3. Click **Connect**.

While the connection opens, the button reads **Connecting…** and is disabled.
Once it succeeds the button turns red and reads **Disconnect**, and the port
dropdown locks to the active port.

:::{tip}
If the dropdown is empty or your board isn't listed, click the **`⟳` refresh**
button — ports are scanned when the panel mounts, so a board plugged in
afterwards won't appear until you refresh.
:::

```{note}
Snakie connects at **115200 baud**, the MicroPython convention. There is no baud
selector in the UI; if your board uses a non-standard rate you'll need a board
running standard MicroPython firmware. See
[Flash firmware](flash-firmware) and
[Boards & firmware](../reference/boards-and-firmware).
```

## Read the connection status

The **status bar** at the very bottom of the window always shows the live
connection state on the left, with a coloured status dot:

| Status bar text | Meaning |
| --- | --- |
| **Disconnected** | No board attached. |
| **Connecting…** | The port is being opened. |
| **Connected · `/dev/cu.usbmodem1101`** | Open and ready; the active port is shown after the dot. |
| **Error** | The last connect or the open serial port failed. Hover the item to read the message (`Connection error: …`). |

The status updates from the device layer itself, so every part of the UI (the
Shell control and the status bar) stays in sync — connecting from one place
updates them all.

:::{admonition} Screenshot needed — `connect-device-status-bar`
:class: screenshot
What to capture: The bottom status bar showing a green "Connected · /dev/cu.usbmodem1101" indicator on the left.
:::

Once connected you can use the [REPL and Plotter](repl-and-plotter),
[Run & stop](run-and-stop) your program, and [manage files](manage-files) on the
board.

## Disconnect

Click **Disconnect**. Snakie closes the serial port and the status bar returns
to **Disconnected**. The port is then free for other tools (or for a fresh
connect after a replug).

```{note}
If you unplug the board while connected, Snakie detects the closed port and
drops back to **Disconnected** on its own — no need to click Disconnect first.
```

## Troubleshooting

### The port isn't listed

- Click **`⟳` refresh** — newly plugged boards aren't picked up automatically.
- Check the **cable**: charge-only USB cables have no data lines and the board
  will never enumerate as a serial port. Try a known-good data cable.
- Make sure the board is running **MicroPython firmware**, not sitting in
  bootloader/UF2 mass-storage mode. A board in bootloader mode appears as a USB
  drive, not a serial port — flash firmware first
  (see [Flash firmware](flash-firmware)).
- Some ESP32/ESP8266 boards use a **CP210x** or **CH340** USB-serial chip that
  needs a vendor driver on macOS/Windows. Install the driver, replug, then
  refresh.
- Linux: your user may need to be in the **`dialout`** (or `uucp`) group to see
  and open `/dev/ttyACM*` / `/dev/ttyUSB*`. Add yourself, then log out and back
  in.

### Connect fails with a "busy" / "access denied" error

The port is held open by another program. Serial ports are exclusive — only one
app can own a port at a time.

- Close any other serial tool that might hold it: **Thonny**, the Arduino Serial
  Monitor, `screen`/`minicom`/`picocom`, another Snakie window, or a previous
  session that didn't release the port.
- If nothing obvious holds it, **replug** the board and click refresh, then
  connect again.

### Connect fails or shows "Error"

- Hover the status bar's connection item to read the exact message
  (`Connection error: …`).
- **Replug** the board and refresh the port list — a half-asleep USB device or a
  stale port handle often clears on a fresh enumeration.
- If the device connects but the REPL is unresponsive, try
  [Run & stop](run-and-stop) (Stop sends an interrupt and soft-resets the board).

### It connected, but I see nothing in the console

That's expected when a program is already running or the board is idle. Press
**Enter** in the [REPL](repl-and-plotter) to get a `>>>` prompt, or use
[Run & stop](run-and-stop) to interrupt a running program.

## See also

- [Run & stop](run-and-stop) — execute and halt your program
- [REPL & Plotter](repl-and-plotter) — the interactive shell
- [Manage files](manage-files) — browse and edit files on the board
- [Flash firmware](flash-firmware) — get MicroPython onto a fresh board
- [Boards & firmware](../reference/boards-and-firmware) — supported boards
- [UI overview](../reference/ui-overview) — where everything is
