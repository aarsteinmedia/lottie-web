
/** ARC4.
*
* An ARC4 implementation.  The constructor takes a key in the form of
* an array of at most (width) integers that should be 0 \<= x \< (width).
*
* The g(count) method returns a pseudorandom integer that concatenates
* the next (count) outputs from ARC4.  Its return value is a number x
* that is in the range 0 \<= x \< (width ^ count).
*
*/

export class ARC4 {
  public i = 0
  public j = 0
  public S: number[] = []

  private _mask
  private _width: number

  constructor(
    keyFromProps: number[], width: number, mask: number
  ) {
    this._mask = mask
    this._width = width

    let key = keyFromProps,
      { length: keyLen } = key,
      i = 0,
      j = 0,
      t

    const s = this.S

    if (!keyLen) {
      key = [keyLen++]
    }

    while (i < width) {
      s[i] = i++
    }

    for (i = 0; i < this._width; i++) {
      s[i] = s[j = this._mask & j + (key[i % keyLen] ?? 0) + (t = s[i] ?? 0)] ?? 0
      s[j] = t
    }
  }

  /**
   * The "g" method returns the next (count) outputs as one number.
   */
  public g(countFromProps: number) {
    let count = countFromProps,
      /**
       * Using instance members instead of closure state nearly doubles speed.
       */
      t,
      r = 0
    const s = this.S

    while (count--) {
      t = s[this.i = this._mask & this.i + 1] ?? 0
      r = r * this._width + (s[this._mask & (s[this.i] = s[this.j = this._mask & this.j + t] ?? 0) + (s[this.j] = t)] ?? 0)
    }

    return r
    // For robust unpredictability, the function call below automatically
    // discards an initial batch of values.  This is called RC4-drop[256].
    // See http://google.com/search?q=rsa+fluhrer+response&btnI
  }
}