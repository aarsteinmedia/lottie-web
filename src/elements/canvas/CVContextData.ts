import { ArrayType } from '@/enums'
import { createTypedArray } from '@/utils/helpers/arrays'
import Matrix from '@/utils/Matrix'

class CanvasContext {
  fillStyle: string
  id: number
  lineCap: string
  lineJoin: string
  lineWidth: string
  miterLimit: string
  opacity: number
  strokeStyle: string
  transform: number[]
  constructor() {
    this.opacity = -1
    this.transform = createTypedArray(ArrayType.Float32, 16) as number[]
    this.fillStyle = ''
    this.strokeStyle = ''
    this.lineWidth = ''
    this.lineCap = ''
    this.lineJoin = ''
    this.miterLimit = ''
    this.id = Math.random()
  }
}

export default class CVContextData {
  _length: number
  appliedFillStyle: string
  appliedLineCap: string
  appliedLineJoin: string
  appliedLineWidth: string
  appliedMiterLimit: string
  appliedStrokeStyle: string
  cArrPos: number
  cTr: Matrix
  currentFillStyle: string
  currentLineCap: string
  currentLineJoin: string
  currentLineWidth: string
  currentMiterLimit: string
  currentOpacity: number
  currentStrokeStyle: string
  nativeContext?: null | CanvasRenderingContext2D
  stack: CanvasContext[] = []

  transformMat: Matrix

  constructor() {
    this.stack = []
    this.cArrPos = 0
    this.cTr = new Matrix()
    const len = 15
    for (let i = 0; i < len; i += 1) {
      const canvasContext = new CanvasContext()
      this.stack[i] = canvasContext
    }
    this._length = len
    this.nativeContext = null as unknown as CanvasRenderingContext2D
    this.transformMat = new Matrix()
    this.currentOpacity = 1
    //
    this.currentFillStyle = ''
    this.appliedFillStyle = ''
    //
    this.currentStrokeStyle = ''
    this.appliedStrokeStyle = ''
    //
    this.currentLineWidth = ''
    this.appliedLineWidth = ''
    //
    this.currentLineCap = ''
    this.appliedLineCap = ''
    //
    this.currentLineJoin = ''
    this.appliedLineJoin = ''
    //
    this.appliedMiterLimit = ''
    this.currentMiterLimit = ''
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

  fillRect(x: number, y: number, w: number, h: number) {
    if (this.nativeContext && this.appliedFillStyle !== this.currentFillStyle) {
      this.appliedFillStyle = this.currentFillStyle
      this.nativeContext.fillStyle = this.appliedFillStyle
    }
    this.nativeContext?.fillRect(x, y, w, h)
  }

  fillStyle(value: string) {
    if (this.stack[this.cArrPos].fillStyle !== value) {
      this.currentFillStyle = value
      this.stack[this.cArrPos].fillStyle = value
    }
  }

  lineCap(value: string) {
    if (this.stack[this.cArrPos].lineCap !== value) {
      this.currentLineCap = value
      this.stack[this.cArrPos].lineCap = value
    }
  }

  lineJoin(value: string) {
    if (this.stack[this.cArrPos].lineJoin !== value) {
      this.currentLineJoin = value
      this.stack[this.cArrPos].lineJoin = value
    }
  }

  lineWidth(value: string) {
    if (this.stack[this.cArrPos].lineWidth !== value) {
      this.currentLineWidth = value
      this.stack[this.cArrPos].lineWidth = value
    }
  }

  miterLimit(value: string) {
    if (this.stack[this.cArrPos].miterLimit !== value) {
      this.currentMiterLimit = value
      this.stack[this.cArrPos].miterLimit = value
    }
  }

  opacity(op: number) {
    let currentOpacity = this.stack[this.cArrPos].opacity
    currentOpacity *= op < 0 ? 0 : op
    if (this.stack[this.cArrPos].opacity !== currentOpacity) {
      if (this.nativeContext && this.currentOpacity !== op) {
        this.nativeContext.globalAlpha = op
        this.currentOpacity = op
      }
      this.stack[this.cArrPos].opacity = currentOpacity
    }
  }

  reset() {
    this.cArrPos = 0
    this.cTr.reset()
    this.stack[this.cArrPos].opacity = 1
  }

  restore(forceRestore?: boolean) {
    this.cArrPos -= 1
    const currentContext = this.stack[this.cArrPos]
    const transform = currentContext.transform
    const arr = this.cTr.props
    for (let i = 0; i < 16; i += 1) {
      arr[i] = transform[i]
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
        (currentContext.opacity !== -1 &&
          this.currentOpacity !== currentContext.opacity))
    ) {
      this.nativeContext.globalAlpha = currentContext.opacity
      this.currentOpacity = currentContext.opacity
    }
    this.currentFillStyle = currentContext.fillStyle
    this.currentStrokeStyle = currentContext.strokeStyle
    this.currentLineWidth = currentContext.lineWidth
    this.currentLineCap = currentContext.lineCap
    this.currentLineJoin = currentContext.lineJoin
    this.currentMiterLimit = currentContext.miterLimit
  }

  save(saveOnNativeFlag?: boolean) {
    if (saveOnNativeFlag) {
      this.nativeContext?.save()
    }
    const props = this.cTr.props
    if (this._length <= this.cArrPos) {
      this.duplicate()
    }

    const currentStack = this.stack[this.cArrPos]
    let i
    for (i = 0; i < 16; i += 1) {
      currentStack.transform[i] = props[i]
    }
    this.cArrPos += 1
    const newStack = this.stack[this.cArrPos]
    newStack.opacity = currentStack.opacity
    newStack.fillStyle = currentStack.fillStyle
    newStack.strokeStyle = currentStack.strokeStyle
    newStack.lineWidth = currentStack.lineWidth
    newStack.lineCap = currentStack.lineCap
    newStack.lineJoin = currentStack.lineJoin
    newStack.miterLimit = currentStack.miterLimit
  }

  setContext(value?: null | CanvasRenderingContext2D) {
    this.nativeContext = value
  }

  setOpacity(value: number) {
    this.stack[this.cArrPos].opacity = value
  }

  stroke() {
    if (!this.nativeContext) {
      throw new Error(
        `${this.constructor.name}: nativeContext is not implemented`
      )
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
    if (this.stack[this.cArrPos].strokeStyle !== value) {
      this.currentStrokeStyle = value
      this.stack[this.cArrPos].strokeStyle = value
    }
  }

  transform(props: number[]) {
    this.transformMat.cloneFromProps(props)
    // Taking the last transform value from the stored stack of transforms
    const currentTransform = this.cTr
    // Applying the last transform value after the new transform to respect the order of transformations
    this.transformMat.multiply(currentTransform)
    // Storing the new transformed value in the stored transform
    currentTransform.cloneFromProps(
      this.transformMat.props as unknown as number[]
    )
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
