const assert = require('node:assert/strict')
const path = require('node:path')
const Module = require('node:module')
require('ts-node').register({
  transpileOnly: true,
  compilerOptions: { module: 'commonjs', moduleResolution: 'node', jsx: 'react-jsx' },
})
const resolve = Module._resolveFilename
Module._resolveFilename = function (id, ...rest) {
  return resolve.call(
    this,
    id.startsWith('@/') ? path.join(process.cwd(), id.slice(2)) : id,
    ...rest
  )
}
const { Effect } = require('effect')
const { Entity } = require('../lib/game/entity')
const { ActionType } = require('../lib/restaurant/action')
const { getRecipe } = require('../lib/restaurant/restaurant')
const { default: constraints } = require('../lib/game-constraints')

// The new machine must occupy the empty space without obscuring existing equipment.
const bounds = (machine) => ({
  x: machine.getX(900, true),
  y: machine.getY(600),
  width: machine.getWidth(),
  height: machine.getHeight(),
})
const ice = bounds(constraints.IceMaker)
assert(ice.x >= 0 && ice.y >= 0 && ice.x + ice.width <= 900 && ice.y + ice.height <= 600)
for (const name of ['Fridge', 'Pot', 'Pan', 'Grill', 'Sink', 'Knife', 'Fryer']) {
  const other = bounds(constraints[name])
  assert(
    !(
      ice.x < other.x + other.width &&
      ice.x + ice.width > other.x &&
      ice.y < other.y + other.height &&
      ice.y + ice.height > other.y
    ),
    name
  )
}

// Exercise the actual entity timer and completion logic, without requiring a GPU.
for (const theme of ['default-cafe', 'joseon-cafe']) {
  const recipe = getRecipe(theme, 'ko')
  const actions = Effect.runSync(recipe.getAllActions()).filter((a) => a.type === ActionType.Ice)
  assert(actions.length > 0)
  for (const action of actions) {
    const made = []
    let destroyed = false
    const entity = Object.create(Entity.prototype)
    Object.defineProperties(entity, { x: { value: 100 }, y: { value: 100 } })
    Object.assign(entity, {
      action,
      actionProgress: action.effort * constraints.Tick.getEffortMultiplier() - 1,
      getChildByLabel: () => null,
      gameManager: {
        addEntity: (item) => made.push(item.id),
        destroyEntity: () => {
          destroyed = true
        },
      },
    })
    entity.nextTick(1)
    assert(destroyed)
    assert.deepEqual(
      made,
      action.output.map((item) => item.id)
    )
  }
  console.log(`${theme}: ${actions.length} freezing recipes completed with correct outputs`)
}
console.log('Sandbox machine bounds passed')
