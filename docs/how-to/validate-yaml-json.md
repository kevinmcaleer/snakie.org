# Validate YAML and JSON

Snakie checks `.json`, `.yml`, and `.yaml` files as you type — flagging syntax
errors with inline squiggles, collecting them in the **Problems** panel, and
offering a one-click reformat/repair. This is handy for the config-style files you
edit alongside Python, such as `parts.yml`, `robot.yml`, and board-definition
JSON.

This page shows how to read those errors and apply the autofix.

```{note}
Validation runs entirely in the editor (no device or host round-trip), so it works
whether or not a board is connected, and on any file you open with a `.json`,
`.yml`, or `.yaml` extension.
```

## See errors as you type

1. Open a `.json`, `.yml`, or `.yaml` file in the editor.
2. Type or paste content. A moment after you stop typing, Snakie validates the
   file.
3. Invalid syntax gets a **red squiggle** under the offending location, with the
   reason on hover.

What each format reports:

| Format | What is checked | Diagnostics produced |
| --- | --- | --- |
| JSON (`.json`) | Parsed with the strict JSON parser | A single error at the first parse failure |
| YAML (`.yml`, `.yaml`) | Parsed as a YAML document | Every error **and** warning the parser finds, each with its own location |

Each diagnostic carries a 1-based line and column derived from the parser's error
position, so the squiggle lands on (or very near) the real problem.

:::{admonition} Screenshot needed — `validate-yaml-json-squiggle`
:class: screenshot
What to capture: A `robot.yml` (or any YAML) file open in the editor with a red squiggle under a syntax error and the hover tooltip showing the "Invalid YAML: ..." message with its line/column.
:::

## Read errors in the Problems panel

The same diagnostics also collect in the **Problems** panel so you can scan them
all at once and jump straight to each one.

1. In the shell region at the bottom, switch the segmented toggle from **Console**
   to **Problems**. The tab title shows a count, e.g. `Problems (2)`, when issues
   exist.
2. Each row shows a severity glyph (✕ error, ⚠ warning), the `line:column`, the
   message, and a `source` label of `json` or `yaml`.
3. Click any row to jump the editor to that line.

```{tip}
The **Lint** toggle in the shell header only controls **Python** linting. JSON and
YAML validation always runs, so format errors appear in the Problems panel even
with Lint switched off.
```

See [UI overview](../reference/ui-overview) for the rest of the shell region.

## Apply the autofix

When Snakie can produce a safe, canonical version of the file, it offers a fix.
"Safe" means the result is re-parsed and only offered if it is itself valid — the
fix never hands you broken content.

What the autofix does:

- **JSON** — pretty-prints with 2-space indentation. If the file does not parse,
  Snakie first attempts a best-effort cleanup: stripping `//` line comments and
  `/* … */` block comments, and dropping trailing commas before `}` or `]`. The
  cleaned text is offered only if it then parses.
- **YAML** — re-stringifies the document into a canonical, tidy form. This is
  offered **only when the file already parses cleanly** (no errors); an
  unparseable YAML document has no safe automatic fix.

The fix is offered only when the canonical form actually differs from your current
text (otherwise there is nothing to do).

### From the Problems panel

A **Fix / Format JSON** (or **YAML**) button appears in the Problems toolbar
whenever a safe fix exists for the active file. Click it to rewrite the file with
the canonical text. If the file is already valid but not tidy, the panel's empty
state shows a **Format JSON** / **Format YAML** button instead.

:::{admonition} Screenshot needed — `validate-yaml-json-problems`
:class: screenshot
What to capture: The Problems panel listing a JSON parse error row (✕, line:column, message, "json" source) with the "Fix / Format JSON" button visible in the toolbar above the list.
:::

### From the editor (YAML lightbulb)

YAML files also expose the fix as a Monaco **quick-fix lightbulb**:

1. Put the cursor on the error line.
2. Open the lightbulb — click it, or press the quick-fix shortcut
   (`Cmd .` on macOS, `Ctrl .` on Windows/Linux).
3. Choose **Format YAML**.

```{note}
JSON files open as plain text in the editor, so JSON does **not** get the lightbulb
quick-fix — use the Problems-panel button for JSON. YAML files get both the
lightbulb and the button.
```

## Where this helps

These are the Snakie files most often edited by hand, and validating them before
you save avoids confusing parse failures later:

- [parts.yml reference](../reference/parts-yml) — the parts library catalog.
- [robot.yml reference](../reference/robot-yml) — robot definitions.
- [Add a board definition](add-board-definition) — board-definition JSON.

## Related

- [Manage files](manage-files) — open, save, and organise files.
- [Find & Replace](find-replace) — bulk-edit across a file.
- [UI overview](../reference/ui-overview) — the editor, shell region, and Problems
  panel.
