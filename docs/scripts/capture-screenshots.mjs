/**
 * Screenshot capture harness for the Snakie docs (#189).
 *
 * Launches the BUILT Snakie app with Playwright's Electron driver and captures
 * the documentation screenshots that DON'T need a connected board, driving the UI
 * by clicking real controls. Hardware-dependent shots (connect/REPL/live values/
 * instruments/flashing) are left as placeholders in the docs.
 *
 * Run (Playwright is installed in the scratchpad sandbox):
 *   cd <scratchpad-with-playwright> && node /Users/kev/Python/Snakie/scripts/capture-screenshots.mjs
 *
 * Output PNGs go to OUT (the snakie.org docs _static/screenshots dir).
 */
import { _electron as electron } from 'playwright'
import { mkdirSync } from 'node:fs'

const SNAKIE = '/Users/kev/Python/Snakie'
const EXE = `${SNAKIE}/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron`
const OUT = process.env.SHOT_OUT || '/Users/kev/Web/snakie.org/docs/_static/screenshots'
mkdirSync(OUT, { recursive: true })

const SAMPLE = [
  'from machine import Pin, PWM, I2C',
  '',
  'led = Pin(25, Pin.OUT)',
  'button = Pin(16, Pin.IN, Pin.PULL_UP)',
  'buzzer = PWM(Pin(15))',
  'i2c = I2C(0, sda=Pin(4), scl=Pin(5))',
  '',
  'def blink():',
  '    led.toggle()',
  ''
].join('\n')

const done = []
const failed = []

