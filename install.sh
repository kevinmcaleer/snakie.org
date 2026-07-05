#!/usr/bin/env bash
#
# Snakie installer — macOS & Linux (incl. Raspberry Pi).
#
#   curl -sSL https://snakie.org/install.sh | bash          # per-user (recommended)
#   curl -sSL https://snakie.org/install.sh | sudo bash     # system-wide
#
# Detects your OS + CPU architecture, downloads the matching build from the
# latest GitHub release, installs it, and (on Linux) adds a "Snakie" entry to
# the Programming section of your application menu.
#
# Env overrides:
#   SNAKIE_VERSION=v0.23.2   install a specific tag instead of the latest
#
set -euo pipefail

REPO="kevinmcaleer/Snakie"
APP="Snakie"

# ---- pretty output -------------------------------------------------------
if [ -t 1 ]; then C=$'\033[1;36m'; Y=$'\033[1;33m'; R=$'\033[1;31m'; Z=$'\033[0m'; else C=; Y=; R=; Z=; fi
info() { printf '%s==>%s %s\n' "$C" "$Z" "$*"; }
warn() { printf '%swarning:%s %s\n' "$Y" "$Z" "$*" >&2; }
die()  { printf '%serror:%s %s\n' "$R" "$Z" "$*" >&2; exit 1; }

command -v curl >/dev/null 2>&1 || die "'curl' is required."

# ---- detect OS + architecture -------------------------------------------
OS="$(uname -s)"
ARCH="$(uname -m)"
case "$ARCH" in
  x86_64|amd64)   ARCH="x64" ;;
  aarch64|arm64)  ARCH="arm64" ;;
  armv7l|armv6l)  die "32-bit ARM ($ARCH) isn't supported — Snakie ships 64-bit (arm64) and x64 builds only. On a Raspberry Pi, use the 64-bit OS." ;;
  *)              die "Unsupported CPU architecture: $ARCH" ;;
esac

# ---- resolve the release tag --------------------------------------------
if [ -n "${SNAKIE_VERSION:-}" ]; then
  TAG="$SNAKIE_VERSION"
else
  info "Finding the latest Snakie release…"
  # Resolve the tag from the /releases/latest REDIRECT (…/releases/tag/vX.Y.Z).
  # This avoids the GitHub API's 60-req/hr unauthenticated rate limit.
  EFF="$(curl -fsSLI -o /dev/null -w '%{url_effective}' "https://github.com/${REPO}/releases/latest" 2>/dev/null || true)"
  case "$EFF" in
    */releases/tag/*) TAG="${EFF##*/tag/}" ;;
    *) # Fallback: the API (may be rate-limited).
       TAG="$(curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" 2>/dev/null \
             | grep -m1 '"tag_name"' | sed -E 's/.*"tag_name"[[:space:]]*:[[:space:]]*"([^"]+)".*/\1/')" ;;
  esac
fi
[ -n "$TAG" ] || die "Couldn't determine the release to install."
VER="${TAG#v}"
DL="https://github.com/${REPO}/releases/download/${TAG}"
info "Installing ${APP} ${VER} for ${OS}/${ARCH}."

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fetch() { # url dest
  info "Downloading $(basename "$2")…"
  curl -fL --progress-bar "$1" -o "$2" || die "Download failed: $1"
}

case "$OS" in
# =========================================================================
  Darwin)
    if [ "$ARCH" = "arm64" ]; then FILE="${APP}-${VER}-arm64.dmg"; else FILE="${APP}-${VER}.dmg"; fi
    fetch "${DL}/${FILE}" "${TMP}/${FILE}"

    info "Mounting the disk image…"
    ATTACH="$(hdiutil attach -nobrowse -readonly "${TMP}/${FILE}")"
    MOUNT="$(printf '%s\n' "$ATTACH" | grep -o '/Volumes/.*' | tail -n1)"
    [ -d "$MOUNT" ] || die "Couldn't mount ${FILE}."
    BUNDLE="$(find "$MOUNT" -maxdepth 1 -iname '*.app' | head -n1)"
    [ -n "$BUNDLE" ] || { hdiutil detach -quiet "$MOUNT" >/dev/null 2>&1 || true; die "No .app found inside ${FILE}."; }

    DEST="/Applications/$(basename "$BUNDLE")"
    info "Installing to ${DEST}…"
    rm -rf "$DEST" 2>/dev/null || sudo rm -rf "$DEST"
    cp -R "$BUNDLE" "/Applications/" 2>/dev/null || { warn "No write access to /Applications — using sudo."; sudo cp -R "$BUNDLE" "/Applications/"; }
    hdiutil detach -quiet "$MOUNT" >/dev/null 2>&1 || true
    xattr -dr com.apple.quarantine "$DEST" 2>/dev/null || true

    info "Done. Launch from Applications, or run:  open -a ${APP}"
    ;;

