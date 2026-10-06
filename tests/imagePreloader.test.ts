import {
  afterEach, beforeEach, describe, expect, test, vi
} from 'vitest'

import type { LottieAsset } from '@/types'

import { RendererType } from '@/utils/enums'
import { ImagePreloader } from '@/utils/ImagePreloader'

const createAsset = () => ({
  h: 10,
  id: 'image_0',
  p: 'image.png',
  u: '',
  w: 10,
}) as LottieAsset

describe('ImagePreloader (SVG)', () => {
  beforeEach(() => {
    // Per spec, drawImage on a not-yet-decoded image silently does nothing.
    // The canvas mock throws for SVGImageElement instead, so match real browsers.
    vi.spyOn(CanvasRenderingContext2D.prototype, 'drawImage').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test('waits for the image load event before reporting images as loaded', () => {
    vi.useFakeTimers()
    const preloader = new ImagePreloader(),
      asset = createAsset(),
      onLoaded = vi.fn()

    preloader.setCacheType(RendererType.SVG)
    preloader.loadAssets([asset], onLoaded)
    vi.advanceTimersByTime(1000)

    expect(onLoaded).not.toHaveBeenCalled()
    expect(preloader.loadedImages()).toBe(false)

    preloader.getAsset(asset)?.dispatchEvent(new Event('load'))

    expect(onLoaded).toHaveBeenCalledOnce()
    expect(preloader.loadedImages()).toBe(true)
    preloader.destroy()
  })

  test('reports an image that never loads after the fallback timeout', () => {
    vi.useFakeTimers()
    const preloader = new ImagePreloader(),
      onLoaded = vi.fn()

    preloader.setCacheType(RendererType.SVG)
    preloader.loadAssets([createAsset()], onLoaded)
    vi.runAllTimers()

    expect(onLoaded).toHaveBeenCalledOnce()
    preloader.destroy()
  })

  test('destroy clears pending timers for every image', () => {
    vi.useFakeTimers()
    const preloader = new ImagePreloader()

    preloader.setCacheType(RendererType.SVG)
    preloader.loadAssets([
      createAsset(), {
        ...createAsset(),
        id: 'image_1'
      }
    ], vi.fn())
    preloader.destroy()

    expect(vi.getTimerCount()).toBe(0)
  })
})
