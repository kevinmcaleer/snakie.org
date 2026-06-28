# Screenshots to capture

51 screenshot placeholders remain across 26 pages (22 are already captured into `_static/screenshots/` and wired as figures).

Each remaining item is a `:::{admonition} Screenshot needed` block — most need a connected board (connect/REPL/live values/instruments/flashing) or a wired project. Capture into `_static/screenshots/<slug>.png` and replace the admonition with a `{figure}` (see `scripts/capture-screenshots.mjs` for the no-hardware capture harness).

## `explanation/architecture.md`

- [ ] **`architecture-windows`** — the Snakie main window alongside the separate Board View and an instrument window, to illustrate the multi-window architecture.

## `how-to/add-board-definition.md`

- [ ] **`add-board-definition-family-checkbox`** — the Part Editor's Details panel with Family set to "Microcontroller" and the "This part is a microcontroller board" checkbox ticked.
- [ ] **`add-board-definition-boards-folder-button`** — the Board View title bar with the 📁 boards-folder button and the pencil/create button visible.

## `how-to/ai-assist.md`

- [ ] **`ai-assist-chat-panel`** — The Chat panel open with a short conversation, an assistant reply containing a code block with its Apply and Copy buttons, the two context toggles above the composer, and the Provider/Model footer dropdowns.
- [ ] **`ai-assist-ghost-text`** — The Monaco editor mid-edit showing a dimmed ghost-text inline completion suggested after the cursor in a Python file.

## `how-to/connect-device.md`

- [ ] **`connect-device-status-bar`** — The bottom status bar showing a green "Connected · /dev/cu.usbmodem1101" indicator on the left.

## `how-to/device-instruments.md`

- [ ] **`device-instruments-dock-header`** — The instrument dock with the INPUTS / OUTPUTS toggle rows, the ＋ Add palette open showing the searchable catalogue, and one in-use instrument carrying its accent dot.
- [ ] **`device-instruments-gamepad`** — The Gamepad panel showing the virtual stick, the mapped-output bars, and the HOLD TO DRIVE + E-STOP safety buttons.
- [ ] **`device-instruments-range-radar`** — The Range instrument in swept/RADAR mode showing the polar sweep with fading blips, plus the TRIG/ECHO pin selectors and the max-range / units / alert controls.

## `how-to/export-bom-pinouts.md`

- [ ] **`export-bom-pinouts-export-menu`** — The Board View zoom toolbar with the Export menu open, showing the PNG / SVG / PDF items, the separator, and the "BOM (Markdown)" and "Pinouts (Markdown)" items.

## `how-to/flash-firmware.md`

- [ ] **`flash-firmware-dialog`** — The Flash MicroPython firmware modal open with the "Download from MicroPython.org" source selected, showing the Family → Model → Variant → Version dropdowns.
- [ ] **`flash-firmware-microbit-maintenance`** — The flasher with a micro:bit selected and the orange "maintenance mode" warning banner explaining to reconnect without holding reset.
- [ ] **`flash-firmware-update-prompt`** — The status-bar popup reading "MicroPython vX.Y.Z is available (device runs v…)" with the Flash and dismiss (✕) buttons, anchored above the Flash firmware button.

## `how-to/install-packages.md`

- [ ] **`install-packages-installed-stamp`** — A package tag after a successful install, showing the green INSTALLED stamp and the INSTALLED group at the top of the list, with the flash meter updated.

## `how-to/install-part-drivers.md`

- [ ] **`install-part-drivers-banner`** — The Board View in wiring mode with the driver-install banner at the top showing one part that needs a driver, its `→ lib/...` target, and the enabled "Install drivers" button (board connected).

## `how-to/manage-files.md`

- [ ] **`manage-files-panel-overview`** — The Files sidebar with the Local files tree (top) populated, the transfer bridge in the middle, and the Device files tree (bottom) showing a connected board's root.
- [ ] **`manage-files-device-context-menu`** — Right-click context menu open on a file in the Device files tree, showing Open, Download to computer, Rename, and Delete.

## `how-to/plugins.md`

- [ ] **`plugins-no-python`** — The Plugins panel "Python not found" state showing the install prompt and the `pip install snakie` code line.
- [ ] **`plugins-run-command`** — An expanded mounted module (e.g. Hello) showing its commands with RUN buttons and a resulting info notice in the panel's output area.

## `how-to/repl-and-plotter.md`

- [ ] **`repl-and-plotter-plotter`** — The Plotter in the instrument dock graphing two live traces, with the on-screen legend, the `N samples · M Hz` readout, and the metal CLEAR key visible.

## `how-to/update-snakie.md`

- [ ] **`update-snakie-notifier-available`** — the bottom-right notifier toast in its "Update available" state showing the version and the blue Download button, with the editor visible behind it.
- [ ] **`update-snakie-statusbar-update`** — the status bar's right-hand version slot showing the "⬆ Update to vX.Y.Z" button.
- [ ] **`update-snakie-check-dialog`** — the native "Update Available" dialog from a manual check, showing the available version and the Download / Later buttons.

## `how-to/use-instruments.md`

- [ ] **`use-instruments-dock-open`** — the main window with the Instrument Dock open on the right, showing the mini board view, the INPUTS/OUTPUTS toggle rows with the `+ Add` button, and a docked Oscilloscope and Multimeter in the stack.
- [ ] **`use-instruments-add-palette`** — the `+ Add instrument` palette open over the dock, with the search box at the top and the INPUTS/OUTPUTS grouped list of instruments (showing the "shown" and "in use" badges).
- [ ] **`use-instruments-live-warning`** — the status bar at the bottom of the window showing the "Live polling is interrupting the board" warning with its Stop button, alongside the connected-device indicator.

