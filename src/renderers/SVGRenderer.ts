import type AnimationItem from '@/animation/AnimationItem'
import type {
  ElementInterfaceIntersect,
  GlobalData,
  LottieLayer,
  SVGRendererConfig,
} from '@/types'

import SVGCompElement from '@/elements/svg/SVGCompElement'
import SVGRendererBase from '@/renderers/SVGRendererBase'
import { createElementID } from '@/utils'
import { RendererType } from '@/utils/enums'
import createNS from '@/utils/helpers/svgElements'

export default class SVGRenderer extends SVGRendererBase {
  rendererType: RendererType

  constructor(animationItem: AnimationItem, config?: SVGRendererConfig) {
    super()
    this.animationItem = animationItem
    this.layers = []
    this.renderedFrame = -1
    this.svgElement = createNS<SVGSVGElement>('svg')
    let ariaLabel = ''

    if (config?.title) {
      const titleElement = createNS<SVGTitleElement>('title'),
        titleId = createElementID()

      titleElement.id = titleId
      titleElement.textContent = config.title
      this.svgElement.appendChild(titleElement)
      ariaLabel += titleId
    }
    if (config?.description) {
      const descElement = createNS<SVGDescElement>('desc'),
        descId = createElementID()

      descElement.id = descId
      descElement.textContent = config.description
      this.svgElement.appendChild(descElement)
      ariaLabel += ` ${descId}`
    }
    if (ariaLabel) {
      this.svgElement.setAttribute('aria-labelledby', ariaLabel)
    }
    const defs = createNS<SVGDefsElement>('defs')

    this.svgElement.appendChild(defs)
    const maskElement = createNS<SVGGElement>('g')

    this.svgElement.appendChild(maskElement)
    this.layerElement = maskElement
    this.renderConfig = {
      className: config?.className || '',
      contentVisibility: config?.contentVisibility || 'visible',
      filterSize: {
        height: config?.filterSize?.height || '100%',
        width: config?.filterSize?.width || '100%',
        x: config?.filterSize?.x || '0%',
        y: config?.filterSize?.y || '0%',
      },
      focusable: config?.focusable,
      height: config?.height,
      hideOnTransparent: config?.hideOnTransparent !== false,
      id: config?.id || '',
      imagePreserveAspectRatio:
        config?.imagePreserveAspectRatio || 'xMidYMid slice',
      preserveAspectRatio: config?.preserveAspectRatio || 'xMidYMid meet',
      progressiveLoad: config?.progressiveLoad || false,
      runExpressions:
        !config || config.runExpressions === undefined || config.runExpressions,
      viewBoxOnly: config?.viewBoxOnly || false,
      viewBoxSize: config?.viewBoxSize || false,
      width: config?.width,
    }

    this.globalData = {
      _mdf: false,
      defs,
      frameNum: -1,
      frameRate: 60,
      renderConfig: this.renderConfig,
    } as GlobalData
    this.elements = []
    this.pendingElements = []
    this.destroyed = false
    this.rendererType = RendererType.SVG
  }

  override createComp(data: LottieLayer) {
    if (!this.globalData) {
      throw new Error(`${this.constructor.name}: Can't access globalData`)
    }

    return new SVGCompElement(
      data,
      this.globalData,
      this as unknown as ElementInterfaceIntersect
    )
  }
}