const assert = require('node:assert/strict')
const vm = require('node:vm')
require('ts-node').register({ transpileOnly: true, compilerOptions: { module: 'CommonJS', moduleResolution: 'node' } })
const { normalizeScreenTheme, resolveScreenTheme, themeInitScript } = require('../lib/theme.ts')
for (const systemDark of [false, true]) {
  for (const choice of ['system', 'light', 'dark', undefined, 'invalid']) {
    const preference = normalizeScreenTheme(choice)
    const expected = resolveScreenTheme(preference, systemDark)
    const root = { dataset: {}, style: {} }
    vm.runInNewContext(themeInitScript, {
      localStorage: { getItem: () => JSON.stringify({ screenTheme: choice }) },
      matchMedia: () => ({ matches: systemDark }),
      document: { documentElement: root },
    })
    assert.equal(root.dataset.theme, expected)
    assert.equal(root.style.colorScheme, expected)
  }
}
for (const broken of ['{bad', 'null', '[]']) {
  const root = { dataset: {}, style: {} }
  vm.runInNewContext(themeInitScript, {
    localStorage: { getItem: () => broken },
    matchMedia: () => ({ matches: true }), document: { documentElement: root },
  })
  assert.equal(root.dataset.theme, 'dark')
}
const root = { dataset: {}, style: {} }
vm.runInNewContext(themeInitScript, {
  localStorage: { getItem: () => { throw new Error('Storage disabled') } },
  matchMedia: () => ({ matches: true }), document: { documentElement: root },
})
assert.equal(root.dataset.theme, 'dark')
console.log('Theme resolution and first-paint initialization passed: system changes, manual overrides, old settings, invalid data and blocked storage.')
