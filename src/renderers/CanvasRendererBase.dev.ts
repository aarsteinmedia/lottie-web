import type CVContextData from '@/elements/canvas/CVContextData'
// import type { AnimationData } from '@/Lottie'
import type CanvasRenderer from '@/renderers/CanvasRenderer'
import type {
  CanvasRendererConfig,
  ElementInterfaceIntersect,
  LottieLayer,
  TransformCanvas,
} from '@/types'

import CVImageElement from '@/elements/canvas/CVImageElement'
import CVShapeElement from '@/elements/canvas/CVShapeElement.dev'
import CVSolidElement from '@/elements/canvas/CVSolidElement.dev'
import CVTextElement from '@/elements/canvas/CVTextElement'
import BaseRenderer from '@/renderers/BaseRenderer'
import SVGRenderer from '@/renderers/SVGRenderer'
import { createTag, extendPrototype } from '@/utils'
import { createSizedArray } from '@/utils/helpers/arrays'

export default function CanvasRendererBase() {}
extendPrototype([BaseRenderer], CanvasRendererBase)

CanvasRendererBase.prototype.createShape = function (data) {
  return new CVShapeElement(
    data, this.globalData, this
  )
}

CanvasRendererBase.prototype.createText = function (data) {
  return new CVTextElement(
    data, this.globalData, this
  )
}

CanvasRendererBase.prototype.createImage = function (data) {
  return new CVImageElement(
    data, this.globalData, this
  )
}

CanvasRendererBase.prototype.createSolid = function (data) {
  return new CVSolidElement(
    data, this.globalData, this
  )
}

CanvasRendererBase.prototype.createNull = SVGRenderer.prototype.createNull

CanvasRendererBase.prototype.ctxTransform = function (props) {
  if (
    props[0] === 1 &&
    props[1] === 0 &&
    props[4] === 0 &&
    props[5] === 1 &&
    props[12] === 0 &&
    props[13] === 0
  ) {
    return
  }
  this.canvasContext.transform(
    props[0],
    props[1],
    props[4],
    props[5],
    props[12],
    props[13]
  )
}

CanvasRendererBase.prototype.ctxOpacity = function (op) {
  this.canvasContext.globalAlpha *= op < 0 ? 0 : op
}

CanvasRendererBase.prototype.ctxFillStyle = function (value) {
  this.canvasContext.fillStyle = value
}

CanvasRendererBase.prototype.ctxStrokeStyle = function (value) {
  this.canvasContext.strokeStyle = value
}

CanvasRendererBase.prototype.ctxLineWidth = function (value) {
  this.canvasContext.lineWidth = value
}

CanvasRendererBase.prototype.ctxLineCap = function (value) {
  this.canvasContext.lineCap = value
}

CanvasRendererBase.prototype.ctxLineJoin = function (value) {
  this.canvasContext.lineJoin = value
}

CanvasRendererBase.prototype.ctxMiterLimit = function (value) {
  this.canvasContext.miterLimit = value
}

CanvasRendererBase.prototype.ctxFill = function (rule) {
  this.canvasContext.fill(rule)
}

CanvasRendererBase.prototype.ctxFillRect = function (
  x, y, w, h
) {
  this.canvasContext.fillRect(
    x, y, w, h
  )
}

CanvasRendererBase.prototype.ctxStroke = function () {
  this.canvasContext.stroke()
}

CanvasRendererBase.prototype.reset = function () {
  if (!this.renderConfig.clearCanvas) {
    this.canvasContext.restore()

    return
  }
  this.contextData.reset()
}

CanvasRendererBase.prototype.save = function () {
  this.canvasContext.save()
}

CanvasRendererBase.prototype.restore = function (actionFlag) {
  if (!this.renderConfig.clearCanvas) {
    this.canvasContext.restore()

    return
  }
  if (actionFlag) {
    this.globalData.blendMode = 'source-over'
  }
  this.contextData.restore(actionFlag)
}

