# Screenshots to capture

Auto-generated checklist of every screenshot placeholder in the docs (73 across 32 pages). Each corresponds to a `:::{admonition} Screenshot needed` block on the page listed.

**For the screenshot agent:** capture each shot, save it to `_static/screenshots/<slug>.png`, then replace that page’s placeholder admonition with a `{figure}` directive pointing at it. Tick each off as done.

## `explanation/architecture.md`

- [ ] **`architecture-windows`** — the Snakie main window alongside the separate Board View and an instrument window, to illustrate the multi-window architecture.

## `how-to/add-board-definition.md`

- [ ] **`add-board-definition-family-checkbox`** — the Part Editor's Details panel with Family set to "Microcontroller" and the "This part is a microcontroller board" checkbox ticked.
- [ ] **`add-board-definition-board-picker`** — the Board View title-bar board selector dropdown open, showing a user-authored board listed among the built-in boards.
- [ ] **`add-board-definition-boards-folder-button`** — the Board View title bar with the 📁 boards-folder button and the pencil/create button visible.

## `how-to/ai-assist.md`

- [ ] **`ai-assist-chat-settings`** — The Settings dialog open on the Chat tab, showing the Provider dropdown, the API key field with Save key / Remove / Get a key buttons, and the Autocomplete toggle below.
- [ ] **`ai-assist-chat-panel`** — The Chat panel open with a short conversation, an assistant reply containing a code block with its Apply and Copy buttons, the two context toggles above the composer, and the Provider/Model footer dropdowns.
- [ ] **`ai-assist-ghost-text`** — The Monaco editor mid-edit showing a dimmed ghost-text inline completion suggested after the cursor in a Python file.

## `how-to/board-view.md`

- [ ] **`board-view-window`** — The Board View open as its own OS window beside the main editor, showing the styled title bar (drag grip, BOARD VIEW label, view tabs, board picker, MCU chip) above the board drawing.
- [ ] **`board-view-tabs`** — Close-up of the title-bar tabs (Node graph / Breadboard / Schematic) with one selected, alongside the board picker dropdown and the MCU chip badge.
- [ ] **`board-view-controls`** — The node-graph canvas with the floating control cluster visible (zoom −, the 100%/fit toggle, +, fit, rotate, and the export button with its format dropdown).

## `how-to/connect-device.md`

- [ ] **`connect-device-shell-header`** — The Shell panel header showing the port dropdown (with at least one device listed), the refresh button, and the green Connect button, all disconnected.
- [ ] **`connect-device-status-bar`** — The bottom status bar showing a green "Connected · /dev/cu.usbmodem1101" indicator on the left.

## `how-to/device-instruments.md`

- [ ] **`device-instruments-dock-header`** — The instrument dock with the INPUTS / OUTPUTS toggle rows, the ＋ Add palette open showing the searchable catalogue, and one in-use instrument carrying its accent dot.
- [ ] **`device-instruments-gamepad`** — The Gamepad panel showing the virtual stick, the mapped-output bars, and the HOLD TO DRIVE + E-STOP safety buttons.
- [ ] **`device-instruments-range-radar`** — The Range instrument in swept/RADAR mode showing the polar sweep with fading blips, plus the TRIG/ECHO pin selectors and the max-range / units / alert controls.

## `how-to/export-bom-pinouts.md`

- [ ] **`export-bom-pinouts-export-menu`** — The Board View zoom toolbar with the Export menu open, showing the PNG / SVG / PDF items, the separator, and the "BOM (Markdown)" and "Pinouts (Markdown)" items.

## `how-to/find-replace.md`

- [ ] **`find-replace-window`** — the floating Find & Replace window open above the editor, with a query typed in the Find box and the live match count line showing "3 of 12 matches".

## `how-to/flash-firmware.md`

- [ ] **`flash-firmware-dialog`** — The Flash MicroPython firmware modal open with the "Download from MicroPython.org" source selected, showing the Family → Model → Variant → Version dropdowns.
- [ ] **`flash-firmware-microbit-maintenance`** — The flasher with a micro:bit selected and the orange "maintenance mode" warning banner explaining to reconnect without holding reset.
- [ ] **`flash-firmware-update-prompt`** — The status-bar popup reading "MicroPython vX.Y.Z is available (device runs v…)" with the Flash and dismiss (✕) buttons, anchored above the Flash firmware button.

## `how-to/install-packages.md`

- [ ] **`install-packages-panel`** — The Packages view with the Packages tab active, showing the flash-usage meter under the header, the search box, and the manila-tag REGISTRY list of curated libraries.
- [ ] **`install-packages-installed-stamp`** — A package tag after a successful install, showing the green INSTALLED stamp and the INSTALLED group at the top of the list, with the flash meter updated.

## `how-to/install-part-drivers.md`

- [ ] **`install-part-drivers-banner`** — The Board View in wiring mode with the driver-install banner at the top showing one part that needs a driver, its `→ lib/...` target, and the enabled "Install drivers" button (board connected).

## `how-to/manage-files.md`

