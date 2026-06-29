/**
 * PART-EDITOR / breadboard screenshots for the Snakie docs (#189) — no board
 * needed. Opens the Board View (Breadboard) + the Part Editor overlay and drives
 * them via real controls. Run from the scratchpad (Playwright there):
 *   SHOT_OUT=/Users/kev/Web/snakie.org/docs/_static/screenshots node capture-screenshots-parts.mjs
 */
import { _electron as electron } from 'playwright'
import { mkdirSync } from 'node:fs'

const SNAKIE = '/Users/kev/Python/Snakie'
const EXE = `${SNAKIE}/node_modules/electron/dist/Electron.app/Contents/MacOS/Electron`
const OUT = process.env.SHOT_OUT || '/Users/kev/Web/snakie.org/docs/_static/screenshots'
mkdirSync(OUT, { recursive: true })

const SAMPLE = 'from machine import Pin, PWM, I2C\nled = Pin(25, Pin.OUT)\ni2c = I2C(0, sda=Pin(4), scl=Pin(5))\n'
const done = [], failed = []

async function main() {
  const app = await electron.launch({ executablePath: EXE, args: [`${SNAKIE}/out/main/index.js`], cwd: SNAKIE })
  const win = await app.firstWindow()
  await win.waitForLoadState('domcontentloaded')
  await win.waitForTimeout(4000)

  // A pin file so the Board View has a board to draw.
  try {
    await win.getByRole('button', { name: 'New file' }).first().click({ timeout: 4000 })
    await win.waitForTimeout(500)
    await win.locator('.monaco-editor').first().click({ timeout: 4000 })
    await win.keyboard.type(SAMPLE, { delay: 4 })
    await win.waitForTimeout(500)
  } catch (e) { failed.push('seed-file: ' + String(e).split('\n')[0]) }

  // Open the Board View window (defaults to the Breadboard tab + parts dock).
  const [bw] = await Promise.all([
    app.waitForEvent('window', { timeout: 8000 }),
    win.getByRole('button', { name: 'Toggle Board View' }).first().click()
  ])
  await bw.waitForLoadState('domcontentloaded')
  await bw.waitForTimeout(3500)

  const shot = async (slug, opts = {}) => {
    try {
      const tgt = opts.page || bw
      if (opts.sel) { const l = tgt.locator(opts.sel).first(); await l.waitFor({ state: 'visible', timeout: 4000 }); await l.screenshot({ path: `${OUT}/${slug}.png` }) }
      else await tgt.screenshot({ path: `${OUT}/${slug}.png` })
      done.push(slug); console.log('  ✓', slug)
    } catch (e) { failed.push(`${slug}: ${String(e).split('\n')[0]}`); console.log('  ✗', slug, String(e).split('\n')[0]) }
  }

  // The view tab is remembered (it was left on Node graph); force Breadboard so
  // the life-like board + the parts dock are shown.
  try { await bw.getByRole('tab', { name: 'Breadboard' }).first().click({ timeout: 4000 }); await bw.waitForTimeout(2500) } catch (e) { failed.push('breadboard tab: ' + String(e).split('\n')[0]) }

  await shot('build-a-robot-breadboard-empty')         // breadboard, board, no parts
  await shot('author-a-part-new-part-button', { sel: '.boardgraph__dock' })

  // --- Edit an EXISTING rich part (image + pins + shapes) -------------------
  try {
    // Expand any collapsed libraries so part names are clickable.
    const toggles = bw.locator('.pl__lib-toggle')
    const n = await toggles.count()
    for (let i = 0; i < n; i++) {
      const caret = await toggles.nth(i).locator('.pl__caret').textContent().catch(() => '')
      if (caret && caret.includes('▸')) await toggles.nth(i).click().catch(() => {})
    }
    await bw.waitForTimeout(600)
    await bw.locator('.boardgraph__dock').getByText(/Raspberry Pi Pico|Pico 2 W|VL53|MX1508/i).first().click({ timeout: 4000 })
    await bw.waitForTimeout(800)
    await bw.getByRole('button', { name: 'Edit part' }).first().click({ timeout: 4000 })
    await bw.waitForTimeout(2500)
    await shot('author-a-part-layered-canvas', { sel: '.pe' })
    // Details → Family + microcontroller checkbox.
    try {
      await bw.getByText(/^Details$/).first().click({ timeout: 2500 }).catch(() => {})
      await bw.waitForTimeout(700)
      await shot('add-board-definition-family-checkbox', { sel: '.pe' })
    } catch (e) { failed.push('family: ' + String(e).split('\n')[0]) }
    // Select a pin for the inspector.
    try {
      await bw.locator('.pe__canvas-stage .pcv__pin, .pe__canvas-stage circle').first().click({ timeout: 2500 })
      await bw.waitForTimeout(800)
      await shot('author-a-part-pin-inspector', { sel: '.pe' })
      await shot('parts-yml-editor-inspector', { sel: '.pe' })
    } catch (e) { failed.push('pin-inspector: ' + String(e).split('\n')[0]) }
  } catch (e) { failed.push('edit-part: ' + String(e).split('\n')[0]) }

  await app.close()
  console.log('\n=== PARTS CAPTURED', done.length, '===')
  console.log(JSON.stringify({ done, failed }, null, 2))
}
main().catch((e) => { console.error('FATAL', e); process.exit(1) })