## `how-to/validate-yaml-json.md`

- [ ] **`validate-yaml-json-squiggle`** — A `robot.yml` (or any YAML) file open in the editor with a red squiggle under a syntax error and the hover tooltip showing the "Invalid YAML: ..." message with its line/column.
- [ ] **`validate-yaml-json-problems`** — The Problems panel listing a JSON parse error row (✕, line:column, message, "json" source) with the "Fix / Format JSON" button visible in the toolbar above the list.

## `how-to/version-control.md`

- [ ] **`version-control-diff-view`** — The inline unified diff open for a modified file, showing green added lines and red removed lines with the file path in the diff header.

## `reference/parts-yml.md`

- [ ] **`parts-yml-editor-inspector`** — the Part Editor with a pin selected, showing its inspector fields (name, type, GPIO number, capabilities checkboxes, pad shape) next to the laid-out part — illustrating the visual fields that map to this schema.

## `reference/plugin-api.md`

- [ ] **`plugin-api-linter-squiggle`** — the editor showing a plugin-produced squiggle (e.g. the lint_demo "Trailing whitespace" warning) with its lightbulb quick-fix menu open.

## `reference/robot-yml.md`

- [ ] **`robot-yml-connections-table`** — the Board View connections table beneath the canvas, showing the from/to/net/colour columns and the colour swatch for one signal wire — the same data that lives in `connections[]`.

## `reference/telemetry-api.md`

- [ ] **`telemetry-api-instruments-live`** — The Oscilloscope, Multimeter and Plotter windows updating live from a running program that calls `inst.scope`/`inst.meter`/`inst.plot`, with no LIVE toggle enabled.

## `tutorials/author-a-part.md`

- [ ] **`author-a-part-new-part-button`** — The Parts Library view with the "+ New part" button in its toolbar highlighted, before the editor opens.
- [ ] **`author-a-part-pin-inspector`** — A pin selected on the breadboard canvas with the Inspector showing its Name, Type, GPIO, capabilities checkboxes and Pad shape selector.
- [ ] **`author-a-part-layered-canvas`** — The Breadboard view with a board image, several placed pins, a mounting hole, and a shape/label, plus the Layers panel on the right showing the Components, Pins, Mounting holes, PCB and Image layers.

## `tutorials/build-a-robot.md`

- [ ] **`build-a-robot-breadboard-empty`** — The Board View window on the **Breadboard** tab with a Raspberry Pi Pico 2 W selected and no parts placed yet, showing the three view-type tabs at top-left and the empty dark canvas.
- [ ] **`build-a-robot-part-placed`** — The Breadboard canvas with the Pico on the left and a VL53L0X sensor placed to its right, the sensor selected so its rotate/rename/duplicate/delete mini-toolbar is visible, and the Library dock open on the right.
- [ ] **`build-a-robot-wired-noodles`** — The Breadboard canvas with a red VIN→3V3 wire, a white GND→GND wire, and two coloured signal noodles (SDA→GP4, SCL→GP5) running between the sensor and the Pico.
- [ ] **`build-a-robot-schematic`** — The Schematic tab showing the Pico as an IC block with power on top and a single GND at the bottom, the VL53L0X symbol, and orthogonal right-angle wires routed between them.

## `tutorials/first-program.md`

- [ ] **`first-program-run-button`** — The top toolbar with the green Run button and the red Stop/Reset button, with a device shown as connected.
- [ ] **`first-program-shell-output`** — The bottom Shell panel on its Console view showing several "blink N" lines printed by the running program.
- [ ] **`first-program-plotter`** — The instrument dock Plotter showing two smooth scrolling sine/cosine traces with the "series 1 / series 2" legend and the samples/Hz readout.

## `tutorials/getting-started.md`

- [ ] **`getting-started-connection-control`** — The Shell panel header with the serial-port dropdown open showing a connected board, the ⟳ refresh button, and the Connect/Disconnect button.
- [ ] **`getting-started-repl-banner`** — The Shell Console showing the MicroPython boot banner and the `>>>` REPL prompt just after connecting.
- [ ] **`getting-started-run-blink`** — The editor with `blink.py` open and the toolbar's green Run button, with the Console showing the program running.

## `tutorials/live-instruments.md`

- [ ] **`live-instruments-install-banner`** — the manila "instrument library isn't on your board" banner pinned across the top of the Snakie window, with the gold "Download & install" key visible.
- [ ] **`live-instruments-dock`** — the Instrument Dock on the right of Snakie showing the Oscilloscope (live waveform), Multimeter (a voltage reading + bargraph) and Plotter (a scrolling trace) all updating from a running program.
- [ ] **`live-instruments-float`** — a single instrument (e.g. the Oscilloscope) floated as a movable window over the code editor, away from the dock rail.

## `tutorials/visualise-wiring.md`

- [ ] **`visualise-wiring-open-button`** — the main editor's mini board preview panel with the cursor over its "Open the full Board Viewer" diagonal-arrow button.
- [ ] **`visualise-wiring-live-values`** — the node-graph with LIVE toggled on (green LED lit) and live pin values shown on the node cards for a connected board.
