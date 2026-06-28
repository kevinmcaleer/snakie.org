# Sphinx configuration for the Snakie documentation (issue #189).
#
# Markdown-first docs via MyST-Parser, the Furo theme, organised with the
# Diátaxis framework (Tutorials / How-to / Reference / Explanation).
# Build:  pip install -r requirements.txt && make html

project = "Snakie"
author = "Kevin McAleer"
copyright = "2026, Kevin McAleer"

# Kept in step with the app's package.json version.
release = "0.15.0"
version = "0.15"

# -- General -----------------------------------------------------------------
extensions = [
    "myst_parser",
]

# MyST (Markdown) niceties: ::: fenced admonitions, definition lists, field
# lists, task lists, and inline attributes — used throughout the docs.
myst_enable_extensions = [
    "colon_fence",
    "deflist",
    "fieldlist",
    "substitution",
    "tasklist",
    "attrs_inline",
]
myst_heading_anchors = 3  # auto-anchor h1–h3 so cross-page links work

source_suffix = {".md": "markdown"}
root_doc = "index"

templates_path = ["_templates"]
exclude_patterns = [
    "_build",
    "Thumbs.db",
    ".DS_Store",
    "README.md",
    # `todo.md` is the screenshot checklist for the screenshot agent, not a doc
    # page, so it stays out of the rendered site.
    "todo.md",
]

# -- HTML output -------------------------------------------------------------
html_theme = "furo"
html_title = "Snakie Documentation"
html_static_path = ["_static"]
html_css_files = ["custom.css"]
html_theme_options = {
    "source_repository": "https://github.com/kevinmcaleer/Snakie",
    "source_branch": "master",
    "source_directory": "docs/",
}
