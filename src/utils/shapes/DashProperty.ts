import type { ElementInterfaceIntersect, StrokeData } from '@/types'

import { ArrayType, RendererType } from '@/utils/enums'
import { createSizedArray, createTypedArray } from '@/utils/helpers/arrays'
import DynamicPropertyContainer from '@/utils/helpers/DynamicPropertyContainer'
import PropertyFactory from '@/utils/PropertyFactory'

export default class DashProperty extends DynamicPropertyContainer {
  dashArray: Float32Array
  dashoffset: Float32Array
  dashStr: string
  dataProps: StrokeData[]
  elem: ElementInterfaceIntersect
  frameId: number
  k: boolean
  renderer: RendererType
  constructor(
    elem: ElementInterfaceIntersect,
    data: StrokeData[],
    renderer: RendererType,
    container: ElementInterfaceIntersect
  ) {
    super()
    this.elem = elem
    this.frameId = -1
    this.dataProps = createSizedArray(data.length)
    this.renderer = renderer
    this.k = false
    this.dashStr = ''
    this.dashArray = createTypedArray(ArrayType.Float32,
      data.length > 0 ? data.length - 1 : 0) as Float32Array
    this.dashoffset = createTypedArray(ArrayType.Float32, 1) as Float32Array
    this.initDynamicPropertyContainer(container)
    const len = data.length || 0
    let prop

    for (let i = 0; i < len; i++) {
      prop = PropertyFactory.getProp(
        elem,
        data[i].v,
        0,
        0,
        this as unknown as ElementInterfaceIntersect
      )
      this.k = prop.k || this.k
      this.dataProps[i] = {
        n: data[i].n,
        p: prop
      }
    }
    if (!this.k) {
      this.getValue(true)
    }
    this._isAnimated = this.k
  }

  override getValue(forceRender?: boolean) {
    if (this.elem.globalData?.frameId === this.frameId && !forceRender) {
      return 0
    }
    if (this.elem.globalData?.frameId) {
      this.frameId = this.elem.globalData.frameId
    }

    this.iterateDynamicProperties()
    this._mdf = this._mdf || Boolean(forceRender)
    if (!this._mdf) {
      return 0
    }
    const len = this.dataProps.length

    if (this.renderer === RendererType.SVG) {
      this.dashStr = ''
    }
    for (let i = 0; i < len; i++) {
      if (this.dataProps[i].n === 'o') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.dashoffset[0] = this.dataProps[i].p.v as number
        continue
      }
      if (this.renderer === RendererType.SVG) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        this.dashStr += ` ${this.dataProps[i].p.v}`
        continue
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      this.dashArray[i] = this.dataProps[i].p.v as number
    }

    return 0
  }
}
