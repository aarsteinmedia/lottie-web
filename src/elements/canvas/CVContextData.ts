import type { Tuple } from '@/types'

import { ArrayType } from '@/utils/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import { Matrix } from '@/utils/Matrix'

class CanvasContext {
  fillStyle = ''
  id: number
  lineCap = ''
  lineJoin = ''
  lineWidth: number | string = ''
  miterLimit: number | string = ''
  opacity = -1
  strokeStyle = ''
  transform = createTypedArray(ArrayType.Float32, 16) as Tuple<number, 16>
  constructor() {
    this.id = Math.random()
  }
}

export class CVContextData {
  _length: number
  appliedFillStyle = ''
  appliedLineCap = ''
  appliedLineJoin = ''
  appliedLineWidth: string | number = ''
  appliedMiterLimit: string | number = ''
  appliedStrokeStyle = ''
  cArrPos = 0
  cTr = new Matrix()
  currentFillStyle = ''
  currentLineCap = ''
  currentLineJoin = ''
  currentLineWidth: string | number = ''
  currentMiterLimit: string | number = ''
  currentOpacity = 1
  currentStrokeStyle = ''
  nativeContext: null | CanvasRenderingContext2D = null
  stack: CanvasContext[] = []

  transformMat = new Matrix()

  constructor() {
    const len = 15

    for (let i = 0; i < len; i++) {
      const canvasContext = new CanvasContext()

      this.stack[i] = canvasContext
    }
    this._length = len
  }

  duplicate() {
    const newLength = this._length * 2

    for (let i = this._length; i < newLength; i++) {
      this.stack[i] = new CanvasContext()
    }
    this._length = newLength
  }

  fill(rule: CanvasFillRule) {
    if (this.nativeContext && this.appliedFillStyle !== this.currentFillStyle) {
      this.appliedFillStyle = this.currentFillStyle
      this.nativeContext.fillStyle = this.appliedFillStyle
    }
    this.nativeContext?.fill(rule)
  }

  fillRect(
    x: number, y: number, w: number, h: number
  ) {
    if (this.nativeContext && this.appliedFillStyle !== this.currentFillStyle) {
      this.appliedFillStyle = this.currentFillStyle
      this.nativeContext.fillStyle = this.appliedFillStyle
    }
    this.nativeContext?.fillRect(
      x, y, w, h
    )
  }

