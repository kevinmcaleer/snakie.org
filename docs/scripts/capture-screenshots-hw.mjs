/**
 * HARDWARE screenshot capture for the Snakie docs (#189) — the shots that need a
 * connected MicroPython board. Launches its OWN Playwright-controlled Snakie, so
 * any other Snakie holding the serial port must be quit first.
 *
 * Runs a BENIGN program on the board (prints two values in a loop for the
 * plotter; no flash writes, no real firmware flashing).
 *
 * Run (Playwright installed in the scratchpad sandbox):
 *   cd <scratchpad> && SHOT_OUT=/Users/kev/Web/snakie.org/docs/_static/screenshots \
 *     node /Users/kev/Web/snakie.org/docs/scripts/capture-screenshots-hw.mjs
 */
import { _electron as electron } from 'playwright'
import { mkdirSync } from 'node:fs'

const SNAKIE = '/Users/kev/Python/Snakie'
const EXE = `${SNAKIE}/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron`
const OUT = process.env.SHOT_OUT || '/Users/kev/Web/snakie.org/docs/_static/screenshots'
mkdirSync(OUT, { recursive: true })

// Each line is column-0 valid Python (the while body is inline after the colon),
// so Monaco's auto-indent can't cascade it into a SyntaxError.
const PROG = [
  'import math, time',
  'n = 0',
  'while True: print("%.3f,%.3f" % (math.sin(n*0.2), math.cos(n*0.2))); n += 1; time.sleep(0.08)'
]

const done = [], failed = []

async function main() {
  const app = await electron.launch({ executablePath: EXE, args: [`${SNAKIE}/out/main/index.js`], cwd: SNAKIE })
  const win = await app.firstWindow()
  await win.waitForLoadState('domcontentloaded')
  await win.waitForTimeout(4000)

  const shot = async (slug, opts = {}) => {
    try {
      const tgt = opts.page || win
      if (opts.sel) { const l = tgt.locator(opts.sel).first(); await l.waitFor({ state: 'visible', timeout: 4000 }); await l.screenshot({ path: `${OUT}/${slug}.png` }) }
      else await tgt.screenshot({ path: `${OUT}/${slug}.png` })
      done.push(slug); console.log('  ✓', slug)
    } catch (e) { failed.push(`${slug}: ${String(e).split('\n')[0]}`); console.log('  ✗', slug, String(e).split('\n')[0]) }
  }
  const btn = (name) => win.getByRole('button', { name }).first()
  // Dismiss the firmware-update popup if it shows (it can overlap shots).
  const dismissFw = async () => { await win.locator('.statusbar__fw-dismiss').first().click({ timeout: 1500 }).catch(() => {}) }

  // --- Connect --------------------------------------------------------------
  let connected = false
  try {
    const sel = win.locator('select[aria-label="Serial port"]')
    const port = await sel.evaluate((s) => [...s.options].map((o) => o.value).find((v) => /usbmodem|usbserial|ttyACM|ttyUSB/i.test(v)))
    if (!port) throw new Error('no usb serial port in the dropdown')
    console.log('  port:', port)
    await sel.selectOption(port)
    await btn('Connect').click({ timeout: 4000 })
    for (let i = 0; i < 20 && !connected; i++) { await win.waitForTimeout(800); connected = await win.getByText(/Connected/i).first().isVisible().catch(() => false) }
    await win.waitForTimeout(1500)
    console.log('  connected:', connected)
  } catch (e) { failed.push('connect: ' + String(e).split('\n')[0]) }

  await dismissFw()
  await shot('getting-started-connection-control')
  await shot('connect-device-shell-header')
  await shot('connect-device-status-bar')
  await shot('manage-files-panel-overview')

  // --- Soft reset → REPL banner + >>> in the console ------------------------
  try {
    await btn('Reset the board').click({ timeout: 4000 })
    await win.waitForTimeout(2500)
  } catch (e) { failed.push('reset: ' + String(e).split('\n')[0]) }
  await dismissFw()
  await shot('getting-started-repl-banner')
  await shot('repl-and-plotter-console')

  // --- Type + run the (clean) program ---------------------------------------
  try {
    await btn('New file').click({ timeout: 4000 })
    await win.waitForTimeout(600)
    await win.locator('.monaco-editor').first().click({ timeout: 4000 })
    // Escape before Enter dismisses Monaco's autocomplete so Enter inserts a
    // newline instead of accepting a suggestion (which merged lines before).
    for (const line of PROG) { await win.keyboard.type(line, { delay: 4 }); await win.keyboard.press('Escape'); await win.keyboard.press('Enter') }
    await win.waitForTimeout(500)
    await btn('Run active file on device').click({ timeout: 4000 })
    await win.waitForTimeout(3500)
  } catch (e) { failed.push('run: ' + String(e).split('\n')[0]) }
  await dismissFw()

  await shot('first-program-run-button', { sel: '.toolbar' })
  await shot('run-and-stop-run-button', { sel: '.toolbar' })
  await shot('first-program-shell-output')
  await shot('getting-started-run-blink')

  // --- Instruments: show the dock, open the palette + Plotter ---------------
  try {
    // Ensure the instruments dock is visible.
    await btn('Toggle instruments').click({ timeout: 4000 })
    await win.waitForTimeout(800)
    if (!(await win.locator('.instr-dock__add').first().isVisible().catch(() => false))) {
      await btn('Toggle instruments').click({ timeout: 3000 }); await win.waitForTimeout(800)
    }
    await win.locator('.instr-dock__add').first().click({ timeout: 4000 })
    await win.waitForTimeout(700)
    await shot('use-instruments-add-palette', { sel: '.instr-palette' })
    await shot('device-instruments-dock-header')
    await win.locator('.instr-palette').getByText(/Plotter/i).first().click({ timeout: 3000 })
    await win.waitForTimeout(3000) // let the plotter graph the running output
    await shot('first-program-plotter')
    await shot('repl-and-plotter-plotter')
    await shot('use-instruments-dock-open')
  } catch (e) { failed.push('instruments: ' + String(e).split('\n')[0]) }

  // Opening the scope when the telemetry lib isn't on the board → install banner.
  try {
    await win.locator('.instr-dock__add').first().click({ timeout: 3000 }); await win.waitForTimeout(500)
    await win.locator('.instr-palette').getByText(/Oscilloscope/i).first().click({ timeout: 3000 })
    await win.waitForTimeout(1500)
    await shot('live-instruments-install-banner')
  } catch (e) { failed.push('install-banner: ' + String(e).split('\n')[0]) }

  // --- Stop the program -----------------------------------------------------
  try { await btn('Stop / interrupt running program').click({ timeout: 3000 }); await win.waitForTimeout(800) } catch { /* not running */ }

  // --- Flash firmware dialog (opened only to screenshot it) -----------------
  try {
    await btn('Flash MicroPython firmware').click({ timeout: 4000 })
    await win.waitForTimeout(1500)
    await shot('flash-firmware-dialog', { sel: '[role="dialog"]' })
    await win.keyboard.press('Escape').catch(() => {})
  } catch (e) { failed.push('flash: ' + String(e).split('\n')[0]) }

  await app.close()
  console.log('\n=== HW CAPTURED', done.length, '===')
  console.log(JSON.stringify({ done, failed }, null, 2))
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })
