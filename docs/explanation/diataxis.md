# How these docs are organised

The Snakie documentation follows **[Diátaxis](https://diataxis.fr/)** — a framework
that recognises there isn't one kind of documentation but **four**, each serving a
different need. Mixing them (a tutorial that keeps stopping to explain theory, or a
reference page that tries to teach) serves none of them well, so Snakie keeps them
apart.

## The four kinds

| Section | Orientation | Answers | Read it when… |
| --- | --- | --- | --- |
| **[Tutorials](../tutorials/index)** | learning | "Teach me, step by step." | you're new and want to get something working. |
| **[How-to guides](../how-to/index)** | task | "How do I *X*?" | you have a specific goal and know the basics. |
| **[Reference](../reference/index)** | information | "What exactly is *X*?" | you need to look up a fact, field or shortcut. |
| **[Explanation](../explanation/index)** | understanding | "Why does it work this way?" | you want the bigger picture and the design. |

Two axes underlie these: **practical** (tutorials, how-to) vs **theoretical**
(reference, explanation), and **study** (tutorials, explanation) vs **work**
(how-to, reference).

## Where should a new page go?

- Teaching a newcomer a whole skill, start to finish? → **Tutorial.**
- Steps to accomplish one concrete task? → **How-to guide.**
- Dry facts to look up (a schema, a setting, an API)? → **Reference.**
- Background, rationale, "how it works"? → **Explanation.**

If a page is trying to do two of these at once, split it.

## Contributing

The docs are built with [Sphinx](https://www.sphinx-doc.org/) using Markdown
([MyST](https://myst-parser.readthedocs.io/)) and the Furo theme. To build:

```bash
cd docs
pip install -r requirements.txt
make html        # output in _build/html
```

The build treats warnings as errors (`-W`), so a broken cross-reference or an
orphaned page fails the build — keep it green.

### Screenshots

Pages that need an image use a **placeholder admonition** until a real screenshot
is captured:

````markdown
:::{admonition} Screenshot needed — `slug-for-this-shot`
:class: screenshot
What to capture: one sentence describing the exact UI/state.
:::
````

Every placeholder is catalogued in `todo.md` so a screenshot pass can find and
fulfil them, replacing each admonition with a `{figure}` directive.