CanvasRendererBase.prototype.configAnimation = function (animData) {
  if (this.animationItem.wrapper) {
    this.animationItem.container = createTag('canvas')
    const containerStyle = this.animationItem.container.style

    containerStyle.width = '100%'
    containerStyle.height = '100%'
    const origin = '0px 0px 0px'

    containerStyle.transformOrigin = origin
    containerStyle.mozTransformOrigin = origin
    containerStyle.webkitTransformOrigin = origin
    containerStyle['-webkit-transform'] = origin
    containerStyle.contentVisibility = this.renderConfig.contentVisibility
    this.animationItem.wrapper.appendChild(this.animationItem.container)
    this.canvasContext = this.animationItem.container.getContext('2d')
    if (this.renderConfig.className) {
      this.animationItem.container.setAttribute('class',
        this.renderConfig.className)
    }
    if (this.renderConfig.id) {
      this.animationItem.container.setAttribute('id', this.renderConfig.id)
    }
  } else {
    this.canvasContext = this.renderConfig.context
  }
  this.contextData.setContext(this.canvasContext)
  this.data = animData
  this.layers = animData.layers
  this.transformCanvas = {
    h: animData.h,
    sx: 0,
    sy: 0,
    tx: 0,
    ty: 0,
    w: animData.w,
  }
  this.setupGlobalData(animData, document.body)
  this.globalData.canvasContext = this.canvasContext
  this.globalData.renderer = this
  this.globalData.isDashed = false
  this.globalData.progressiveLoad = this.renderConfig.progressiveLoad
  this.globalData.transformCanvas = this.transformCanvas
  this.elements = createSizedArray(animData.layers.length)

  this.updateContainerSize()
}

CanvasRendererBase.prototype.updateContainerSize = function (width, height) {
  this.reset()
  let elementWidth
  let elementHeight

  if (width) {
    elementWidth = width
    elementHeight = height
    this.canvasContext.canvas.width = elementWidth
    this.canvasContext.canvas.height = elementHeight
  } else {
    if (this.animationItem.wrapper && this.animationItem.container) {
      elementWidth = this.animationItem.wrapper.offsetWidth
      elementHeight = this.animationItem.wrapper.offsetHeight
    } else {
      elementWidth = this.canvasContext.canvas.width
      elementHeight = this.canvasContext.canvas.height
    }
    this.canvasContext.canvas.width = elementWidth * this.renderConfig.dpr
    this.canvasContext.canvas.height = elementHeight * this.renderConfig.dpr
  }

  let elementRel
  let animationRel

  if (
    this.renderConfig.preserveAspectRatio.includes('meet') ||
    this.renderConfig.preserveAspectRatio.includes('slice')
  ) {
    const par = this.renderConfig.preserveAspectRatio.split(' ')
    const fillType = par[1] || 'meet'
    const pos = par[0] || 'xMidYMid'
    const xPos = pos.slice(0, 4)
    const yPos = pos.slice(4)

    elementRel = elementWidth / elementHeight
    animationRel = this.transformCanvas.w / this.transformCanvas.h
    if (
      animationRel > elementRel && fillType === 'meet' ||
      animationRel < elementRel && fillType === 'slice'
    ) {
      this.transformCanvas.sx =
        elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
      this.transformCanvas.sy =
        elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
    } else {
      this.transformCanvas.sx =
        elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
      this.transformCanvas.sy =
        elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
    }

    if (
      xPos === 'xMid' &&
      (animationRel < elementRel && fillType === 'meet' ||
        animationRel > elementRel && fillType === 'slice')
    ) {
      this.transformCanvas.tx =
        (elementWidth -
          this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) /
          2 *
          this.renderConfig.dpr
    } else if (
      xPos === 'xMax' &&
      (animationRel < elementRel && fillType === 'meet' ||
        animationRel > elementRel && fillType === 'slice')
    ) {
      this.transformCanvas.tx =
        (elementWidth -
          this.transformCanvas.w * (elementHeight / this.transformCanvas.h)) *
          this.renderConfig.dpr
    } else {
      this.transformCanvas.tx = 0
    }
    if (
      yPos === 'YMid' &&
      (animationRel > elementRel && fillType === 'meet' ||
        animationRel < elementRel && fillType === 'slice')
    ) {
      this.transformCanvas.ty =
        (elementHeight -
          this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) /
          2 *
          this.renderConfig.dpr
    } else if (
      yPos === 'YMax' &&
      (animationRel > elementRel && fillType === 'meet' ||
        animationRel < elementRel && fillType === 'slice')
    ) {
      this.transformCanvas.ty =
        (elementHeight -
          this.transformCanvas.h * (elementWidth / this.transformCanvas.w)) *
          this.renderConfig.dpr
    } else {
      this.transformCanvas.ty = 0
    }
  } else if (this.renderConfig.preserveAspectRatio === 'none') {
    this.transformCanvas.sx =
      elementWidth / (this.transformCanvas.w / this.renderConfig.dpr)
    this.transformCanvas.sy =
      elementHeight / (this.transformCanvas.h / this.renderConfig.dpr)
    this.transformCanvas.tx = 0
    this.transformCanvas.ty = 0
  } else {
    this.transformCanvas.sx = this.renderConfig.dpr
    this.transformCanvas.sy = this.renderConfig.dpr
    this.transformCanvas.tx = 0
    this.transformCanvas.ty = 0
  }
  this.transformCanvas.props = [
    this.transformCanvas.sx,
    0,
    0,
    0,
    0,
    this.transformCanvas.sy,
    0,
    0,
    0,
    0,
    1,
    0,
    this.transformCanvas.tx,
    this.transformCanvas.ty,
    0,
    1,
  ]
  /* var i, len = this.elements.length;
    for(i=0;i<len;i+=1){
        if(this.elements[i] && this.elements[i].data.ty === 0){
            this.elements[i].resize(this.globalData.transformCanvas);
        }
    } */
  this.ctxTransform(this.transformCanvas.props)
  this.canvasContext.beginPath()
  this.canvasContext.rect(
    0, 0, this.transformCanvas.w, this.transformCanvas.h
  )
  this.canvasContext.closePath()
  this.canvasContext.clip()

  this.renderFrame(this.renderedFrame, true)
}

