# Snakie documentation

The Snakie user documentation, built with [Sphinx](https://www.sphinx-doc.org/)
(Markdown via [MyST](https://myst-parser.readthedocs.io/), the
[Furo](https://pradyunsg.me/furo/) theme) and organised with the
[Diátaxis](https://diataxis.fr/) framework:

- **Tutorials** — learning-oriented, start-to-finish lessons.
- **How-to guides** — task-oriented recipes for a specific goal.
- **Reference** — information-oriented, look-it-up facts (schemas, shortcuts, APIs).
- **Explanation** — understanding-oriented background on how Snakie works.

## Build

```bash
cd docs
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
make html          # output in docs/_build/html/index.html
make linkcheck     # verify external links
```

`make html` builds with `-W` (warnings are errors), so the build fails on a
broken cross-reference or an orphaned page — keep it green.

## Screenshots

Pages mark every image they need with a **screenshot placeholder** admonition:

````markdown
:::{admonition} Screenshot needed — `getting-started-connect`
:class: screenshot
What to capture: the Connect dialog with a Pico selected.
:::
````

Every placeholder is catalogued in [`todo.md`](todo.md). A screenshot agent
captures each one into `_static/screenshots/<slug>.png` and replaces the
admonition with a `{figure}` directive.

## Deployment

The source lives in this repo (`docs/`) and is excluded from the Jekyll build
(`_config.yml`). `.github/workflows/docs.yml` builds the HTML on every push; wire
its artifact to your hosting of choice (e.g. publish to `snakie.org/docs/`).
