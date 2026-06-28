# Author your own part

In this tutorial you will draw your own hardware part in Snakie's **Part Editor** and
save it into your personal parts library. Along the way you will name the part, set
its physical size, place pins (with their type, capabilities and pad shape), drop in
a board photo, add mounting holes, decorate it with shapes and text labels, and use
undo to fix a mistake.

**What you will end up with:** a complete, self-contained part saved to your
**My Parts** library that shows up in the Parts Library dock and renders as an
accurate footprint in the [Board View](../how-to/board-view).

```{note}
The Part Editor writes the exact same `parts.yml` (plus an image asset) that the
Parts Library stores on disk, so you never have to hand-edit YAML. If you want to
know what each saved field means afterwards, see the [parts.yml reference](../reference/parts-yml).
```

## Before you start

You will need:

- Snakie installed and running. No board needs to be connected — authoring a part
  is entirely offline.
- A clear photo of the part you want to draw (PNG, JPG or SVG), if you want a
  life-like board image. This is optional.
- The part's real **dimensions in millimetres** and, ideally, its pinout so you can
  label each pin accurately.

## 1. Open the Part Editor

The Part Editor lives inside the Board View.

1. Open the **Board View** window from Snakie's toolbar (the **board** button).
2. In the Board View's title bar, click the **chip** button to enter the
   **Parts Library**.
3. In the Parts Library toolbar, click **+ New part**.

A blank part opens in the editor, which fills the window. The **Saved to** selector
in the title bar already points at **My Parts (your library)** — your personal
library, which Snakie creates automatically the first time you save.

:::{admonition} Screenshot needed — `author-a-part-new-part-button`
:class: screenshot
What to capture: The Parts Library view with the "+ New part" button in its toolbar highlighted, before the editor opens.
:::

The editor has two views, switched with the **Breadboard** / **Schematic** tabs in
the title bar. You will do all the work in **Breadboard** (the default) — an
interactive, layered canvas. The Schematic view is optional and covered at the end.

## 2. Name the part and set its details

The right-hand panel starts with a **Details** section.

1. In **Name**, type the part's name, for example `VL53L0X ToF`.
2. Watch the hint below the field: it shows the filename your part will save as,
   such as `vl53l0x-tof/parts.yml`. Snakie derives a safe id from the name for you.
3. Click **Show** next to the Details heading to expand the catalogue fields, then
   fill in what you know:
   - **Family** — pick or type one (Sensor, Microcontroller, Motor Driver, Display,
     Breakout, Connector…). If this part is a microcontroller board, tick
     **This part is a microcontroller board** so it appears in the Board View's
     board selector.
   - Optional extras: Description, Manufacturer, Tags, Package (THT/SMD),
     Pin spacing (mm), Voltage, Part #, and a **Code library** module/URL.

```{tip}
You can leave most catalogue fields blank for now and come back later — only a
**name** and **at least one pin** are required to save.
```

## 3. Set the board dimensions

Scroll the right-hand panel to the **Board** section and enter the part's real size:

1. Set **Width (mm)** and **Height (mm)** to the part's physical dimensions.
2. Optionally pick a **Background** colour for the PCB and adjust the **Corner
   radius** slider for a rounded rectangle outline.

Setting real millimetre dimensions matters: the editor uses them so that sizes you
type for pins, holes and shapes are shown in true millimetres, and so the part
renders to scale on the board.

## 4. Add pins

Pins live on the **Pins** layer in the Layers panel on the right.

1. In the **Pins** layer row, click the **＋** button (or press the **pin** tool).
   The tool is now armed.
2. **Click on the board** in the canvas to drop a pin where you want it. Repeat for
   each pin.
3. Switch back to the **Select** tool (the arrow in the toolbar) and click a pin to
   edit it. Its fields appear in the **Inspector**:

| Field | What it does |
| --- | --- |
| **Name** | The GPIO / signal name, e.g. `VIN`, `GND`, `SDA`. |
| **Type** | IO · Power · Ground · Other. |
| **Board pin #** | The physical silk pin number, if printed. |
| **GPIO** | The GPIO number (IO pins only). |
| **Capabilities** | For IO pins, tick any of Digital, PWM, ADC, SPI, I²C, UART. |
| **Pad shape** | Square · Round · **Castellated** · **Header hole**. |
| **Rotation** | Rotate the pin's silk label (and the half-hole on castellated pads). |
| **x / y** | The pin's position (you can also just drag it on the canvas). |

```{note}
You can't drop a pin inside a mounting hole. GPIO numbers and capabilities only
apply to **IO** pins — Snakie drops them from power and ground pins when it saves.
```

