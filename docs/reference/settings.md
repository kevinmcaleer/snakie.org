# Settings reference

Snakie's preferences are reached from the **Settings** dialog and persist across
restarts (in `localStorage`). See
[Change settings and themes](../how-to/settings-and-themes) for how to open and
change them.

## Editor paper & layout

| Setting | Values | Default | Notes |
| --- | --- | --- | --- |
| **Paper** | `lines` · `dots` · `off` | `lines` | The notebook background behind the editor — ruled lines, squared dots, or none. |
| **Line spacing** | `22`–`48` px | `30` | Spacing between ruled lines; also the editor line height (the two are kept in sync so text sits on the lines). |
| **Editor theme** | one of the built-in editor colour themes | the default theme | The syntax-highlighting colour scheme. |

## Appearance

| Setting | Values | Notes |
| --- | --- | --- |
| **App theme** | Skeuomorph (light / dark) | The retro NES "skeuomorph" skin with a light/dark toggle; applied as `data-theme` on the document and shared with the Board View / Find windows. |

## Device

| Setting | Values | Default | Notes |
| --- | --- | --- | --- |
| **Check for firmware updates** | on / off | on | When on, Snakie reads the connected device's MicroPython version from its boot banner and notifies you if a newer build exists **for that board's family** (see [How firmware flashing works](../explanation/firmware-model)). |

## AI assistance

| Setting | Notes |
| --- | --- |
| **Provider & API key** | The LLM provider and credentials used by the [AI ghost-text and chat](../how-to/ai-assist). Configured in the chat settings. |
| **Ghost-text suggestions** | Toggle inline AI completions in the editor. |

```{note}
AI features require your own API key and network access; they are off until
configured.
```
