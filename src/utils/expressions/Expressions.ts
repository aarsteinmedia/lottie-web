import CompExpressionInterface from './CompInterface'
import ExpressionManager from './ExpressionManager'

const Expressions = (function () {
  const ob = {}
  ob.initExpressions = initExpressions
  ob.resetFrame = ExpressionManager.resetFrame

  function initExpressions(animation) {
    let stackCount = 0
    const registers = []

    function pushExpression() {
      stackCount += 1
    }

    function popExpression() {
      stackCount -= 1
      if (stackCount === 0) {
        releaseInstances()
      }
    }

    function registerExpressionProperty(expression) {
      if (registers.indexOf(expression) === -1) {
        registers.push(expression)
      }
    }

    function releaseInstances() {
      let i
      const len = registers.length
      for (i = 0; i < len; i += 1) {
        registers[i].release()
      }
      registers.length = 0
    }

    animation.renderer.compInterface = CompExpressionInterface(
      animation.renderer
    )
    animation.renderer.globalData.projectInterface.registerComposition(
      animation.renderer
    )
    animation.renderer.globalData.pushExpression = pushExpression
    animation.renderer.globalData.popExpression = popExpression
    animation.renderer.globalData.registerExpressionProperty =
      registerExpressionProperty
  }
  return ob
})()

export default Expressions
