# Install a part's MicroPython drivers

Many breakout parts need a MicroPython **driver module** on the board before your
code can talk to them. When a placed part declares the driver file(s) it needs,
the [Board View](board-view) shows a consent-first banner that copies them onto
the connected board for you.

This page covers installing drivers as a *user* placing parts. To author the
`drivers:` block on a part you publish, see
[Author a part](../tutorials/author-a-part) and the
[parts.yml reference](../reference/parts-yml).

## Before you start

- A project with at least one part **placed on the breadboard** in the Board
  View (the banner only appears in **wiring mode**).
- A board **connected** over USB — installing writes to the device, so the
  Install action stays disabled until a board is present. See
  [Connect a device](connect-device).

## Install the drivers

1. Open the **Board View** (View → Board View, or ⌘/Ctrl+Shift+B) and switch on
   **wiring mode**.
2. If any placed part declares drivers, a banner appears at the top of the board:
   *"N parts need a driver"*, listing each part, the driver, and where it will
   land (for example `→ lib/vl53l0x.py`).
3. Connect your board if you haven't already. While disconnected the banner reads
   *"Connect a board to install the required driver file(s)"* and the button is
   greyed out.
4. Click **Install drivers**. Each row shows live progress and turns into a
   tick when its file is on the board; the button counts up (`Installing… 1/2`).
5. When every file is in place the banner switches to **Drivers installed — All
   driver files are on the board.**

:::{admonition} Screenshot needed — `install-part-drivers-banner`
:class: screenshot
What to capture: The Board View in wiring mode with the driver-install banner at
the top showing one part that needs a driver, its `→ lib/...` target, and the
enabled "Install drivers" button (board connected).
:::

```{tip}
Nothing is copied to your board until you click **Install drivers** — placing a
part only *lists* what it needs. You can dismiss the banner with the **×** if you
don't want to install right now; it returns next time the set of placed parts
changes.
```

## What gets installed, and how

Each driver row declares a **source** (where the file comes from) and a
**target** (where it goes on the board). Snakie picks the install mechanism from
the source:

| Source looks like | Mechanism | Target means |
| --- | --- | --- |
| `github:user/repo/path`, `gitlab:…`, `pypi:name`, or a bare `micropython-lib` package name | Installed with **mip** | The install **folder** (e.g. `lib`; blank = the device default `/lib`) |
| An `https://…` URL | **Copied** verbatim | The full destination **path** (folder + filename) |
| A bundled filename shipped beside the part | **Copied** verbatim | The full destination **path** |

For copied files, Snakie creates any missing intermediate folders on the board
(MicroPython has no recursive `mkdir`, so each ancestor is created in turn) and
then writes the file to its target path.

```{note}
A `github:`/`pypi:` driver installs through the same package layer behind
[Install packages](install-packages), so it behaves just like installing any
other library — the file ends up under the target install folder on the board.
```

## Per-driver progress and errors

The banner installs every driver in turn and shows the state of each row:

- A **pending** dot before it starts.
- An **installing** state while it copies or runs `mip`.
- A **tick** when it succeeds.
- An **error** with a short message if it fails (for example a bad `mip` spec or
  an unreachable URL). The driver path is shown so you can tell which file
  failed.

If anything errors, the button becomes **Retry install** — fix the cause (check
the board connection, the source URL, or your network) and click it again.
Drivers that already succeeded are re-checked, so a retry is safe.

## Verify

After installing, the files live on the board where the target said. Confirm them
in the [Files](manage-files) view (for example a new `lib/vl53l0x.py`), then
`import` the module from your program and [run it](run-and-stop).

## Troubleshooting

```{warning}
**The Install button is greyed out.** No board is connected. Plug in and select
your device — see [Connect a device](connect-device) — and the banner re-enables
itself.
```

**No banner appears.** The banner only shows in the Board View's wiring mode, and
only when a *placed* part declares a non-empty `drivers:` list. If you authored
the part, confirm the block saved — see the
[parts.yml reference](../reference/parts-yml). The same part placed twice prompts
only once.

**A copied driver fails with an unsafe-path error.** Bundled driver sources must
sit inside the part's own folder; a `source` that points outside it is rejected.
Use a plain filename shipped with the part, or an `https://` URL.

## Related

- [Board View](board-view) — placing parts and wiring them up.
- [Install packages](install-packages) — installing libraries with mip directly.
- [Manage files](manage-files) — browse what's on the board.
- [parts.yml reference](../reference/parts-yml) — the `drivers:` schema.
