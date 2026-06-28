# Use Git version control

Snakie ships a built-in **Source Control** panel — a VS Code-style view over the
`git` already installed on your machine. Use it to see what changed, stage and
commit files, read diffs, switch branches, and push or pull, all without leaving
the editor.

```{note}
Source Control drives the **system `git`** in the background; it does not bundle
its own. If `git` is not on your `PATH`, install it first (e.g. Xcode Command
Line Tools on macOS, your distro's `git` package on Linux, or Git for Windows).
```

## Open the Source Control panel

1. Click the **Source** icon (the branch glyph) in the activity bar on the far
   left.
2. The panel follows the **same working folder** you opened in
   [Files](manage-files) — there is no separate repository picker. Whatever
   folder is open in the app is the repository Source Control manages.

If no folder is open yet, click **Open Folder…** in the panel (or open one from
the Files view). If the folder you opened is not a Git repository, the panel says
so and offers **Open a different folder…** and **Re-check**.

```{tip}
Snakie does not create repositories for you. To turn a plain folder into a repo,
run `git init` in a terminal (or clone an existing repo), then click **Re-check**
in the panel.
```

:::{admonition} Screenshot needed — `version-control-panel-overview`
:class: screenshot
What to capture: The Source Control panel open on a repo with changes, showing the branch toolbar at top, the commit message box, and the Staged / Changes / Untracked groups populated.
:::

## Read the status at a glance

The toolbar at the top of the panel shows the repository state:

| Element | Meaning |
| --- | --- |
| `⎇ branch-name` | The current branch. Hover to see the upstream tracking branch; shows `detached` when HEAD is detached. |
| `↑N` | Commits you are **ahead** of the upstream (ready to push). |
| `↓N` | Commits you are **behind** the upstream (ready to pull). |
| `⟳` | Refresh status. |
| `↓` / `↑` | Pull / Push. |

Below the toolbar, changed files are grouped into three lists:

- **Staged Changes** — files in the index, ready to be committed.
- **Changes** — tracked files with unstaged edits (conflicts also appear here).
- **Untracked** — files Git does not yet track.

Each row is marked with a single-letter status:

| Mark | Status |
| --- | --- |
| `M` | Modified |
| `A` | Added |
| `D` | Deleted |
| `R` | Renamed |
| `U` | Untracked |
| `!` | Conflicted |
| `?` | Other change |

```{note}
A file that has **both** staged and further unstaged edits appears in *both* the
Staged Changes and Changes lists, so you can stage or unstage each part
independently.
```

## Stage and unstage files

Hover a file row to reveal its actions:

- In **Changes** or **Untracked**, click **＋** to stage the file (`git add`).
- In **Staged Changes**, click **−** to unstage it (back to the working tree).

## Discard changes

In the **Changes** or **Untracked** list, click **⨯** to discard a file:

- A tracked file is reverted to its last committed state.
- An untracked file is deleted from disk.

```{warning}
Discarding is destructive and cannot be undone from within Snakie. The file's
working-tree changes (or the untracked file itself) are gone.
```

## View a diff

Click a file's name (anywhere on the row except the action buttons) to open an
inline **unified diff**:

- Additions are highlighted in green, deletions in red, and hunk headers (`@@`)
  stand out.
- The diff title shows the file path, with `(staged)` when you opened it from the
  Staged Changes list — staged rows diff the index against the last commit, while
  unstaged rows diff the working tree against the index.
- Untracked files show as an "added" diff (their whole contents).
- Close the diff with the **✕** button in its header.

:::{admonition} Screenshot needed — `version-control-diff-view`
:class: screenshot
What to capture: The inline unified diff open for a modified file, showing green added lines and red removed lines with the file path in the diff header.
:::

## Commit

1. Type a message in the commit box (placeholder: *Message (Ctrl+Enter to
   commit)*).
2. Click **Commit**, or press <kbd>Ctrl</kbd>+<kbd>Enter</kbd>
   (<kbd>Cmd</kbd>+<kbd>Enter</kbd> on macOS).

```{important}
**Commit stages everything first.** Snakie runs `git add -A` before committing,
so the commit captures *all* your tracked and untracked changes — not only the
files in the Staged Changes list. If you want to commit a subset, commit the
rest separately, or use the command line for fine-grained control.
```

The Commit button is disabled until the message box is non-empty. On success the
panel shows a brief *Committed.* notice and refreshes.

## Switch branches

When the repo has local branches, a **Branch** dropdown appears under the
toolbar. Pick a branch to check it out (`git checkout`); the panel confirms with
*Switched to &lt;branch&gt;*.

```{note}
The panel switches between **existing** branches only. To create, rename, delete,
or merge branches, use a terminal — then refresh the panel with **⟳**.
```

## Push and pull

- **Push** (**↑**) pushes the current branch to its upstream.
- **Pull** (**↓**) pulls from the current branch's upstream.

Each reports a short summary (e.g. *Pushed* / *Pulled: N file(s), +X -Y*). If a
push or pull fails — for example, missing upstream, authentication required, or a
non-fast-forward — the error is shown inline in the panel; resolve it from a
terminal if needed.

```{tip}
Authentication uses your system Git credentials (credential helper, SSH agent,
or cached tokens). Set those up once in your OS/terminal and Snakie's push/pull
will use them.
```

## What this panel does not do

The built-in panel covers the everyday loop — stage, commit, diff, branch,
push/pull. For anything beyond that (init, clone, create/merge branches, stash,
rebase, commit history, amend, hunk-level staging, remote management), drop to a
terminal and click **⟳** afterwards to refresh.

## Troubleshooting

Folder is not a Git repository
: Run `git init` or clone a repo into that folder, then click **Re-check**.

Nothing happens / "No folder is open"
: Open a working folder in the [Files](manage-files) view first; Source Control
  tracks that same folder.

Push rejected or asks for credentials
: Snakie uses your system Git credentials. Configure your credential helper or
  SSH key in a terminal, then retry.

## Related

- [Manage files](manage-files) — the working folder Source Control follows.
- [UI overview](../reference/ui-overview) — where the activity bar and panels live.
- [Keyboard shortcuts](../reference/keyboard-shortcuts) — including commit.