# =========================================================================
  Linux)
    if [ "$ARCH" = "arm64" ]; then FILE="${APP}-${VER}-arm64.AppImage"; else FILE="${APP}-${VER}.AppImage"; fi

    # System-wide when run as root, otherwise a clean per-user install.
    if [ "$(id -u)" -eq 0 ]; then
      APPDIR="/opt/${APP}"; APPS="/usr/share/applications"; BINLINK="/usr/local/bin/snakie"
    else
      APPDIR="${HOME}/.local/lib/${APP}"; APPS="${HOME}/.local/share/applications"; BINLINK="${HOME}/.local/bin/snakie"
    fi

    fetch "${DL}/${FILE}" "${TMP}/${FILE}"
    chmod +x "${TMP}/${FILE}"

    # Extract the AppImage into a directory and run its AppRun — this needs NO
    # FUSE/libfuse2, which a stock Raspberry Pi OS doesn't ship, so it "just
    # works" where a bare ./Snakie.AppImage launch would fail to mount.
    info "Extracting…"
    ( cd "$TMP" && "./${FILE}" --appimage-extract >/dev/null 2>&1 ) || die "Failed to extract the AppImage."
    [ -d "$TMP/squashfs-root" ] || die "Extraction produced no app directory."

    info "Installing to ${APPDIR}…"
    mkdir -p "$(dirname "$APPDIR")" "$APPS" "$(dirname "$BINLINK")"
    rm -rf "$APPDIR"
    mv "$TMP/squashfs-root" "$APPDIR"
    chmod +x "${APPDIR}/AppRun" 2>/dev/null || true
    ln -sf "${APPDIR}/AppRun" "$BINLINK"

    # Install the proper Snakie icon into the XDG icon THEME (hicolor) and
    # reference it BY NAME (Icon=snakie). This is what the Raspberry Pi / LXDE /
    # GNOME menus want — a loose absolute-path icon often renders generic or at
    # the wrong size. Real per-size PNGs + a scalable SVG give a crisp menu icon.
    if [ "$(id -u)" -eq 0 ]; then ICONBASE="/usr/share/icons"; else ICONBASE="${HOME}/.local/share/icons"; fi
    HICOLOR="${ICONBASE}/hicolor"
    ICON="snakie"
    ICON_OK=0
    info "Installing the application icon…"
    for sz in 128 256 512; do
      d="${HICOLOR}/${sz}x${sz}/apps"
      if mkdir -p "$d" 2>/dev/null && curl -fsSL "https://snakie.org/assets/img/snakie-icon-${sz}.png" -o "${d}/snakie.png" 2>/dev/null; then ICON_OK=1; fi
    done
    if mkdir -p "${HICOLOR}/scalable/apps" 2>/dev/null; then
      curl -fsSL "https://snakie.org/assets/img/snakie-icon.svg" -o "${HICOLOR}/scalable/apps/snakie.svg" 2>/dev/null || true
    fi
    # Offline fallback: reference the icon embedded in the AppImage directly.
    if [ "$ICON_OK" -eq 0 ]; then
      ICON="$(find "$APPDIR" -maxdepth 1 \( -iname 'snakie.png' -o -name '.DirIcon' \) 2>/dev/null | head -n1)"
      [ -n "$ICON" ] || ICON="$(find "$APPDIR" -type f -iname '*.png' -path '*apps*' 2>/dev/null | sort -r | head -n1)"
      [ -n "$ICON" ] || ICON="snakie"
    fi

    # Desktop entry — Categories=Development puts it in the "Programming" group
    # (that's what the Raspberry Pi / LXDE / GNOME menus map that category to).
    DESKTOP="${APPS}/snakie.desktop"
    cat > "$DESKTOP" <<EOF
[Desktop Entry]
Type=Application
Version=1.0
Name=Snakie
GenericName=MicroPython IDE
Comment=Cross-platform MicroPython editor for microcontrollers and robots
Exec=${APPDIR}/AppRun %U
Icon=${ICON}
Terminal=false
Categories=Development;IDE;Electronics;
Keywords=MicroPython;Python;Editor;Electronics;Robotics;Pico;
StartupWMClass=Snakie
EOF
    chmod 644 "$DESKTOP" 2>/dev/null || true
    update-desktop-database "$APPS" >/dev/null 2>&1 || true
    # Refresh the icon cache so the menu shows the Snakie icon immediately.
    gtk-update-icon-cache -f -t "$HICOLOR" >/dev/null 2>&1 || true

    info "Done. Find 'Snakie' under Programming in your app menu, or run:  snakie"
    if ! echo ":$PATH:" | grep -q ":$(dirname "$BINLINK"):"; then
      warn "$(dirname "$BINLINK") isn't on your PATH — launch it from the menu, or add it to PATH for the 'snakie' command."
    fi
    ;;

# =========================================================================
  *)
    die "Unsupported OS: $OS — this installer supports macOS and Linux."
    ;;
esac

info "Snakie ${VER} installed. 🐍"