async function main() {
  const app = await electron.launch({ executablePath: EXE, args: [`${SNAKIE}/out/main/index.js`], cwd: SNAKIE })
  const win = await app.firstWindow()
  await win.waitForLoadState('domcontentloaded')
  await win.waitForTimeout(4000)

  // Capture the whole window (or an element if `sel` is given) to <slug>.png.
  const shot = async (slug, opts = {}) => {
    try {
      if (opts.sel) {
        const loc = win.locator(opts.sel).first()
        await loc.waitFor({ state: 'visible', timeout: 4000 })
        await loc.screenshot({ path: `${OUT}/${slug}.png` })
      } else {
        await (opts.page || win).screenshot({ path: `${OUT}/${slug}.png` })
      }
      done.push(slug)
      console.log('  ✓', slug)
    } catch (e) {
      failed.push(`${slug}: ${String(e).split('\n')[0]}`)
      console.log('  ✗', slug, '—', String(e).split('\n')[0])
    }
  }
  const click = async (selOrName, byRole = true) => {
    const loc = byRole ? win.getByRole('button', { name: selOrName }) : win.locator(selOrName)
    await loc.first().click({ timeout: 4000 })
    await win.waitForTimeout(700)
  }

  // --- New empty file, then the same file with code -------------------------
  try {
    await win.getByRole('button', { name: 'New file' }).first().click({ timeout: 4000 })
    await win.waitForTimeout(800)
    await shot('first-program-new-tab')
    await win.locator('.monaco-editor').first().click({ timeout: 4000 })
    await win.waitForTimeout(300)
    await win.keyboard.type(SAMPLE, { delay: 4 })
    await win.waitForTimeout(800)
  } catch (e) {
    failed.push(`new-file/type: ${String(e).split('\n')[0]}`)
  }

  await shot('ui-overview-full-window')
  await shot('connect-device-shell-header')      // shell header is visible in the default window
  await shot('repl-and-plotter-console')
  await shot('run-and-stop-run-button', { sel: '[aria-label="File actions"], .toolbar' })

  // --- Activity-bar panels --------------------------------------------------
  try { await click('Packages'); await shot('install-packages-panel') } catch (e) { failed.push('packages: ' + e) }
  try {
    await click('Plugins')
    await shot('plugin-api-plugins-view')
    await shot('plugins-rack-overview')
  } catch (e) { failed.push('plugins: ' + e) }
  try { await click('Source'); await shot('version-control-panel-overview') } catch (e) { failed.push('source: ' + e) }
  try { await click('Files') } catch { /* back to files */ }

  // --- Settings dialog ------------------------------------------------------
  try {
    await click('Open settings')
    await win.waitForTimeout(600)
    await shot('settings-and-themes-editor-tab', { sel: '[role="dialog"]' })
    await win.getByRole('tab', { name: 'Chat' }).first().click({ timeout: 4000 })
    await win.waitForTimeout(500)
    await shot('settings-and-themes-chat-tab', { sel: '[role="dialog"]' })
    await shot('ai-assist-chat-settings', { sel: '[role="dialog"]' })
    await win.keyboard.press('Escape')
    await win.waitForTimeout(500)
  } catch (e) { failed.push('settings: ' + String(e).split('\n')[0]) }

  // --- Theme knob -----------------------------------------------------------
  await shot('settings-and-themes-theme-knob', { sel: '[aria-label="Toggle theme"]' })

  // --- Find & Replace window (needs editor focus + matches) -----------------
  try {
    await win.locator('.monaco-editor').first().click({ timeout: 4000 })
    const [findWin] = await Promise.all([
      app.waitForEvent('window', { timeout: 6000 }),
      win.keyboard.press('Meta+f')
    ])
    await findWin.waitForLoadState('domcontentloaded')
    await findWin.waitForTimeout(900)
    await findWin.locator('input').first().fill('Pin')
    await findWin.waitForTimeout(900)
    await shot('find-replace-window', { page: findWin })
    await findWin.keyboard.press('Escape').catch(() => {})
  } catch (e) { failed.push('find: ' + String(e).split('\n')[0]) }

  // --- Board View window ----------------------------------------------------
  try {
    const [boardWin] = await Promise.all([
      app.waitForEvent('window', { timeout: 8000 }),
      win.getByRole('button', { name: 'Toggle Board View' }).first().click()
    ])
    await boardWin.waitForLoadState('domcontentloaded')
    await boardWin.waitForTimeout(3000)
    await shot('ui-overview-board-window', { page: boardWin })
    await shot('board-view-window', { page: boardWin })

    // Switch to the Node graph tab (the view defaults to Breadboard).
    try {
      await boardWin.getByRole('tab', { name: 'Node graph' }).first().click({ timeout: 4000 })
      await boardWin.waitForTimeout(2500)
      await shot('visualise-wiring-node-graph', { page: boardWin })
      // Element crops within the board window:
      try { await boardWin.locator('.boardgraph__viewtabs').first().screenshot({ path: `${OUT}/board-view-tabs.png` }); done.push('board-view-tabs'); console.log('  ✓ board-view-tabs') } catch (e) { failed.push('board-view-tabs: ' + String(e).split('\n')[0]) }
      try { await boardWin.locator('.boardgraph__viewport-ctl').first().screenshot({ path: `${OUT}/board-view-controls.png` }); done.push('board-view-controls'); console.log('  ✓ board-view-controls') } catch (e) { failed.push('board-view-controls: ' + String(e).split('\n')[0]) }
    } catch (e) { failed.push('node-graph tab: ' + String(e).split('\n')[0]) }

    // Board picker dropdown open (one shot, used by several pages).
    try {
      await boardWin.locator('.boardgraph__picker-btn').first().click({ timeout: 4000 })
      await boardWin.waitForTimeout(700)
      for (const slug of ['boards-and-firmware-board-selector', 'visualise-wiring-board-picker', 'add-board-definition-board-picker']) {
        await boardWin.screenshot({ path: `${OUT}/${slug}.png` }); done.push(slug); console.log('  ✓', slug)
      }
    } catch (e) { failed.push('board-picker: ' + String(e).split('\n')[0]) }
  } catch (e) { failed.push('board-view: ' + String(e).split('\n')[0]) }

  await app.close()
  console.log('\n=== CAPTURED', done.length, '===')
  console.log(JSON.stringify({ done, failed }, null, 2))
}

main().catch((e) => { console.error('FATAL', e); process.exit(1) })