  fillStyle(value: string) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.fillStyle === value) {
      return
    }
    this.currentFillStyle = value

    thisStack.fillStyle = value

  }

  lineCap(value: string) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.lineCap === value) {
      return
    }
    this.currentLineCap = value

    thisStack.lineCap = value
  }

  lineJoin(value: string) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.lineJoin === value) {
      return
    }
    this.currentLineJoin = value
    thisStack.lineJoin = value
  }

  lineWidth(value: number) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.lineWidth === value) {
      return
    }
    this.currentLineWidth = value
    thisStack.lineWidth = value
  }

  miterLimit(value: number) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.miterLimit === value) {
      return
    }
    this.currentMiterLimit = value
    thisStack.miterLimit = value
  }

  opacity(op: number) {
    const thisStack = this.stack[this.cArrPos]

    let currentOpacity = thisStack.opacity

    currentOpacity *= op < 0 ? 0 : op
    if (thisStack.opacity !== currentOpacity) {
      if (this.nativeContext && this.currentOpacity !== op) {
        this.nativeContext.globalAlpha = op
        this.currentOpacity = op
      }
      thisStack.opacity = currentOpacity
    }
  }

  reset() {
    const thisStack = this.stack[this.cArrPos]

    this.cArrPos = 0
    this.cTr.reset()

    thisStack.opacity = 1
  }

  restore(forceRestore?: boolean) {
    this.cArrPos -= 1
    const currentContext = this.stack[this.cArrPos],
      {
        fillStyle, lineCap, lineJoin, lineWidth, miterLimit, opacity, strokeStyle, transform
      } = currentContext,
      arr = this.cTr.props

    for (let i = 0; i < 16; i++) {
      arr[i] = transform[i] ?? 0
    }
    if (forceRestore) {
      this.nativeContext?.restore()
      const prevStack = this.stack[this.cArrPos + 1]

      this.appliedFillStyle = prevStack.fillStyle
      this.appliedStrokeStyle = prevStack.strokeStyle
      this.appliedLineWidth = prevStack.lineWidth
      this.appliedLineCap = prevStack.lineCap
      this.appliedLineJoin = prevStack.lineJoin
      this.appliedMiterLimit = prevStack.miterLimit
    }
    this.nativeContext?.setTransform(
      transform[0],
      transform[1],
      transform[4],
      transform[5],
      transform[12],
      transform[13]
    )
    if (
      this.nativeContext &&
      (forceRestore ||
        opacity !== -1 &&
        this.currentOpacity !== opacity)
    ) {
      this.nativeContext.globalAlpha = opacity
      this.currentOpacity = opacity
    }
    this.currentFillStyle = fillStyle
    this.currentStrokeStyle = strokeStyle
    this.currentLineWidth = lineWidth
    this.currentLineCap = lineCap
    this.currentLineJoin = lineJoin
    this.currentMiterLimit = miterLimit
  }

  save(saveOnNativeFlag?: boolean) {
    if (saveOnNativeFlag) {
      this.nativeContext?.save()
    }
    const { props } = this.cTr

    if (this._length <= this.cArrPos) {
      this.duplicate()
    }

    const currentStack = this.stack[this.cArrPos]
    let i

    for (i = 0; i < 16; i++) {
      currentStack.transform[i] = props[i] ?? 0
    }
    this.cArrPos++
    const newStack = this.stack[this.cArrPos]

    newStack.opacity = currentStack.opacity
    newStack.fillStyle = currentStack.fillStyle
    newStack.strokeStyle = currentStack.strokeStyle
    newStack.lineWidth = currentStack.lineWidth
    newStack.lineCap = currentStack.lineCap
    newStack.lineJoin = currentStack.lineJoin
    newStack.miterLimit = currentStack.miterLimit
  }

  setContext(value: null | CanvasRenderingContext2D = null) {
    this.nativeContext = value
  }

  setOpacity(value: number) {
    const thisStack = this.stack[this.cArrPos]

    thisStack.opacity = value
  }

  stroke() {
    if (!this.nativeContext) {
      throw new Error(`${this.constructor.name}: nativeContext is not implemented`)
    }

    if (this.appliedStrokeStyle !== this.currentStrokeStyle) {
      this.appliedStrokeStyle = this.currentStrokeStyle
      this.nativeContext.strokeStyle = this.appliedStrokeStyle
    }
    if (this.appliedLineWidth !== this.currentLineWidth) {
      this.appliedLineWidth = this.currentLineWidth
      this.nativeContext.lineWidth = Number(this.appliedLineWidth)
    }
    if (this.appliedLineCap !== this.currentLineCap) {
      this.appliedLineCap = this.currentLineCap
      this.nativeContext.lineCap = this.appliedLineCap as CanvasLineCap
    }
    if (this.appliedLineJoin !== this.currentLineJoin) {
      this.appliedLineJoin = this.currentLineJoin
      this.nativeContext.lineJoin = this.appliedLineJoin as CanvasLineJoin
    }
    if (this.appliedMiterLimit !== this.currentMiterLimit) {
      this.appliedMiterLimit = this.currentMiterLimit
      this.nativeContext.miterLimit = Number(this.appliedMiterLimit)
    }
    this.nativeContext.stroke()
  }

  strokeStyle(value: string) {
    const thisStack = this.stack[this.cArrPos]

    if (thisStack.strokeStyle === value) {
      return
    }
    this.currentStrokeStyle = value

    thisStack.strokeStyle = value
  }

  transform(props: Float32Array) {
    this.transformMat.cloneFromProps(props)
    // Taking the last transform value from the stored stack of transforms
    const currentTransform = this.cTr

    // Applying the last transform value after the new transform to respect the order of transformations
    this.transformMat.multiply(currentTransform)
    // Storing the new transformed value in the stored transform
    currentTransform.cloneFromProps(this.transformMat.props)
    const trProps = currentTransform.props

    // Applying the new transform to the canvas
    this.nativeContext?.setTransform(
      trProps[0],
      trProps[1],
      trProps[4],
      trProps[5],
      trProps[12],
      trProps[13]
    )
  }
}