- [ ] **`manage-files-panel-overview`** — The Files sidebar with the Local files tree (top) populated, the transfer bridge in the middle, and the Device files tree (bottom) showing a connected board's root.
- [ ] **`manage-files-device-context-menu`** — Right-click context menu open on a file in the Device files tree, showing Open, Download to computer, Rename, and Delete.

## `how-to/plugins.md`

- [ ] **`plugins-rack-overview`** — The Plugins panel open in the activity bar, showing the "PLUGIN RACK" header and at least one MOUNTED module (lit green LED) such as the bundled Hello plugin.
- [ ] **`plugins-no-python`** — The Plugins panel "Python not found" state showing the install prompt and the `pip install snakie` code line.
- [ ] **`plugins-run-command`** — An expanded mounted module (e.g. Hello) showing its commands with RUN buttons and a resulting info notice in the panel's output area.

## `how-to/repl-and-plotter.md`

- [ ] **`repl-and-plotter-console`** — The Shell region with the Console view active, showing the `>>>` prompt and a couple of evaluated expressions, plus the Console/Problems toggle and the connection control in the header.
- [ ] **`repl-and-plotter-plotter`** — The Plotter in the instrument dock graphing two live traces, with the on-screen legend, the `N samples · M Hz` readout, and the metal CLEAR key visible.

## `how-to/run-and-stop.md`

- [ ] **`run-and-stop-run-button`** — The top toolbar with the green ▶ Run button and the red Stop / Reset button, with a connected board, and the Shell console below showing live program output.

## `how-to/settings-and-themes.md`

- [ ] **`settings-and-themes-theme-knob`** — The toolbar with the sun/moon theme knob highlighted, shown once in the light Skeuomorph skin and once in the dark skin.
- [ ] **`settings-and-themes-editor-tab`** — The Settings dialog open on the Editor tab, showing the Notebook paper segmented control, the Line spacing slider, the Editor theme selector, and the firmware-updates checkbox.
- [ ] **`settings-and-themes-chat-tab`** — The Settings dialog open on the Chat tab, showing the Provider dropdown, the API key field with Save/Remove/Get a key buttons, and the Autocomplete toggle.

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

- [ ] **`version-control-panel-overview`** — The Source Control panel open on a repo with changes, showing the branch toolbar at top, the commit message box, and the Staged / Changes / Untracked groups populated.
- [ ] **`version-control-diff-view`** — The inline unified diff open for a modified file, showing green added lines and red removed lines with the file path in the diff header.

## `reference/boards-and-firmware.md`

- [ ] **`boards-and-firmware-board-selector`** — The Board View selector dropdown expanded, listing all five built-in boards (Pico 2 W, Pico Plus 2, Tiny 2040, Tiny 2350, ESP32 DevKit) with the Pico 2 W rendered behind it.

## `reference/parts-yml.md`

- [ ] **`parts-yml-editor-inspector`** — the Part Editor with a pin selected, showing its inspector fields (name, type, GPIO number, capabilities checkboxes, pad shape) next to the laid-out part — illustrating the visual fields that map to this schema.

## `reference/plugin-api.md`

- [ ] **`plugin-api-linter-squiggle`** — the editor showing a plugin-produced squiggle (e.g. the lint_demo "Trailing whitespace" warning) with its lightbulb quick-fix menu open.
- [ ] **`plugin-api-plugins-view`** — the Plugins activity-bar view listing the discovered plugins and their commands with Run buttons, and the Reload action.

## `reference/robot-yml.md`

- [ ] **`robot-yml-connections-table`** — the Board View connections table beneath the canvas, showing the from/to/net/colour columns and the colour swatch for one signal wire — the same data that lives in `connections[]`.

## `reference/telemetry-api.md`

- [ ] **`telemetry-api-instruments-live`** — The Oscilloscope, Multimeter and Plotter windows updating live from a running program that calls `inst.scope`/`inst.meter`/`inst.plot`, with no LIVE toggle enabled.

## `reference/ui-overview.md`

- [ ] **`ui-overview-full-window`** — The full Snakie main window in the Skeuomorph theme with a Python file open, the Files sidebar showing, the Shell console at the bottom, and the status bar visible — annotated regions optional.
- [ ] **`ui-overview-board-window`** — The separate Board View window in node-graph mode showing a parsed board with connection nodes, sitting alongside the main Snakie window.

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

- [ ] **`first-program-new-tab`** — The centre editor with a fresh `untitled-1.py` tab open and the cursor in an empty buffer, the New file button visible in the top toolbar.
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
- [ ] **`visualise-wiring-node-graph`** — the Board View node-graph showing the four example nodes (led/button/buzzer/display) with coloured noodle wires reaching the Pico pads, including the I2C bus reaching two pads.
- [ ] **`visualise-wiring-board-picker`** — the Board View board picker dropdown open in the title bar, listing the built-in boards with one highlighted.
- [ ] **`visualise-wiring-live-values`** — the node-graph with LIVE toggled on (green LED lit) and live pin values shown on the node cards for a connected board.
