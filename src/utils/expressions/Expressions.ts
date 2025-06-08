import type { AnimationItem } from '@/Lottie'
import type { ExpressionProperty } from '@/types'

import CompExpressionInterface from '@/utils/expressions/CompInterface'
import ExpressionManager from '@/utils/expressions/ExpressionManager'

const { resetFrame } = ExpressionManager

function initExpressions(animation: AnimationItem) {
  let stackCount = 0

  const registers: ExpressionProperty[] = []

  function pushExpression() {
    stackCount++
  }

  function popExpression() {
    stackCount--
    if (stackCount === 0) {
      releaseInstances()
    }
  }

  function registerExpressionProperty(expression: ExpressionProperty) {
    if (!registers.includes(expression)) {
      registers.push(expression)
    }
  }

  function releaseInstances() {
    const { length } = registers

    for (let i = 0; i < length; i++) {
      registers[i].release?.()
    }
    registers.length = 0
  }

  if (!animation.renderer.globalData) {
    throw new Error('Renderer -> GlobalData is not set')
  }

  animation.renderer.compInterface = new CompExpressionInterface(animation.renderer)
  animation.renderer.globalData.projectInterface.registerComposition(animation.renderer)
  animation.renderer.globalData.pushExpression = pushExpression
  animation.renderer.globalData.popExpression = popExpression
  animation.renderer.globalData.registerExpressionProperty = registerExpressionProperty
}

const Expressions = {
  initExpressions,
  resetFrame
}

export default Expressions
