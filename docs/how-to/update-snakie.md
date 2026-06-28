# Update Snakie

Snakie checks GitHub Releases for new versions and offers them to you in-app, so
you rarely need to visit the website. This page shows how the offer appears, how
to apply it, and what to do when the automatic path can't.

```{note}
This page is about updating the **Snakie application** itself. To update the
**MicroPython firmware on your board**, see [Flash firmware](flash-firmware) — a
separate flow with its own "newer firmware available" prompt.
```

```{important}
Automatic updates only work in **installed (packaged) builds**, against a
**newer published GitHub Release**. If you run Snakie from source or an
unpackaged build there is no update feed, so nothing is offered — checking
manually just shows a friendly "updates are only available in installed builds"
note. See [Architecture](../explanation/architecture) for why.
```

## How Snakie checks for updates

You don't have to do anything — a packaged Snakie checks automatically:

- Shortly **after launch**, then **once an hour** for long-running sessions.
- These background checks are **silent**: no dialogs, just the in-app surfaces
  below if something is found.
- Downloads are **opt-in**. Snakie never downloads or installs an update behind
  your back — you click **Download**, then **Restart**, when you're ready.

When a newer release is found, two things update together: a dismissible
**notifier banner** and the **version slot** in the status bar.

## Apply an update from the banner

When an update becomes available, a small toast appears in the **bottom-right**
corner. It mirrors the status-bar control and walks through the lifecycle:

| Banner shows | Button | What it does |
| --- | --- | --- |
| `Update available (vX.Y.Z)` | **Download** | Starts downloading the release |
| `Downloading update… NN%` | — | Progress; no action needed |
| `Update ready (vX.Y.Z) — restart to update` | **Restart** | Quits, installs, relaunches |

1. Click **Download** on the banner.
2. Wait for the percentage to reach 100% — the banner switches to "Update
   ready".
3. Click **Restart**. Snakie closes, installs the new version and reopens.

The **✕** dismisses the banner. Dismissing it doesn't cancel anything — the
download (or "ready") state is still tracked in the status bar, and the banner
re-appears if the update advances to a new state (e.g. from downloading to
ready).

:::{admonition} Screenshot needed — `update-snakie-notifier-available`
:class: screenshot
What to capture: the bottom-right notifier toast in its "Update available" state showing the version and the blue Download button, with the editor visible behind it.
:::

## Apply an update from the status bar

The clickable **version slot** at the right of the [status bar](../reference/ui-overview)
is the persistent update control. It changes shape as the lifecycle advances:

| Status-bar label | Click action |
| --- | --- |
| `vX.Y.Z` (plain) | Runs a manual check for updates |
| `⬆ Update to vX.Y.Z` | Download the available update |
| `Downloading… NN%` | — (passive while downloading) |
| `Restart for vX.Y.Z` | Restart to install the downloaded update |

So the same two clicks — **Update to…** then **Restart for…** — apply an update
without ever opening the banner.

:::{admonition} Screenshot needed — `update-snakie-statusbar-update`
:class: screenshot
What to capture: the status bar's right-hand version slot showing the "⬆ Update to vX.Y.Z" button.
:::

## Check for updates manually

You don't have to wait for the hourly check. Trigger one yourself any time:

- **Click the version number** in the status bar, or
- Use the menu item **Check for Updates…**
  - macOS: the **Snakie** app menu (just after *About Snakie*).
  - Windows / Linux: the **Help** menu.

Both run the same check and report the result in a native dialog:

- **A newer version exists** → a dialog offers **Download** / **Later**.
  Choosing Download starts the same flow as the buttons above.
- **You're already current** → "You're on the latest version."
- **Running unpackaged** → "Updates are only available in installed builds."
- **The check failed** → a low-key "Could not check for updates" message with
  the error detail.

:::{admonition} Screenshot needed — `update-snakie-check-dialog`
:class: screenshot
What to capture: the native "Update Available" dialog from a manual check, showing the available version and the Download / Later buttons.
:::

## When the update can't install itself

Auto-install requires a build the operating system trusts. macOS builds are
**code-signed and notarized**, so the in-app updater can apply them directly.
Windows and Linux builds are currently **unsigned**.

If a build can't install itself, Snakie doesn't fail loudly — the notifier shows
a short, friendly message (the full technical error is on hover) and a
**Download manually** button:

1. Click **Download manually** — Snakie opens the GitHub
   [**Releases**](https://github.com/kevinmcaleer/Snakie/releases/latest) page in
   your browser.
2. Grab the installer for your platform and run it over your existing install.

```{tip}
You can always update by hand from the
[Releases page](https://github.com/kevinmcaleer/Snakie/releases/latest),
regardless of the in-app flow — download the `.dmg`, `.exe`, `.AppImage` or
`.deb` for your platform and reinstall. See the
[README download list](https://github.com/kevinmcaleer/Snakie#download) for the
exact filenames per platform.
```

## Troubleshooting

```{warning}
**Nothing ever appears.** The notifier and the "Update to…" button only show in a
**packaged** build with a **newer published** release available. From source, or
when you're already on the latest version, you'll correctly see nothing — use
**Check for Updates…** to confirm which case you're in.
```

- **"Could not check for updates."** Usually a transient network or feed issue.
  Try again later; background checks keep retrying hourly.
- **An update keeps failing to install.** Use **Download manually** (or the
  Releases page) and reinstall — this is the reliable path for unsigned
  Windows / Linux builds.

## Related

- [Settings & themes](settings-and-themes) — other app-wide preferences.
- [Flash firmware](flash-firmware) — updating MicroPython on the board (not the app).
- [Architecture](../explanation/architecture) — how the updater and packaging fit together.
