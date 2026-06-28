# Non-invasive live telemetry

Snakie's instruments and the Board View's **LIVE** pin values can reflect the real
state of a running board. Doing that *safely* — without trampling your program — is
a deliberate design choice. This page explains it.

## The constraint

Snakie talks to the board over MicroPython's **raw REPL**. Reading a pin's value
means sending a snippet for the board to evaluate — which **enters the raw REPL and
interrupts whatever is currently running**. There is no reliable "is a user
program running?" signal to gate on. So any live reading is inherently intrusive if
done carelessly.

## The design

Snakie treats live reading as **explicit and gentle**:

- **Opt-in.** Live polling is off by default. In the Board View it's the **LIVE**
  toggle; instruments only read while open. When off, Snakie never touches the
  device — the UI shows idle placeholders.
- **Gentle cadence.** When on and connected, Snakie polls on a calm interval
  rather than continuously, and **never overlaps two probes** (a re-entrancy
  guard), so the port stays mostly free for your own use.
- **One batched probe.** A single `exec` reads all the values needed in one go,
  rather than a chatter of per-pin round-trips. `exec` returns `{stdout, stderr}`
  and never throws on a device traceback, so a partly-undefined batch still yields
  the readable lines.
- **Fail soft.** Any disconnect, busy port, timeout or error silently drops back
  to the idle placeholder; the next successful poll recovers.

A status-bar warning appears precisely when live polling is on **and** a board is
connected **and** an instrument is open — i.e. exactly when a poll could interrupt
a running program — with a quick way to stop.

## The on-device side

The measurement instruments (oscilloscope, multimeter, plotter) are fed by a tiny
MicroPython **telemetry library** you install to the board. Your program calls
[`scope()` / `meter()` / `plot()`](../reference/telemetry-api), which emit values
Snakie reads from the serial stream — cooperative telemetry your code chooses to
send, rather than Snakie reaching in. The Plotter needs nothing on the board at
all: it just graphs numbers you `print()`.

## Further reading

- [Open and dock instruments](../how-to/use-instruments)
- [On-device telemetry API](../reference/telemetry-api)
