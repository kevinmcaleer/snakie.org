# The plugin system

Snakie is extensible through **plugins** written in Python. This page explains the
shape of the system; for the concrete manifest and SDK surface see the
[Plugin API reference](../reference/plugin-api), and to enable one see
[Install and enable plugins](../how-to/plugins).

## Why Python

Snakie's audience already writes MicroPython, so plugins are **Python too** — the
same language users know, rather than asking them to learn the app's TypeScript
internals. A plugin host in the main process loads plugins and exposes a small
**`snakie` SDK** they program against, keeping plugins decoupled from Snakie's UI
code.

## What a plugin is

A plugin is a Python package that declares itself to Snakie (a manifest) and
implements one or more **capabilities** — the defined extension points the host
offers. The host discovers installed plugins, lets you **enable or disable** each
one from the Plugins panel, and runs the enabled ones, mediating their access to
the editor and device through the SDK rather than giving them free rein.

Snakie bundles a few **example plugins** (under `examples/plugins/`) that double as
working references for the SDK.

## Design goals

- **Familiar** — Python, the language the audience already uses.
- **Decoupled** — plugins target a stable SDK, not Snakie's internals, so the app
  can evolve without breaking them.
- **Opt-in** — plugins are enabled explicitly; nothing runs that you didn't turn on.

## Further reading

- [Plugin API reference](../reference/plugin-api) — the manifest and SDK.
- [Install and enable plugins](../how-to/plugins) — managing plugins in the UI.

```{note}
For the authoritative, current design and capability list, see the design notes in
the Snakie repo (`docs/plugin-system.md` and `docs/writing-plugins.md`), which this
page summarises.
```
