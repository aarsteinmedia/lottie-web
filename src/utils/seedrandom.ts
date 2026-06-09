import type NodeCrypto from 'node:crypto'

import type { BMMath } from '@/types'

import { ARC4 } from '@/utils/ARC4'
/*
 Copyright 2014 David Bau.

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
 CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 */

interface SeedRandomOptions {
  entropy?: boolean
  global?: boolean
  pass?: PassHandler
  state?: ARC4
}

type PassHandler = (
  returnPRGN: PRNG,
  returnSeed: string,
  isMathCall: boolean,
  state?: ARC4
) => unknown

interface PRNG {
  double: PRNG
  (): number
  init32: () => number
  quick: () => number
  state?: () => ARC4
}

/**
 * Copies internal state of ARC4 to or from a plain object.
 */
function copy(f: ARC4, t: ARC4) {
  t.i = f.i
  t.j = f.j
  t.S = [...f.S]

  return t
}

/**
 * Converts an object tree to nested arrays of strings.
 */
function flatten(obj: unknown, depth = 0) {
  const result: (string | number)[] = [],
    typ = typeof obj

  if (depth && typ === 'object') {

    const keys = Object.keys(obj as number[]),
      { length } = keys

    for (let i = 0; i < length; i++) {
      try {
        result.push(flatten((obj as string[])[keys[i] as keyof typeof obj]) as number, depth - 1)
      } catch (error) {
        //
      }
    }
  }

  if (result.length > 0) {
    return result
  }

  return typ === 'string' ? obj : `${obj as number}\0`
}

/**
 * Converts an array of charcodes to a string.
 */
function tostring(a: number[]) {
  return String.fromCharCode.apply(0, a)
}

function seedRandom(pool: number[], math: BMMath) {
  //
  // The following constants are related to IEEE 754 limits.
  //
  /**
     * Node.js crypto module, initialized at the bottom.
     */
  const width = 256,
    /**
     * Each RC4 output is 0 \<= x \< 256.
     */
    chunks = 6, /**
     * At least six RC4 outputs for each double.
     */
    digits = 52, /**
     * There are 52 significant digits in a double.
     */
    rngname = 'random', /**
     * Rngname: name for Math.random and Math.seedrandom.
     */
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1
  let nodecrypto: undefined | typeof NodeCrypto

  //
  // seedrandom()
  /**
   * This is the seedrandom function described above.
   */
  function seedrandom(
    seedFromProps: string | null,
    optionsFromProps?: SeedRandomOptions | boolean,
    callback?: PassHandler
  ) {
    let options = optionsFromProps
    const key: number[] = []

    options = options === true ? { entropy: true } : options ?? {}

    // Flatten the seed string or build one from local entropy if needed.
    let seed: null | ReturnType<typeof autoseed> = seedFromProps

    if (options && options.entropy) {
      seed = [seedFromProps ?? '', tostring(pool)]
    } else {seed = seed ?? autoseed()}
    const shortseed = mixkey(flatten(seed, 3) as number, key)

    // Use the seed to initialize an ARC4 generator.
    const arc4 = new ARC4(
      key, width, mask
    )

    /**
     * This function returns a random double in [0, 1) that contains
     * Randomness in every bit of the mantissa of the IEEE 754 value.
     */
    const prng = () => {
      /**
       * And no 'extra last byte'.
       */
      let n = arc4.g(chunks),
        /**
         * Start with a numerator n \< 2 ^ 48.
         */
        d = startdenom,
        /**
         * And denominator d = 2 ^ 48.
         */
        x = 0

      while (n < significance) { // Fill up all significant digits by
        n = (n + x) * width //   shifting numerator and
        d *= width //   denominator and generating a
        x = arc4.g(1) //   new least-significant-byte.
      }
      while (n >= overflow) { // To avoid rounding up, before adding
        n /= 2 //   last byte, shift everything
        d /= 2 //   right using integer math until
        x >>>= 1 //   we have exactly the desired bits.
      }

      return (n + x) / d // Form the number within [0, 1).
    }

    prng.int32 = () => arc4.g(4) | 0
    prng.quick = () => arc4.g(4) / 0x100000000
    prng.double = prng

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool)

    const defaultHandler: PassHandler = (
      returnPRGN, returnSeed, isMathCall, state
    ) => {
      if (state) {
        copy(state, arc4)
        returnPRGN.state = () => copy(arc4, {} as ARC4)
      }
      if (isMathCall) {
        math[rngname] = prng

        return returnSeed
      }

      return returnPRGN
    }

    let handler = defaultHandler

    if (options && options.pass) {
      handler = options.pass
    } else if (callback) {
      handler = callback
    }

    /**
     * Calling convention: what to return as a function of prng, seed, is_math.
     */
    return handler(
      prng as unknown as PRNG,
      shortseed,
      // @ts-expect-error: this is any
      options && 'global' in options ? options.global : this === math,
      options ? options.state : undefined
    )
  }

  // @ts-expect-error: string number confusion
  math[`seed${rngname}`] = seedrandom

  /**
   * Mixes a string seed into a key that is an array of integers, and Returns a shortened string seed that is equivalent to the result key.
   */
  function mixkey(seed: string | number, key: number[]) {
    const stringseed = `${seed}`
    let smear = 0,
      j = 0

    while (j < stringseed.length) {
      key[mask & j] =
        mask & (smear ^= (key[mask & j] ?? 0) * 19) + stringseed.charCodeAt(j++)
    }

    return tostring(key)
  }

  /**
   * Returns an object for autoseeding, using window.crypto and Node crypto Module if available.
   */
  function autoseed() {
    try {
      if (nodecrypto) {
        return tostring(nodecrypto.randomBytes(width) as unknown as number[])
      }
      const out = new Uint8Array(width)

      global.crypto.getRandomValues(out)

      return tostring(out as unknown as number[])
    } catch (error) {
      const { navigator: { plugins }, screen } = global

      return [
        Date.now(),
        global,
        plugins,
        screen,
        tostring(pool)
      ]
    }
  }

  //
  // When seedrandom.js is loaded, we immediately mix a few bits
  // from the built-in RNG into the entropy pool.  Because we do
  // not want to interfere with deterministic PRNG state later,
  // seedrandom will not call math.random on its own again after
  // initialization.
  //
  mixkey(math.random(), pool)

  //
  // Nodejs and AMD support: export the implementation as a module using
  // either convention.
  //

  // End anonymous scope, and pass initial values.
}

export default function initialize(BMMath: BMMath) {
  seedRandom([], BMMath)
}
