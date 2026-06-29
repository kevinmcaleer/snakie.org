# Snakie documentation

**Snakie** is a cross-platform desktop editor for **MicroPython** — a Monaco-based
code editor, a raw-REPL device layer, a live **Board View** that draws your real
board from your code, a **Parts Library** and visual **Part Editor**, dockable
**instruments** (oscilloscope, multimeter, plotter and more), firmware flashing,
package management, Git, and an integrated AI assistant.

These docs follow the [Diátaxis](https://diataxis.fr/) framework — four kinds of
documentation, each serving a different need:

- 🎓 **[Tutorials](tutorials/index)** — learning-oriented lessons. Start here if
  you're new: install Snakie, connect a board, run your first program, and build a
  wired-up project.
- 🛠️ **[How-to guides](how-to/index)** — task-oriented recipes. "How do I flash
  firmware / wire a part / open the oscilloscope?" — short, goal-focused steps.
- 📚 **[Reference](reference/index)** — information you look up: keyboard shortcuts,
  the `parts.yml` / `robot.yml` schemas, the telemetry API, supported boards,
  settings and the plugin API.
- 💡 **[Explanation](explanation/index)** — background and design: how the Board
  View parses your pins, the non-invasive telemetry model, the parts-and-boards
  data model, and Snakie's architecture.

New to Snakie? Jump straight into the
**[Getting started tutorial](tutorials/getting-started)**.

```{toctree}
:hidden:
:caption: Documentation

tutorials/index
how-to/index
reference/index
explanation/index
```
