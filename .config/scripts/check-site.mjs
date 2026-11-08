import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { once } from 'node:events'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const port = 4322
const origin = `http://127.0.0.1:${port}`
const base = `${origin}/reusables/`
const server = spawn(
  process.execPath,
  [
    fileURLToPath(
      new URL('../../node_modules/astro/bin/astro.mjs', import.meta.url),
    ),
    'preview',
    '--config',
    '.config/astro.config.mjs',
    '--ignore-lock',
    '--host',
    '127.0.0.1',
    '--port',
    String(port),
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
)
let output = ''
server.stdout.on('data', (data) => {
  output += data
})
server.stderr.on('data', (data) => {
  output += data
})
let browser

try {
  let ready = false
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null) throw new Error(`Preview exited: ${output}`)
    try {
      const response = await fetch(base)
      if (response.ok) {
        ready = true
        break
      }
    } catch {
      /* Wait for the preview process to listen. */
    }
    await setTimeout(100)
  }
  assert.ok(ready, `Preview did not start: ${output}`)
  browser = await chromium.launch()
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  async function checkSkipLink() {
    await page
      .getByRole('link', { name: 'Skip to content', exact: true })
      .focus()
    await page.keyboard.press('Enter')
    assert.equal(
      await page.evaluate(
        () => document.activeElement === document.querySelector('main'),
      ),
      true,
      'Skip link must focus the main content',
    )
    await page.keyboard.press('Tab')
    assert.equal(
      await page.evaluate(() =>
        document.querySelector('main').contains(document.activeElement),
      ),
      true,
      'Tab after the skip link must bypass header navigation',
    )
  }
  await page.goto(base)
  await checkSkipLink()
  await page.locator('.catalog-controls').waitFor({ state: 'visible' })
  const cards = page.locator('[data-reusable]')
  const count = await cards.count()
  assert.ok(count > 0, 'The catalog must contain reusables')
  const links = await cards.evaluateAll((cards) =>
    cards.map((card) => card.href),
  )
  const search = page.getByRole('searchbox', { name: 'Search reusables' })
  await search.fill('withHistory')
  await page.waitForFunction(
    () =>
      document.querySelectorAll('[data-reusable]:not([hidden])').length === 1,
  )
  assert.match(
    await page.locator('[data-reusable]:visible').textContent(),
    /withHistory/,
  )
  await page.locator('[data-filter="factory"]').click()
  await page.locator('.empty-state').waitFor({ state: 'visible' })
  await page.getByRole('button', { name: 'Clear filters' }).click()
  assert.equal(await page.locator('[data-reusable]:visible').count(), count)
  assert.equal(await search.inputValue(), '')
  assert.equal(
    await search.evaluate((element) => document.activeElement === element),
    true,
  )
  await page.locator('[data-filter="extension"]').click()
  assert.ok((await page.locator('[data-reusable]:visible').count()) > 0)
  assert.deepEqual(
    await page
      .locator('[data-reusable]:visible')
      .evaluateAll((cards) => [
        ...new Set(cards.map((card) => card.dataset.type)),
      ]),
    ['extension'],
  )
  await page.locator('[data-filter="all"]').click()
  await page
    .getByRole('button', {
      name: 'Copy npx jsrepo init github/reatom/reusables',
      exact: true,
    })
    .click()
  await page.waitForFunction(
    () =>
      document.querySelector('.copy-status')?.textContent ===
      'Copied to clipboard',
  )
  assert.equal(
    await page.evaluate(() => navigator.clipboard.readText()),
    'npx jsrepo init github/reatom/reusables',
  )

  for (const width of [1440, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Homepage overflows at ${width}px`,
    )
  }
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.locator('input[type="search"]').blur()
  await page.evaluate(() => scrollTo(0, 0))
  if (process.env.SITE_SCREENSHOT)
    await page.screenshot({ path: process.env.SITE_SCREENSHOT, fullPage: true })

  for (const url of links) {
    const response = await page.goto(url)
    assert.equal(response.status(), 200, `Broken reusable route: ${url}`)
    await checkSkipLink()
    await page.getByRole('tab', { name: 'CLI', exact: true }).waitFor()
    const cli = page.getByRole('tab', { name: 'CLI', exact: true })
    await cli.focus()
    await page.keyboard.press('ArrowRight')
    assert.equal(
      await page
        .getByRole('tab', { name: 'Manual', exact: true })
        .getAttribute('aria-selected'),
      'true',
    )
    assert.equal(await page.getByRole('tabpanel').count(), 1)
    await page.keyboard.press('Home')
    assert.equal(await cli.getAttribute('aria-selected'), 'true')
    await page.setViewportSize({ width: 320, height: 800 })
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
      `Detail page overflows: ${url}`,
    )
    await page.setViewportSize({ width: 1440, height: 1000 })
    if (await page.locator('.mermaid-diagram').count()) {
      await page.locator('.mermaid-diagram[data-rendered] svg').waitFor()
      assert.equal(
        await page.locator('.mermaid-diagram[data-failed]').count(),
        0,
      )
    }
  }
  const noScript = await browser.newContext({ javaScriptEnabled: false })
  const staticPage = await noScript.newPage()
  await staticPage.goto(base)
  assert.equal(await staticPage.locator('[data-reusable]').count(), count)
  assert.equal(await staticPage.locator('.catalog-controls').isVisible(), false)
  assert.deepEqual(errors, [], 'Browser runtime errors')
  console.log(
    `Site checks passed: ${count} routes, search, filters, clipboard, keyboard tabs, diagrams, responsive layouts, and no-JS catalog.`,
  )
} finally {
  await browser?.close()
  const closed = once(server, 'exit')
  server.kill('SIGTERM')
  if (server.exitCode === null) await closed
}