CanvasRendererBase.prototype.destroy = function () {
  if (this.renderConfig.clearCanvas && this.animationItem.wrapper) {
    this.animationItem.wrapper.innerText = ''
  }
  let i
  const len = this.layers ? this.layers.length : 0

  for (i = len - 1; i >= 0; i -= 1) {
    if (this.elements[i]?.destroy) {
      this.elements[i].destroy()
    }
  }
  this.elements.length = 0
  this.globalData.canvasContext = null
  this.animationItem.container = null
  this.destroyed = true
}

CanvasRendererBase.prototype.renderFrame = function (num, forceRender) {
  if (
    this.renderedFrame === num &&
    this.renderConfig.clearCanvas === true &&
    !forceRender ||
    this.destroyed ||
    num === -1
  ) {
    return
  }
  this.renderedFrame = num
  this.globalData.frameNum = num - this.animationItem._isFirstFrame
  this.globalData.frameId += 1
  this.globalData._mdf = !this.renderConfig.clearCanvas || forceRender
  this.globalData.projectInterface.currentFrame = num

  // console.log('--------');
  // console.log('NEW: ',num);
  let i
  const len = this.layers.length

  if (!this.completeLayers) {
    this.checkLayers(num)
  }

  for (i = len - 1; i >= 0; i -= 1) {
    if (this.completeLayers || this.elements[i]) {
      this.elements[i].prepareFrame(num - this.layers[i].st)
    }
  }
  if (this.globalData._mdf) {
    if (this.renderConfig.clearCanvas === true) {
      this.canvasContext.clearRect(
        0,
        0,
        this.transformCanvas.w,
        this.transformCanvas.h
      )
    } else {
      this.save()
    }
    for (i = len - 1; i >= 0; i -= 1) {
      if (this.completeLayers || this.elements[i]) {
        this.elements[i].renderFrame()
      }
    }
    if (this.renderConfig.clearCanvas !== true) {
      this.restore()
    }
  }
}

CanvasRendererBase.prototype.buildItem = function (pos) {
  const { elements } = this

  if (elements[pos] || this.layers[pos].ty === 99) {
    return
  }
  const element = this.createItem(
    this.layers[pos], this, this.globalData
  )

  elements[pos] = element
  element.initExpressions()
  /* if(this.layers[pos].ty === 0){
        element.resize(this.globalData.transformCanvas);
    } */
}

CanvasRendererBase.prototype.checkPendingElements = function () {
  while (this.pendingElements.length > 0) {
    const element = this.pendingElements.pop()

    element.checkParenting()
  }
}

CanvasRendererBase.prototype.hide = function () {
  this.animationItem.container.style.display = 'none'
}

CanvasRendererBase.prototype.show = function () {
  this.animationItem.container.style.display = 'block'
}
