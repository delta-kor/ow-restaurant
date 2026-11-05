// v261101: Exercise the actual TS selection code and recipe construction.
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node' },
})
const path = require('path'),
  Module = require('module'),
  assert = require('node:assert/strict')
const resolve = Module._resolveFilename
Module._resolveFilename = function (id, ...rest) {
  return resolve.call(
    this,
    id.startsWith('@/') ? path.join(process.cwd(), id.slice(2)) : id,
    ...rest
  )
}
const { selectDataLanguage, parseBookPath, editions } = require('../../lib/restaurant/catalog.ts')
const { getRecipeSelection } = require('../../lib/restaurant/restaurant.ts')
for (const [available, locale, expected] of [
  [['ko'], 'ja', 'ko'],
  [['ko', 'en'], 'ja', 'en'],
  [['zh-CN', 'zh-TW'], 'en', 'zh-CN'],
  [['en', 'ja'], 'ja', 'ja'],
  [['zh-TW'], 'ko', 'zh-TW'],
])
  assert.equal(selectDataLanguage(available, locale), expected)
for (const locale of ['ko', 'en', 'ja', 'zh-CN', 'zh-TW']) {
  for (const edition of editions)
    for (const theme of edition.themes) {
      const { recipe, language } = getRecipeSelection(theme, locale)
      assert(recipe.stages.length > 0)
      const cafe = theme === 'default-cafe' || theme === 'joseon-cafe'
      assert.equal(recipe.heatingAppliance, cafe ? 'oven' : 'grill')
      assert.equal(recipe.hasIceMaker, cafe)
      if (theme.startsWith('joseon')) assert.equal(language, 'ko')
      for (const stage of recipe.stages)
        assert.equal(stage.additionalMenu, theme === 'default-classic' && stage.id === 11)
    }
}
assert.deepEqual(parseBookPath(['cafe-en', '0']), { theme: 'default-cafe', stage: 0 })
assert.deepEqual(parseBookPath(['new-third', '11']), { theme: 'joseon-third', stage: 11 })
assert.equal(parseBookPath(['unknown', '0']), null)
assert.equal(parseBookPath(['third', '1oops']), null)
console.log(
  'Locale fallback, 30 selections, constructor references, butcher policy and legacy links passed'
)