:::{admonition} Screenshot needed — `author-a-part-pin-inspector`
:class: screenshot
What to capture: A pin selected on the breadboard canvas with the Inspector showing its Name, Type, GPIO, capabilities checkboxes and Pad shape selector.
:::

## 5. Add a board image

A board photo makes the part instantly recognisable. The image sits on the **PCB**
layer, underneath the pins.

1. In the **Board** section of the Layers panel, find the **Image** layer row and
   click **＋ Image**.
2. Choose your photo. Snakie loads it onto the PCB layer and selects it.
3. With the image selected, the Inspector shows the **Image layer** controls. Drag
   the image (or its corners) on the canvas to place and size it, and use:
   - **x / y / w / h** for precise placement.
   - **Opacity** to fade the photo (handy while you line up pins over it).
   - **Lock aspect ratio** to keep the photo from stretching as you resize it.

```{tip}
To check your footprint at any time, click the **eye** on the Image layer to hide
the photo. You then see the footprint view — outline, pads and holes — which should
line up with the real board.
```

## 6. Add mounting holes

Mounting holes cut clean through both the PCB and the image, with a plated ring.

1. In the **Board** section, click **＋** on the **Mounting holes** row (or pick the
   **hole** tool in the toolbar).
2. Click the board where the hole goes.
3. Select the hole and set its **⌀mm** diameter (and fine-tune x/y) in the Inspector.

## 7. Add shapes and text labels

Use shapes and labels to draw connectors, sensors, silk markings — anything that
isn't a pin or hole. These live on the **Components** layer (the top layer).

1. In the toolbar, open the **Shapes ▾** menu and choose **Rectangle**, **Circle**
   or **Polygon**, then click the board to place it.
2. For text, click the **Text** tool, then click where you want the label.
3. Select any shape or label to edit it in the Inspector — fill and outline colour,
   outline width, size, corner radius, plus a label with font size, colour and
   **bold / italic / underline / alignment**.

For a polygon, drag its vertices on the canvas to reshape it; click a vertex to
delete it (a polygon keeps at least 3 points).

```{tip}
Turn on **grid** and **snap** from the view control at the bottom-right of the
canvas to align everything to the part's pin-spacing grid (2.54 mm by default).
```

:::{admonition} Screenshot needed — `author-a-part-layered-canvas`
:class: screenshot
What to capture: The Breadboard view with a board image, several placed pins, a mounting hole, and a shape/label, plus the Layers panel on the right showing the Components, Pins, Mounting holes, PCB and Image layers.
:::

## 8. Made a mistake? Undo it

Every edit — including drags on the canvas — is undoable.

- Press **Ctrl+Z** (**Cmd+Z** on macOS) to undo, **Ctrl+Shift+Z** to redo, or use
  the undo / redo arrows in the toolbar.
- To remove the selected object instead, press **Delete** / **Backspace**, click
  **Delete** in the Inspector, or click the **−** on its layer row.

```{note}
Undo is ignored while you are typing in a text field (so editing a name uses the
field's own native undo). Click on the canvas first, then press Ctrl/Cmd+Z.
```

## 9. Save the part

1. Confirm the **Saved to** selector shows the library you want — leave it on
   **My Parts** for your first part.
2. Click **Save** in the title bar.

Snakie validates the part (it needs a name and at least one pin) and writes it to
disk. A confirmation appears, like `Saved "VL53L0X ToF" to my-parts (v1.0.0)`. If a
part with the same id already exists in that library, Snakie warns you instead of
silently overwriting it — rename the part or open the existing one to edit.

```{important}
Saving is explicit. Clicking **Done** closes the editor and keeps your last save,
but unsaved changes since then are not written — save before you leave.
```

## 10. See it in the dock

Click **Done** to close the editor. Back in the Parts Library, your new part now
appears in the **My Parts** library (badged *Your library*). Select it to inspect
its footprint and pinout, click **Edit** to reopen it in the Part Editor, and place
it on a board in the [Board View](../how-to/board-view) to wire it up.

## Optional: a schematic symbol

Switch to the **Schematic** tab to give your part a clean line-drawing symbol. Each
pin you defined appears in the **pad ↔ pin table**; choose which **side** of the
symbol box it sits on and its **order**. The symbol updates live on the right. If
you skip this, Snakie derives a sensible symbol from your pins automatically.

## What's next

- Place your part and connect it on a board — [Visualise your wiring](visualise-wiring).
- Share a whole library, install community parts, or export a BOM — see
  [Install part drivers](../how-to/install-part-drivers) and
  [Export BOM & pinouts](../how-to/export-bom-pinouts).
- Understand the data behind a part — [parts.yml reference](../reference/parts-yml)
  and [Parts & boards model](../explanation/parts-and-boards-model).
- All the editor shortcuts in one place — [Keyboard shortcuts](../reference/keyboard-shortcuts).
