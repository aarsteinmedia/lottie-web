import Matrix from '@/utils/Matrix'

export default class ShapeTransformManager {
  constructor() {
    this.sequences = {}
    this.sequenceList = []
    this.transform_key_count = 0
  }

  addTransformSequence(transforms) {
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
        transforms: [].concat(transforms),
      }
      this.sequences[key] = sequence
      this.sequenceList.push(sequence)
    }
    return sequence
  }
  getNewKey() {
    this.transform_key_count++
    return `_${this.transform_key_count}`
  }
  processSequence(sequence, isFirstFrame?: boolean) {
    let i = 0
    const { length } = sequence.transforms
    let _mdf = isFirstFrame
    while (i < length && !isFirstFrame) {
      if (sequence.transforms[i].transform.mProps._mdf) {
        _mdf = true
        break
      }
      i++
    }
    if (_mdf) {
      sequence.finalTransform.reset()
      for (i = length - 1; i >= 0; i -= 1) {
        sequence.finalTransform.multiply(
          sequence.transforms[i].transform.mProps.v
        )
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
