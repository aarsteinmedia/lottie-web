import type { ElementInterfaceUnion } from '@/types'

export default class ProcessedElement {
  elem: ElementInterfaceUnion
  pos: number
  constructor(element: ElementInterfaceUnion, position: number) {
    this.elem = element
    this.pos = position
  }
}