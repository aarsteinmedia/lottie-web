import { createNS } from '@/utils/helpers/svgElements'

export abstract class SVGComposableEffect {
  createMergeNode(resultId: string, ins: string[]) {
    const feMerge = createNS<SVGFEMergeElement>('feMerge')

    feMerge.setAttribute('result', resultId)
    let feMergeNode

    for (let i = 0; i < ins.length; i++) {
      feMergeNode = createNS<SVGFEMergeNodeElement>('feMergeNode')
      feMergeNode.setAttribute('in', ins[i])
      feMerge.appendChild(feMergeNode)
      feMerge.appendChild(feMergeNode)
    }

    return feMerge
  }
}
