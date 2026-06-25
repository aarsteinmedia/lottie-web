import {
  describe, expect, test
} from 'vitest'

import {
  addExt,
  clamp,
  createElementID,
  floatEqual,
  floatZero,
  getExt,
  getFilename,
  parseBase64,
} from '@/utils'
import { degToRads, isServer } from '@/utils/helpers/constants'

describe('utils', () => {
  test('compares floats with tolerance', () => {
    expect(floatEqual(1, 1.000001)).toBeTruthy()
    expect(floatEqual(1, 1.1)).toBeFalsy()
    expect(floatZero(0.000001)).toBeTruthy()
    expect(floatZero(0.001)).toBeFalsy()
  })

  test('clamps values and swaps inverted bounds', () => {
    expect(clamp(
      5, 0, 10
    )).toBe(5)
    expect(clamp(
      -1, 0, 10
    )).toBe(0)
    expect(clamp(
      15, 0, 10
    )).toBe(10)
    expect(clamp(
      5, 10, 0
    )).toBe(5)
  })

  test('parses file extensions and filenames', () => {
    expect(getExt('animation.json')).toBe('json')
    expect(getExt('no-extension')).toBeUndefined()
    expect(getFilename('path/to/My File!.json')).toBe('My-File-')
    expect(getFilename('path/to/My File!.json', true)).toBe('My-File-.json')
  })

  test('adds extensions when missing or mismatched', () => {
    expect(addExt('json', 'animation')).toBe('animation.json')
    expect(addExt('json', 'animation.json')).toBe('animation.json')
    expect(addExt('lottie', 'animation.json')).toBe('animation.lottie')
  })

  test('parses base64 data urls', () => {
    expect(parseBase64('data:image/png;base64,abc123')).toBe('abc123')
  })

  test('creates unique element ids', () => {
    const first = createElementID(),
      second = createElementID()

    expect(first).not.toBe(second)
    expect(first).toContain('__lottie_element_')
  })
})

describe('constants', () => {
  test('exposes math helpers', () => {
    expect(degToRads).toBeCloseTo(Math.PI / 180)
  })

  test('detects browser vs server at module load', () => {
    expect(isServer).toBeFalsy()
  })
})
