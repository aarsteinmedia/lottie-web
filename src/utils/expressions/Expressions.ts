import type { AnimationItem } from '@/Lottie'
import type PoolFactory from '@/utils/pooling/PoolFactory'

import CompExpressionInterface from '@/utils/expressions/CompInterface'
import ExpressionManager from '@/utils/expressions/ExpressionManager'

export default class Expressions {
  private registers: PoolFactory[]

  private stackCount: number

  constructor(animation: AnimationItem) {
    this.stackCount = 0
    this.registers = []

    const { resetFrame } = ExpressionManager.prototype

    this.resetFrame = resetFrame

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!animation.renderer) {
      // TODO: This does not work for now
      return
      throw new Error(`${this.constructor.name}: renderer is not implemented`)
    }

    if (!animation.renderer.globalData) {
      throw new Error(`${this.constructor.name}: globalData is not implemented in renderer`)
    }

    animation.renderer.compInterface = new CompExpressionInterface(animation.renderer)
    animation.renderer.globalData.projectInterface.registerComposition(animation.renderer)
    animation.renderer.globalData.pushExpression = this.pushExpression
    animation.renderer.globalData.popExpression = this.popExpression
    animation.renderer.globalData.registerExpressionProperty =
      this.registerExpressionProperty
  }

  public resetFrame() {
    throw new Error(`${this.constructor.name}: Method resetFrame is not implemented`)
  }
  private popExpression() {
    this.stackCount -= 1
    if (this.stackCount === 0) {
      this.releaseInstances()
    }
  }

  private pushExpression() {
    this.stackCount += 1
  }
  private registerExpressionProperty(expression: PoolFactory) {
    if (!this.registers.includes(expression)) {
      this.registers.push(expression)
    }
  }
  private releaseInstances() {
    const { length } = this.registers

    for (let i = 0; i < length; i++) {
      this.registers[i].release()
    }
    this.registers.length = 0
  }
}
