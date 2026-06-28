# Manage files (local and on-device)

The **Files** sidebar stacks two browsers: your computer's folder (**Local
files**) on top and the connected board's filesystem (**Device files**) below,
with a transfer bridge between them. This is the Thonny-style workflow — edit on
your computer, push to the board, pull files back when you need them.

This page assumes you can already [connect a device](connect-device). Drag the
splitter between the two panes to give either tree more room; the split is
remembered across sessions.

:::{admonition} Screenshot needed — `manage-files-panel-overview`
:class: screenshot
What to capture: The Files sidebar with the Local files tree (top) populated, the transfer bridge in the middle, and the Device files tree (bottom) showing a connected board's root.
:::

## Open a working folder

The Local files tree starts empty until you point it at a folder.

1. In the **Local files** header, click the **Open folder** icon (or the
   **Open Folder** button on the empty state).
2. Pick a folder in the native dialog.

The tree re-roots to that folder and remembers it, so it reopens automatically
next launch. A **breadcrumb** of the path appears under the header — click any
ancestor segment to re-root the tree to that parent folder.

```{tip}
Use **Refresh** (the circular-arrows icon) in either header to re-read a listing
if files changed outside Snakie.
```

## Browse and open files

- Click a folder row to expand or collapse it. Device folders load their
  contents the first time you open them.
- Click a file to open it in the editor. Local files open from disk; device
  files are read off the board over the serial link.

Each pane is keyboard navigable: focus a row and press **Enter** or **Space** to
activate it. See [Run & stop](run-and-stop) for running the file you opened.

## Create, rename, and delete

Both trees expose the same operations through their header icons and a
right-click context menu.

| Action | Local files | Device files |
| --- | --- | --- |
| New file | Header **New file** icon, or right-click → **New File** | Same |
| New folder | Header **New folder** icon, or right-click → **New Folder** | Same |
| Rename | Right-click → **Rename** | Right-click → **Rename**, or **Rename** button when a row is selected |
| Delete | Right-click → **Delete** | Right-click → **Delete**, or **Delete** button when a row is selected |

When you create something, Snakie asks for a name in an in-app prompt. The new
item lands in the **selected** directory — or, if you right-clicked a file, in
that file's parent folder; otherwise at the tree root.

```{warning}
Deleting always asks for confirmation. Deleting from the **board is permanent** —
there is no recycle bin on a MicroPython device.
```

```{note}
The rename and delete prompts use Snakie's own modal, not the browser's. That is
deliberate — `window.prompt` does not work in Electron's renderer.
```

## Upload a file to the board

There are two ways to push a file to the connected device.

**From the editor (the transfer bridge):**

1. Open the file so it is the active editor tab.
2. Connect a board.
3. In the bridge between the two panes, click the **down arrow**
   (**Upload to device**).
4. Confirm or edit the destination path — it defaults to `/<filename>` at the
   board's root.

The active buffer's current contents are written to the board, so unsaved edits
are included. After uploading, **Refresh** the Device files tree to see the new
file.

**From the Local files tree (quick push):**

- Right-click a local file → **Upload to board**. This reads the file from disk
  and writes it to `/<filename>` at the board's root.

```{note}
**Upload to board** is disabled until a device is connected — the menu item shows
*"Upload to board (not connected)"* in that state.
```

## Download a file from the board

To copy a file off the device to your computer:

**From the editor (the transfer bridge):**

1. Open a **device** file so it is the active tab.
2. Click the **up arrow** (**Download to computer**) in the bridge.
3. Choose a destination folder. Snakie saves the active file's contents there
   under its original name.

The up arrow is only enabled when the active tab is a device file.

**From the Device files tree:**

- Right-click a device file → **Download to computer**, then pick a destination
  folder.

:::{admonition} Screenshot needed — `manage-files-device-context-menu`
:class: screenshot
What to capture: Right-click context menu open on a file in the Device files tree, showing Open, Download to computer, Rename, and Delete.
:::

## Save edits back to their source

Editing a file and saving (the editor's save action) writes back to wherever the
file came from:

- A **local** file saves to disk.
- A **device** file saves directly to the board over serial.
- A brand-new untitled buffer prompts you with a **Save As** dialog.

Uploading and downloading are for moving files *between* the two locations;
saving keeps a file in place. See the
[keyboard shortcuts](../reference/keyboard-shortcuts) for the save binding.

## Why the arrows point that way

The bridge mirrors the layout: the computer pane is **above** and the board pane
is **below**, so **up** sends a file *up* to the computer (download) and **down**
sends it *down* to the board (upload). The button labels also appear in their
tooltips.

## Related

- [Connect a device](connect-device) — required before any device file operation.
- [Run & stop](run-and-stop) — run the file you just opened or uploaded.
- [REPL & plotter](repl-and-plotter) — the interactive shell alongside the editor.
- [UI overview](../reference/ui-overview) — where the Files sidebar sits.
