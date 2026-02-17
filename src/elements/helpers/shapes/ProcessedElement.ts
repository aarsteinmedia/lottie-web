import type { ElementInterfaceIntersect } from '@/types'

export class ProcessedElement {
  elem: ElementInterfaceIntersect
  pos: number
  constructor(element: ElementInterfaceIntersect, position: number) {
    this.elem = element
    this.pos = position
  }
}