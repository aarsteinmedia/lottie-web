//@ts-nocheck eslint-disable
import type { BMMath as BMMathType } from '@/types'
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

function copy(f, t) {
  t.i = f.i
  t.j = f.j
  t.S = [...f.S]

  return t
}

function flatten(obj, depth) {
  let result = [], typ = typeof obj, prop

  if (depth && typ == 'object') {
    for (prop in obj) {
      try { result.push(flatten(obj[prop], depth - 1)) } catch (error) { }
    }
  }

  return result.length > 0 ? result : typ == 'string' ? obj : `${obj}\0`
}

function tostring(a) {
  return String.fromCharCode.apply(0, a)
}

function seedRandom(pool, math: Math) {
//
// The following constants are related to IEEE 754 limits.
//
  /**
     * Node.js crypto module, initialized at the bottom.
     */
  let global = this,
    width = 256,
    chunks = 6,
    digits = 52,
    rngname = 'random',
    startdenom = math.pow(width, chunks),
    significance = math.pow(2, digits),
    overflow = significance * 2,
    mask = width - 1,
    nodecrypto


  function seedrandom(
    seed, optionsFromProps, callback
  ) {
    let options = optionsFromProps
    const key = []

    options = options === true ? { entropy: true } : options || {}

    // Flatten the seed string or build one from local entropy if needed.
    const shortseed = mixkey(flatten(options.entropy ? [seed, tostring(pool)] :
      seed === null ? autoseed() : seed, 3), key)

    // Use the seed to initialize an ARC4 generator.
    const arc4 = new ARC4(key)


    const prng = function() {
    /**
     * And no 'extra last byte'.
     */
      let n: number = arc4.g(chunks),
        d = startdenom,
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

    prng.int32 = function() { return arc4.g(4) | 0 }
    prng.quick = function() { return arc4.g(4) / 0x100000000 }
    prng.double = prng

    // Mix the randomness into accumulated entropy.
    mixkey(tostring(arc4.S), pool)

    /**
     * Calling convention: what to return as a function of prng, seed, is_math.
     */
    return (options.pass || callback ||
      function(
        prng, seed, is_math_call, state
      ) {
        if (state) {
          // Load the arc4 state from the given state if it has an S array.
          if (state.S) { copy(state, arc4) }
          /**
           * Only provide the .state method if requested via options.state.
           */
          prng.state = function() { return copy(arc4, {}) }
        }

        // If called as a method of Math (Math.seedrandom()), mutate
        // Math.random because that is how seedrandom.js has worked since v1.0.
        if (is_math_call) { math[rngname] = prng

          return seed }

        // Otherwise, it is a newer calling convention, so return the
        // prng directly.
        return prng
      })(
      prng,
      shortseed,
      'global' in options ? options.global : this == math,
      options.state
    )
  }
  math[`seed${ rngname}`] = seedrandom

  //
  // ARC4
  //
  // An ARC4 implementation.  The constructor takes a key in the form of
  // an array of at most (width) integers that should be 0 <= x < (width).
  //
  // The g(count) method returns a pseudorandom integer that concatenates
  // the next (count) outputs from ARC4.  Its return value is a number x
  // that is in the range 0 <= x < (width ^ count).

  function ARC4(key): number {
    let t, keylen = key.length,
      me = this, i = 0, j = me.i = me.j = 0, s = me.S = []

    // The empty key [] is treated as [0].
    if (!keylen) { key = [keylen++] }

    // Set up S using the standard key scheduling algorithm.
    while (i < width) {
      s[i] = i++
    }
    for (i = 0; i < width; i++) {
      s[i] = s[j = mask & j + key[i % keylen] + (t = s[i])]
      s[j] = t
    }

    /**
     * The "g" method returns the next (count) outputs as one number.
     */
    me.g = function(count) {
      // Using instance members instead of closure state nearly doubles speed.
      let t, r = 0,
        { i } = me, { j } = me, s = me.S

      while (count--) {
        t = s[i = mask & i + 1]
        r = r * width + s[mask & (s[i] = s[j = mask & j + t]) + (s[j] = t)]
      }
      me.i = i; me.j = j

      return r
      // For robust unpredictability, the function call below automatically
      // discards an initial batch of values.  This is called RC4-drop[256].
      // See http://google.com/search?q=rsa+fluhrer+response&btnI
    }
  }


  function mixkey(seed, key) {
    let stringseed = `${seed }`, smear, j = 0

    while (j < stringseed.length) {
      key[mask & j] =
                mask & (smear ^= key[mask & j] * 19) + stringseed.charCodeAt(j++)
    }

    return tostring(key)
  }

  function autoseed() {
    try {
      if (nodecrypto) { return tostring(nodecrypto.randomBytes(width)) }
      const out = new Uint8Array(width);

      (global.crypto || global.msCrypto).getRandomValues(out)

      return tostring(out)
    } catch (error) {
      const browser = global.navigator,
        plugins = browser?.plugins

      return [Date.now(),
        global,
        plugins,
        global.screen,
        tostring(pool)]
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
};

function initialize(BMMath: BMMathType) {
  seedRandom([], BMMath)
}

export default initialize
