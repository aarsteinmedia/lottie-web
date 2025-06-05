import createNS from '@/utils/helpers/svgElements'

export default abstract class SVGComposableEffect {
  createMergeNode(resultId: string, ins: string[]) {
    const feMerge = createNS<SVGFEMergeElement>('feMerge')

    feMerge.setAttribute('result', resultId)
    let feMergeNode
    const { length } = ins

    for (let i = 0; i < length; i++) {
      feMergeNode = createNS<SVGFEMergeNodeElement>('feMergeNode')
      feMergeNode.setAttribute('in', ins[i])
      feMerge.appendChild(feMergeNode)
      feMerge.appendChild(feMergeNode)
    }

    return feMerge
  }
}
