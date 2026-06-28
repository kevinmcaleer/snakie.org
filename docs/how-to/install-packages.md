# Install MicroPython packages

Add MicroPython libraries to your board from inside Snakie. The **Packages**
view runs MicroPython's `mip` installer on the connected device, so libraries
land in the board's flash and are importable straight away — no extra app, no
manual file copying.

```{note}
Installs run **on the board**, so you need a connected device first. You can
still search and browse libraries while disconnected — only the install action
is gated. See [Connect a device](connect-device).
```

## Open the Packages view

Click the **Packages** icon in the activity bar. The view has two tabs:

- **Packages** — install general MicroPython libraries by name with `mip`/PyPI.
- **Modules** — install only the per-instrument device drivers a robot needs
  (covered in [Install part drivers](install-part-drivers)).

This page covers the **Packages** tab.

```{figure} /_static/screenshots/install-packages-panel.png
:alt: The Packages view with the Packages tab active, showing the flash-usage meter under the header, the search box, and t…
:width: 100%

The Packages view with the Packages tab active, showing the flash-usage meter under the header, the search box, and the manila-tag REGISTRY list of curated libraries.
```

## Install a library by name

1. Connect your board.
2. In the Packages tab, type a name into **Search packages…** and press
   **Search** (or Enter).
3. Snakie shows matching tags. Curated libraries match instantly; Snakie also
   probes PyPI for the exact name and the `micropython-<name>` variant.
4. On the package's tag, click **INSTALL**. The button shows **INSTALLING…**,
   then a green **INSTALLED** stamp when `mip` reports success.

If you don't search, the tab lists a curated set of popular libraries you can
install with one click.

```{tip}
Press **Clear** next to the search box to drop your results and return to the
curated list.
```

### Curated starter libraries

These ship with Snakie so the tab is useful even offline:

| Name | What it's for |
| --- | --- |
| `urequests` | Lightweight HTTP client |
| `umqtt.simple` / `umqtt.robust` | MQTT clients for IoT messaging |
| `microdot` | Tiny async web framework |
| `neopixel` | WS2812 / NeoPixel LED driver |
| `ssd1306` | SSD1306 OLED display driver |
| `bme280` | Bosch BME280 temperature / humidity / pressure |
| `dht` | DHT11 / DHT22 temperature & humidity |
| `aioble` | Async Bluetooth Low Energy helper |
| `logging` | CPython-style logging facility |
| `datetime` / `base64` | Standard-library subsets |

```{note}
Search needs a network connection (PyPI lookups are brokered by the app to get
past the renderer's content-security policy). Offline, search falls back to
matching the curated list only.
```

## Where packages install

`mip` writes packages to the board's **`/lib`** directory by default, which is
on MicroPython's import path — so `import urequests` works immediately after
installing. Browse the installed files under `/lib` with the
[file explorer](manage-files), or try the import in the
[REPL](repl-and-plotter).

The **flash-usage meter** under the header reads `os.statvfs('/')` off the board
and shows `FLASH used / total KB`. It refreshes when you connect and after each
install, so you can watch space go down. When disconnected it shows
`FLASH — / — KB`.

:::{admonition} Screenshot needed — `install-packages-installed-stamp`
:class: screenshot
What to capture: A package tag after a successful install, showing the green INSTALLED stamp and the INSTALLED group at the top of the list, with the flash meter updated.
:::

## Advanced options

Expand **Advanced options** under the search box to change how `mip` runs:

Overwrite existing files
: On by default. `mip.install` replaces existing files anyway, so turning this
  off only surfaces a note — this firmware doesn't expose a true no-overwrite
  mode.

Convert to `.mpy`
: Requests cross-compilation to optimise size/speed. This build has **no
  bundled `mpy-cross`**, so packages always install as source `.py`; Snakie
  shows a note explaining this. Many ports still compile to bytecode on import.

Custom index URL
: Point `mip` at a different package index (passed as `mip.install(...,
  index=...)`). Leave blank to use the default micropython-lib index
  (`https://micropython.org/pi/v2`).

```{warning}
The `.mpy` option does not fail the install — it falls back to installing source
`.py`. If you specifically need compiled bytecode, compile it yourself with
`mpy-cross` and copy the `.mpy` to the board via the
[file explorer](manage-files).
```

## Read the install log and notes

Each tag shows the result inline after an install:

- **Notes** — non-fatal messages, e.g. the `.mpy` caveat or which custom index
  was used.
- **Log** — the device output from `mip`. On failure the tag turns to **RETRY**
  and the log is highlighted; expand it to see the device traceback.

```{tip}
A package that "installed" is tracked **for the current session** — Snakie groups
it under **INSTALLED**. There's no firmware API to list everything already on the
board, so after a restart, confirm a library is present by importing it in the
[REPL](repl-and-plotter) or by looking in `/lib` via the
[file explorer](manage-files).
```

## Installing from a URL or GitHub spec

The Packages tab installs by **name**. To install a driver from a specific
`github:`/`pypi:` spec or URL — for example a sensor driver tied to a part —
use the **Modules** tab or the driver-install prompt instead. See
[Install part drivers](install-part-drivers). Those flows pass the spec straight
to `mip.install`, which understands `github:org/repo/file.py`, `pypi:name`, and
plain URLs.

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| **INSTALL** button is disabled / "Connect a board first" | Connect a device — installs run on the board. See [Connect a device](connect-device). |
| Search returns nothing | The name isn't curated or on PyPI as `name` / `micropython-<name>`. Check spelling, or install the driver via [Modules](install-part-drivers). |
| Search fails or only shows curated hits | You're offline or the network is restricted; PyPI lookups need a connection. |
| Install log shows a traceback | The board may lack network access, be out of flash space (watch the meter), or `mip` couldn't find the package on the index. |
| `import` fails after a successful install | Confirm the file is under `/lib` in the [file explorer](manage-files); some packages import under a different module name than the search name. |

## See also

- [Install part drivers](install-part-drivers) — per-instrument drivers via the Modules tab.
- [Manage files on the device](manage-files) — browse `/lib` and copy files manually.
- [REPL & plotter](repl-and-plotter) — test an `import` after installing.
- [Flash firmware](flash-firmware) — `mip` needs a MicroPython build with networking on the board.
