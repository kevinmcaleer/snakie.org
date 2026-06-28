# Use AI assistance

Snakie has two built-in AI features, both powered by an LLM provider you choose:

- a **Chat panel** for asking questions about your MicroPython code, with your
  current file and recent console output attached as context; and
- optional **inline ghost-text completions** that suggest code as you type.

Both are *bring-your-own-key*: you add an API key (or sign in, for GitHub
Copilot) for one of the supported providers, and Snakie calls that provider
directly from your machine. There is no Snakie-hosted AI service.

```{note}
Provider API calls run in Snakie's main process, never the browser renderer, so
your key is never exposed to page content and external requests aren't blocked by
the renderer's content-security policy. See [Architecture](../explanation/architecture).
```

## Choose a provider and add a key

1. Open the **Settings** dialog and select the **Chat** tab (see
   [Settings and themes](settings-and-themes)).
2. Under **Provider**, pick the provider you want to configure.
3. Paste your API key into the key field and click **Save key**. Use **Get a
   key** to open the provider's key page in your browser.

The supported providers:

| Provider | Key needed | Where to get it | Reasoning effort |
| --- | --- | --- | --- |
| **Anthropic Claude** (default) | API key (`sk-ant-…`) | console.anthropic.com | low / medium / high |
| **OpenAI** | API key (`sk-…`) | platform.openai.com | low / medium / high (o-series) |
| **Google Gemini** | Google AI Studio key | aistudio.google.com | — |
| **Grok (xAI)** | API key (`xai-…`) | console.x.ai | — |
| **GitHub Copilot** (experimental) | GitHub sign-in | — | — |

```{tip}
You can store a key for *every* provider. The **Provider** dropdown in the Chat
tab selects which one you are editing a key for; the chat's own footer (below)
selects which provider a conversation actually uses.
```

### GitHub Copilot sign-in

Copilot doesn't use a pasted key. With **GitHub Copilot** selected in the Chat
tab, click **Sign in to GitHub Copilot**. A GitHub page opens with a short code —
enter it to authorize Snakie, then return to Snakie, which finishes
automatically. You need an active Copilot subscription. Use **Sign out** to
revoke it.

```{important}
Copilot is marked **experimental** — it can only be verified against a real
Copilot account, so behaviour may vary.
```

:::{admonition} Screenshot needed — `ai-assist-chat-settings`
:class: screenshot
What to capture: The Settings dialog open on the Chat tab, showing the Provider dropdown, the API key field with Save key / Remove / Get a key buttons, and the Autocomplete toggle below.
:::

## Chat with the assistant

1. Open the Chat panel: click the **Chat panel** knob in the toolbar's right-hand
   cluster (the right pane is collapsed by default).
2. Type your question in the composer and press **Enter** to send (use
   **Shift+Enter** for a newline). Replies stream in live.

The chat sends two kinds of context, controlled by the toggles above the
composer:

Include active file
: On by default — the assistant always sees your up-to-date editor file. Turn it
  off to ask a general question without attaching code.

Attach console (since last Run)
: Off by default — attaches the device's REPL/console output since your last
  [Run](run-and-stop), so the assistant can reason about what your program
  printed or the error it raised.

### Apply or copy a reply

Each fenced code block in a reply has a **Copy** button, and — when there is an
active editor file — an **Apply** button.

```{warning}
**Apply replaces the entire contents** of the active file with that code block.
It's a clean, undoable change (press **Ctrl/Cmd+Z** to revert), but it does not
merge or splice. Review before applying.
```

The whole assistant message also has a **Copy** button, and **Clear** (in the
footer) empties the thread.

### Send console output to chat

When the Chat panel is open, a **Send to chat** button appears above the console
in the Shell panel (see [REPL & Plotter](repl-and-plotter)). Click it to stage
the recent output into the composer with a starter prompt and the **Attach
console** toggle switched on — add your own question before sending.

### Switch provider, model, or effort

The footer bar under the composer has quick dropdowns for **Provider**,
**Model**, and (where the provider supports it) **Effort**. Selections are
remembered per provider. The **⚙** button opens the Settings dialog's Chat tab
directly.

:::{admonition} Screenshot needed — `ai-assist-chat-panel`
:class: screenshot
What to capture: The Chat panel open with a short conversation, an assistant reply containing a code block with its Apply and Copy buttons, the two context toggles above the composer, and the Provider/Model footer dropdowns.
:::

## Enable inline ghost-text completions

Inline completions are **opt-in** and off by default.

1. In **Settings → Chat**, find the **Autocomplete** section and switch it
   **On**.
2. Optionally choose a **Completion model** — this is a fast, cheap model
   (defaulting to e.g. Claude Haiku) used *only* for completions, separate from
   your chat model.
3. Make sure the selected provider has a saved key — completions need one, just
   like the chat does.

As you type, Snakie suggests the rest of a line or block as dimmed **ghost
text**. Press **Tab** to accept it, or keep typing / press **Esc** to dismiss.

How it behaves:

- Suggestions appear in **Python, plain-text, and Markdown** files.
- They fire after a brief **typing pause** (~350 ms), not on every keystroke.
- Only a bounded window of code around your cursor is sent (roughly the last
  ~2000 characters before it and ~500 after) — never the whole file.

```{warning}
Inline completion **spends tokens on each typing pause**, so it can add up on
metered APIs. Leave it off if you only want the chat, and turn it on when you
want as-you-type help.
```

:::{admonition} Screenshot needed — `ai-assist-ghost-text`
:class: screenshot
What to capture: The Monaco editor mid-edit showing a dimmed ghost-text inline completion suggested after the cursor in a Python file.
:::

## How your key and data are handled

- Keys are stored **locally**, encrypted with your OS keychain where available,
  and used only to call that provider's API. On systems without OS encryption,
  Snakie warns that the key is stored obfuscated but not encrypted.
- Each provider's key is stored separately; **Remove** (or signing out, for
  Copilot) clears it.
- Only what you send is sent: your messages, and — when their toggles are on —
  the active file and recent console output for chat, or the bounded
  prefix/suffix around your cursor for completions.

For the persisted setting keys, see [Settings reference](../reference/settings);
for the provider/model wiring, see
[Architecture](../explanation/architecture).
