# Change settings and themes

Snakie keeps its preferences in two places: a quick **app theme** knob on the
toolbar, and a tabbed **Settings** dialog for the editor and AI chat. This page
shows how to open them and what each control does.

```{note}
Every change is applied and saved instantly — there is no "Save" or "Apply"
button. The Settings dialog footer reads *"Changes are saved automatically."*
Editor and theme choices persist across restarts; API keys are kept separately
(see [Chat settings](#chat-settings-tab)).
```

## Switch between the light and dark theme

The light/dark switch lives on the **toolbar**, not in the Settings dialog.

1. Find the round sun/moon knob in the toolbar (next to the Board View and
   Settings buttons).
2. Click it to toggle between the two skins:
   - **Skeuomorph** — the default light skin (brushed metal, green felt, cream
     ruled paper, recessed dark-glass console). The knob shows a **moon**.
   - **Dark** — the "lights out" deep-slate skin. The knob shows a **sun**.

Your choice is remembered for next launch.

```{tip}
The app theme also re-skins the editor's ruled paper. Under the dark skin the
editor renders its own cohesive dark paper, so the per-theme **Editor theme**
colours below only apply while the light Skeuomorph skin is active.
```

```{figure} /_static/screenshots/settings-and-themes-theme-knob.png
:alt: The toolbar with the sun/moon theme knob highlighted, shown once in the light Skeuomorph skin and once in the dark sk…
:width: 100%

The toolbar with the sun/moon theme knob highlighted, shown once in the light Skeuomorph skin and once in the dark skin.
```

## Open the Settings dialog

There are two ways in, and each one opens straight to the relevant tab:

- Click the **gear** button on the toolbar → opens the **Editor** tab.
- Click the **⚙** in the chat panel's footer → opens the **Chat** tab.

Switch tabs at any time using the **Editor** / **Chat** tabs at the top of the
dialog. Close it with the **✕** button, by clicking the dimmed backdrop, or by
pressing `Escape`.

(settings-and-themes-editor-tab)=
## Editor tab

```{note}
The notebook-paper and editor-theme controls style the cream ruled-paper editor
of the **light Skeuomorph** skin. The firmware-updates toggle works regardless of
skin.
```

### Notebook paper

Choose how the paper is drawn behind the editor:

| Option | Effect |
| --- | --- |
| **Lines** | Ruled notebook lines (the default). |
| **Dots** | A subtle squared grid of dots. |
| **Off** | Plain paper, no rules or dots. |

### Line spacing

A slider sets the space between the ruled lines — which is also the editor's
line height, so text always sits on the lines. The range is **22 px to 48 px**
(default **30 px**). The current value is shown beside the heading. The slider is
disabled when **Notebook paper** is set to **Off**.

### Editor theme

Pick the syntax colours (and paper tint) for the editor:

| Theme | Description |
| --- | --- |
| **Paper** | Warm cream notebook, ink-on-paper syntax (the default). |
| **Bright** | Whiter paper with vivid, high-contrast syntax. |
| **Midnight** | A dark editor; the ruled lines are intentionally hidden. |

The **Paper** and **Bright** themes keep the ruled lines visible; **Midnight**
paints an opaque dark surface instead.

### Firmware updates

A checkbox: **Check for newer MicroPython firmware** (on by default). When
enabled, Snakie checks whether a newer MicroPython is available for the connected
device and prompts you from the Flash-firmware button. See
[Flash firmware](flash-firmware) for the flashing workflow.

```{figure} /_static/screenshots/settings-and-themes-editor-tab.png
:alt: The Settings dialog open on the Editor tab, showing the Notebook paper segmented control, the Line spacing slider, th…
:width: 100%

The Settings dialog open on the Editor tab, showing the Notebook paper segmented control, the Line spacing slider, the Editor theme selector, and the firmware-updates checkbox.
```

(settings-and-themes-chat-tab)=
## Chat settings tab

The Chat tab configures the AI assistant's providers and the inline
autocomplete. The chat panel's footer still selects which provider and model a
given conversation uses; this tab is where you store keys and tune autocomplete.
For day-to-day use of the assistant see [Use AI assist](ai-assist).

### Set a provider's API key

1. Use the **Provider** dropdown to pick the provider you want to configure
   (providers marked *(experimental)* are flagged in the list).
2. Paste your key into the **API key** field.
3. Click **Save key**. To clear a stored key, click **Remove**.
4. If you don't have a key yet, click **Get a key** to open the provider's signup
   page in your browser.

The field shows `•••••••• (stored)` once a key is saved.

```{important}
Keys are stored locally and used only to call that provider's API from this app.
If your operating system can't provide secure encryption, Snakie warns you that
the key is *stored obfuscated but not encrypted*.
```

### Sign in to GitHub Copilot

Copilot doesn't use a pasted key. Select **GitHub Copilot** as the provider and:

1. Click **Sign in to GitHub Copilot**. A GitHub page opens in your browser.
2. Enter the short device code shown in the dialog (use **Copy** to copy it).
3. Approve access. Snakie detects authorization and shows *"✓ Signed in"*.

To disconnect, click **Sign out**. An active Copilot subscription is required; no
personal access token is needed.

### Autocomplete (ghost text)

Toggle **Autocomplete** on to get inline, ghost-text code suggestions as you
type, using a fast completion model that is separate from the chat model.

```{warning}
Autocomplete is **off by default** — it spends tokens on every typing pause.
```

When it's enabled, a **Completion model** dropdown appears so you can pick which
model produces the suggestions for the selected provider.

```{figure} /_static/screenshots/settings-and-themes-chat-tab.png
:alt: The Settings dialog open on the Chat tab, showing the Provider dropdown, the API key field with Save/Remove/Get a key…
:width: 100%

The Settings dialog open on the Chat tab, showing the Provider dropdown, the API key field with Save/Remove/Get a key buttons, and the Autocomplete toggle.
```

## Related pages

- [User interface overview](../reference/ui-overview) — where the toolbar knobs live.
- [Settings reference](../reference/settings) — every persisted preference and its default.
- [Use AI assist](ai-assist) — using the chat and autocomplete once configured.
- [Flash firmware](flash-firmware) — the firmware-update prompt in action.
- [Keyboard shortcuts](../reference/keyboard-shortcuts) — including `Escape` to close dialogs.
