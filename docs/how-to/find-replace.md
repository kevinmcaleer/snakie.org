# Find and replace

Search the file you are editing and swap text across it. In Snakie, Find & Replace
is a small, always-on-top **native OS window** that floats above the editor — not a
strip docked inside it — so pressing <kbd>Enter</kbd> can never accidentally type
into your code.

This page assumes you already have a file open. See
[Manage files](manage-files) if you don't.

## Open Find & Replace

You need at least one file open in the editor. Then do any of:

- Press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>F</kbd>.
- Press <kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>H</kbd>.
- Click the **Find** button on the right of the editor tab bar.

All three open the *same* window — there is no separate "find-only" mode. The window
opens focused on the **Find** box with any existing text selected, ready to type
over. If it is already open, the shortcut just brings it back to the front.

```{note}
The window has a standard OS title bar and appears in your operating system's
**Window** menu, so you can find or raise it like any other window. It is set to
stay on top of the main editor while open.
```

```{figure} /_static/screenshots/find-replace-window.png
:alt: the floating Find & Replace window open above the editor, with a query typed in the Find box and the live match count…
:width: 100%

the floating Find & Replace window open above the editor, with a query typed in the Find box and the live match count line showing "3 of 12 matches".
```

## Find text

1. Type your search text in the **Find** box. The match count under the boxes
   updates live as you type.
2. Step through results with the arrow buttons or the keyboard:

| Action | Button | Keyboard |
| --- | --- | --- |
| Next match | <kbd>↓</kbd> | <kbd>Enter</kbd> |
| Previous match | <kbd>↑</kbd> | <kbd>Shift</kbd>+<kbd>Enter</kbd> |
| Close the window | — | <kbd>Esc</kbd> |

The current match is selected in the editor and scrolled into view. Searching
**wraps around**: stepping past the last match returns to the first, and vice
versa. The <kbd>Enter</kbd> / <kbd>Shift</kbd>+<kbd>Enter</kbd> / <kbd>Esc</kbd>
keys work no matter which control inside the window has focus.

### Refine the search

Two toggles narrow what counts as a match. Each one re-runs the count immediately:

```{list-table}
:header-rows: 1

* - Toggle
  - Label
  - Effect
* - Match case
  - `Aa`
  - Treat `Pin` and `pin` as different. Off by default (case-insensitive).
* - Whole word
  - `|ab|`
  - Match only complete words, so `pin` won't match inside `spin` or `pin_no`.
```

```{important}
Find is **plain text only** — there is no regular-expression mode. Type the literal
characters you want to match; symbols like `.` or `*` match themselves.
```

### Read the match count

The status line below the inputs tells you where you are:

- `12 matches` — total matches found, before you've stepped onto one.
- `3 of 12 matches` — you are on the 3rd of 12 matches.
- `No results` — the text isn't in the file; the Find box is highlighted to flag it.

## Replace text

The **Replace with** box and its buttons are always available.

1. Type your search text in **Find** and the new text in **Replace with**.
2. Step to the match you want (the buttons act on the current selection), then use:

```{list-table}
:header-rows: 1

* - Button
  - What it does
* - **Replace**
  - Replaces the current match. If the selection isn't on a match yet, it jumps to the first match instead — press it again to replace.
* - **Replace+Find**
  - Replaces the current match, then immediately selects the next one. Best for stepping through and approving each change.
* - **Replace all**
  - Replaces *every* match in the file at once.
```

```{tip}
**Replace all** is applied as a **single undo step** — one
<kbd>Ctrl</kbd>/<kbd>Cmd</kbd>+<kbd>Z</kbd> in the editor reverts the whole batch.
```

After any replace, the match count refreshes against the updated file so the
`N of M` reading stays accurate.

## Scope and limits

- Find & Replace operates on the **active editor file** only. To change another open
  file, switch to its tab first, then re-run your search.
- It is not a project-wide search across files on disk.
- Leave the search text empty and the navigation and replace buttons are disabled —
  there is nothing to act on.

## See also

- [Keyboard shortcuts](../reference/keyboard-shortcuts) — the full shortcut list.
- [Manage files](manage-files) — opening and switching between files.
- [UI overview](../reference/ui-overview) — where the editor tab bar and Find button sit.
