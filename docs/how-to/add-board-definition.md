# Add your own board

The Board View ships with a handful of built-in boards (Raspberry Pi Pico 2 W,
Pimoroni Pico Plus 2, Tiny 2040, Tiny 2350, ESP32 DevKit). When you use a board
that isn't one of them, author your own: a board in Snakie is just a part whose
**Family** is **Microcontroller**. Author it in the Part Editor, save it, and it
shows up in the board picker.

This page covers the fast route (the Part Editor) and an alternative for people
who'd rather hand-write a JSON file.

```{tip}
New to authoring parts? Walk through [Author a part](../tutorials/author-a-part)
first — a board uses the same editor, you just tick one extra box.
```

## Route A — author it in the Part Editor (recommended)

### 1. Open a new board in the editor

1. Open the **Board View** window (the board button in the main toolbar).
2. In the Board View title bar, click the **pencil / create** button
   (*"New board (opens the Part Editor)"*). This opens the Part Editor on a
   starter board called **My Board**, already saved into your **My Parts**
   library with **Family = Microcontroller**.

```{note}
Starting from the Parts Library instead? Click **+ New part**, then set the
Family yourself in the next step.
```

### 2. Mark it as a board

In the editor's **Details** panel (top-right), confirm the part is flagged as a
board:

- Set **Family** to `Microcontroller`, **or**
- Tick **"This part is a microcontroller board — it appears in the Board
  Viewer's board selector."**

This is the single thing that puts a part in the board picker. Without it, the
part stays an ordinary library part.

:::{admonition} Screenshot needed — `add-board-definition-family-checkbox`
:class: screenshot
What to capture: the Part Editor's Details panel with Family set to
"Microcontroller" and the "This part is a microcontroller board" checkbox ticked.
:::

### 3. Give it a name and pins

- **Name** — what the picker shows (e.g. *Seeed XIAO RP2040*).
- **Pins** — add a pin for every broken-out pad. For each one set its **type**
  (IO · power · ground · other). For an **IO** pad, give it a **GPIO number** and
  a **name/label** (the silk text such as `GP0`, `IO34`, `A0`).

Only **IO** pads with a GPIO number get wired and highlighted in the live view.
Power and ground pads are drawn but never wired. See
[Author a part](../tutorials/author-a-part) for the full pin/canvas workflow.

```{important}
A board only appears in the picker once it has **at least one pad**. A part with
zero pins is skipped.
```

### 4. Save

Click **Save**. The part is written to your library on disk:

```text
<userData>/parts/<libraryId>/<partId>/parts.yml   # + image.png|jpg|svg
```

The default target is your local **My Parts** library (`my-parts`), created
automatically on first save.

### 5. Pick it in the Board View

Open the board selector (the board-name dropdown in the Board View title bar) and
choose your board. Snakie rebuilds the board list from your installed libraries,
so your new board appears alongside the built-ins.

```{figure} /_static/screenshots/add-board-definition-board-picker.png
:alt: the Board View title-bar board selector dropdown open, showing a user-authored board listed among the built-in boards.
:width: 100%

the Board View title-bar board selector dropdown open, showing a user-authored board listed among the built-in boards.
```

```{tip}
If you don't see it immediately, close and re-open the Board View — the picker
re-reads the libraries each time the window opens.
```

## Route B — drop a JSON board file

If you'd rather not use the editor, a board can also be a single JSON file
matching the `BoardDefinition` schema.

1. In the Board View title bar, click the **📁 boards folder** button. It creates
   the folder if needed and reveals it in your file manager.
2. Save a `<id>.json` file there. The `id` becomes the file's identity and the
   key the selector remembers, so keep it unique and stable.
3. Re-open the Board View — the board appears in the picker. Malformed JSON is
   skipped, so a typo in one file won't break the others.

The boards folder is:

```text
<userData>/boards/<id>.json
```

`<userData>` is Snakie's per-user app-data directory:

| OS      | Path                                       |
| ------- | ------------------------------------------ |
| macOS   | `~/Library/Application Support/Snakie/`     |
| Windows | `%APPDATA%/Snakie/`                         |
| Linux   | `~/.config/Snakie/`                         |

:::{admonition} Screenshot needed — `add-board-definition-boards-folder-button`
:class: screenshot
What to capture: the Board View title bar with the 📁 boards-folder button and the
pencil/create button visible.
:::

A minimal JSON board:

```json
{
  "id": "my-tiny",
  "name": "My Tiny Board",
  "mcu": "RP2040",
  "pcbColor": "#1f3a5f",
  "aspect": 1.2,
  "ledLabel": "LED",
  "headers": [
    {
      "edge": "top",
      "pins": [
        { "label": "5V", "type": "vcc" },
        { "label": "GND", "type": "gnd" },
        { "gpio": 0, "label": "GP0", "type": "gpio" },
        { "gpio": 1, "label": "GP1", "type": "gpio" }
      ]
    }
  ]
}
```

For the full field list (headers, pads, features, image data URLs, coordinate
system) see [Boards & firmware](../reference/boards-and-firmware).

## How the picker decides what to show

The board list is assembled by id, with this priority (highest first):

1. **Microcontroller parts** from your installed libraries (Route A).
2. **JSON boards** in `<userData>/boards/` (Route B).
3. The **built-in** boards.

The first definition to claim an `id` wins. So:

- A library board or JSON file whose `id` matches a built-in (e.g. `pico2w`)
  **replaces** that built-in — handy for correcting or restyling a bundled board.
- Among library parts of the same `id`, the **most complete** pinout (most pads)
  wins, so a full board beats a stub.

```{note}
The board `id`/`name`/`mcu` come straight from the part: its **id** becomes the
board id, its **name** the picker label, and its **Family** (or an explicit MCU
field) the sub-label.
```

## See also

- [Author a part](../tutorials/author-a-part) — the editor workflow in full.
- [Use the Board View](board-view) and [Visualise your wiring](../tutorials/visualise-wiring).
- [Install part drivers](install-part-drivers) — for parts that ship MicroPython libraries.
- [Boards & firmware](../reference/boards-and-firmware) and [parts.yml reference](../reference/parts-yml).
- [Parts & boards model](../explanation/parts-and-boards-model) and
  [Board pin parsing](../explanation/board-pin-parsing) — how wires are matched to pads.
