import type { Vector3, Vector4 } from '@/types'

export default class LetterProps {
  __complete?: boolean
  _mdf: {
    fc: boolean
    m: boolean
    o: boolean
    p: boolean
    sc: boolean
    sw: boolean
  }
  fc?: string | number[]
  m?: number | string
  o?: number
  p?: number | number[]
  sc?: string | number[]
  sw?: number
  t?: string

  constructor(
    o?: number,
    sw?: number,
    sc?: string,
    fc?: string,
    m?: number | string,
    p?: number
  ) {
    this.o = o
    this.sw = sw
    this.sc = sc
    this.fc = fc
    this.m = m
    this.p = p
    this._mdf = {
      fc: Boolean(fc),
      m: true,
      o: true,
      p: true,
      sc: Boolean(sc),
      sw: Boolean(sw),
    }
  }

  update(
    o: number,
    sw: number,
    sc: Vector3 | Vector4,
    fc: Vector3 | Vector4,
    m: number,
    p: number | number[]
  ) {
    this._mdf.o = false
    this._mdf.sw = false
    this._mdf.sc = false
    this._mdf.fc = false
    this._mdf.m = false
    this._mdf.p = false
    let isUpdated = false

    if (this.o !== o) {
      this.o = o
      this._mdf.o = true
      isUpdated = true
    }
    if (this.sw !== sw) {
      this.sw = sw
      this._mdf.sw = true
      isUpdated = true
    }
    if (this.sc !== sc) {
      this.sc = sc
      this._mdf.sc = true
      isUpdated = true
    }
    if (this.fc !== fc) {
      this.fc = fc
      this._mdf.fc = true
      isUpdated = true
    }
    if (this.m !== m) {
      this.m = m
      this._mdf.m = true
      isUpdated = true
    }
    if (
      Array.isArray(p) &&
      p.length > 0 &&
      ((this.p as number[])[0] !== p[0] ||
        (this.p as number[])[1] !== p[1] ||
        (this.p as number[])[4] !== p[4] ||
        (this.p as number[])[5] !== p[5] ||
        (this.p as number[])[12] !== p[12] ||
        (this.p as number[])[13] !== p[13])
    ) {
      this.p = p
      this._mdf.p = true
      isUpdated = true
    }

    return isUpdated
  }
}
