import type { Transformer, TransformSequence } from '@/types'

import Matrix from '@/utils/Matrix'

export default class ShapeTransformManager {
  sequenceList: TransformSequence[]
  sequences: TransformSequence
  // eslint-disable-next-line @typescript-eslint/naming-convention
  transform_key_count: number
  constructor() {
    this.sequences = {}
    this.sequenceList = []
    this.transform_key_count = 0
  }
  addTransformSequence(transforms: { transform: Transformer }[]) {
    const { length } = transforms
    let key = '_'

    for (let i = 0; i < length; i++) {

      key += `${transforms[i].transform.key}_`
    }
    let sequence = this.sequences[key]

    if (!sequence) {
      sequence = {
        _mdf: false,
        finalTransform: new Matrix(),
        transforms: [...transforms],
      }
      this.sequences[key] = sequence
      this.sequenceList.push(sequence as TransformSequence)
    }

    return sequence
  }
  getNewKey() {
    this.transform_key_count++

    return `_${this.transform_key_count}`
  }
  processSequence(sequence: TransformSequence, isFirstFrame?: boolean) {
    let i = 0
    const { length } = sequence.transforms ?? []
    // eslint-disable-next-line @typescript-eslint/naming-convention
    let _mdf = isFirstFrame

    if (!isFirstFrame) {
      while (i < length) {
        if (sequence.transforms?.[i].transform.mProps._mdf) {
          _mdf = true
          break
        }
        i++
      }
    }

    if (_mdf) {
      sequence.finalTransform?.reset()
      for (i = length - 1; i >= 0; i -= 1) {
        const { v: matrix } = sequence.transforms?.[i].transform.mProps ?? { v: null }

        if (matrix) {
          sequence.finalTransform?.multiply(matrix)
        }
      }
    }
    sequence._mdf = _mdf
  }
  processSequences(isFirstFrame?: boolean) {
    const { length } = this.sequenceList

    for (let i = 0; i < length; i++) {
      this.processSequence(this.sequenceList[i], isFirstFrame)
    }
  }
}
