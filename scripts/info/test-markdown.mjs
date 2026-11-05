import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const markdown = readFileSync(new URL('../../content/info/ko/customers.md', import.meta.url), 'utf8')
const html = renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, markdown))
assert.equal(html.replace(/<[^>]*>/g, '').includes('**'), false, 'Emphasis delimiters must not leak into rendered descriptions')
for (const kind of ['advantage', 'penalty', 'mechanic']) {
  const count = [...markdown.matchAll(new RegExp(`\\(#${kind}\\)`, 'g'))].length
  assert.ok(count > 0)
  assert.equal([...html.matchAll(new RegExp(`href="#${kind}"><strong>`, 'g'))].length, count, `${kind} emphasis must render as bold`)
}
assert.equal((html.match(/<h2>/g) || []).length, 21)
console.log('All 21 customer descriptions render without leaked Markdown; all three emphasis colors retain bold formatting.')

const items = JSON.parse(readFileSync(new URL('../../content/info/ko/items.json', import.meta.url), 'utf8'))
const itemMarkdown = readFileSync(new URL('../../content/info/ko/items.md', import.meta.url), 'utf8')
const itemHtml = renderToStaticMarkup(createElement(ReactMarkdown, { remarkPlugins: [remarkGfm] }, itemMarkdown))
assert.equal(itemHtml.replace(/<[^>]*>/g, '').includes('**'), false)
const described = [...itemMarkdown.matchAll(/^## \[item (\d+)\]$/gm)].map(match => Number(match[1]))
assert.equal(new Set(described).size, 20)
assert.deepEqual([...described].sort((a,b) => a-b), items.map(item => item.id).sort((a,b) => a-b))
assert.equal(items.find(item => item.id === 19).icon, 'panopticon')
assert.equal(items.find(item => item.id === 17).icon, 'roll')
assert.deepEqual(items.find(item => item.id === 3).keys, ['primary-fire', 'interact'])
assert.deepEqual(items.find(item => item.id === 20).keys, ['secondary-fire'])
console.log('All 20 item descriptions, legacy item-to-icon remaps and mouse input bindings passed.')
