const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const Module = require('node:module')
const root = path.resolve(__dirname, '../..')
const original = Module._resolveFilename
Module._resolveFilename = function (request, ...args) {
  return original.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args)
}
require('ts-node').register({transpileOnly:true, compilerOptions:{module:'CommonJS',moduleResolution:'node',jsx:'react-jsx'}})
const {getInfoLocale,resolveInfoTerms,infoLocales} = require('../../lib/info-locales')
const terms = require('../../content/info/terms.json')
const ui = require('../../content/info/ui.json')
const customers = require('../../content/info/ko/customers.json')
const items = require('../../content/info/ko/items.json')
const read = (locale, kind) => fs.readFileSync(path.join(root, `content/info/${locale}/${kind}.md`), 'utf8')
;(async () => {
  const {createElement} = require('react')
  const {renderToStaticMarkup} = require('react-dom/server')
  const {default: Markdown} = await import('react-markdown')
  for (const locale of infoLocales) {
    assert.deepEqual(Object.keys(ui[locale]).sort(),Object.keys(ui.ko).sort())
    assert.deepEqual(Object.keys(terms[locale].items).sort(),Object.keys(terms.ko.items).sort())
    assert.deepEqual(Object.keys(terms[locale].customers).sort(),Object.keys(terms.ko.customers).sort())
    const resource = getInfoLocale(locale)
    for (const kind of ['customers','items','modes']) {
      const md = resolveInfoTerms(read(locale,kind),locale)
      assert.equal(md.includes('{{'),false,`${locale}/${kind}: unresolved term`)
      assert.equal((md.match(/^## /gm)||[]).length,kind==='customers'?21:kind==='items'?20:6)
      const html=renderToStaticMarkup(createElement(Markdown,null,md))
      assert.equal(html.replace(/<[^>]*>/g,'').includes('**'),false,`${locale}/${kind}: leaked Markdown`)
      if(locale!=='ko') assert.equal(/[가-힣]/.test(md),false,`${locale}/${kind}: Korean text`)
      if(kind==='customers') {
        for(const customer of customers) assert.ok(md.includes(resource.terms.customers[customer.slug]))
        assert.deepEqual([...md.matchAll(/\[hero ([^\]]+)\]/g)].map(x=>x[1]),[...read('ko',kind).matchAll(/\[hero ([^\]]+)\]/g)].map(x=>x[1]))
      }
      if(kind==='items') assert.deepEqual([...md.matchAll(/\[item (\d+)\]/g)].map(x=>x[1]),[...read('ko',kind).matchAll(/\[item (\d+)\]/g)].map(x=>x[1]))
      if(kind==='modes') for(const name of resource.terms.modes) assert.ok(md.includes(`## ${name}`))
    }
    for(const item of items) assert.ok(resource.terms.items[String(item.id)])
    console.log(`${locale}: 21 customers, 20 items, 6 modes, terminology, UI keys and Markdown passed.`)
  }
})().catch(error=>{console.error(error);process.exitCode=1})
