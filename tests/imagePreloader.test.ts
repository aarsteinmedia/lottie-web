import {
  afterEach, beforeEach, describe, expect, test, vi
} from 'vitest'

import type { AnimationData, LottieAsset } from '@/types'

import { loadAnimation } from '@/animation/AnimationManager'
import { PlayerEvent, RendererType } from '@/utils/enums'
import { ImagePreloader } from '@/utils/ImagePreloader'
// Registers the SVG renderer used by the shared image test.
import '@/LottieSvg'

const createAsset = () => ({
    h: 10,
    id: 'image_0',
    p: 'image.png',
    u: '',
    w: 10,
  }) as LottieAsset,

  pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',

  createImageLayer = (ind: number) => ({
    ind,
    ip: 0,
    ks: {
      a: {
        a: 0,
        k: [0,
          0,
          0]
      },
      o: {
        a: 0,
        k: 100
      },
      p: {
        a: 0,
        k: [0,
          0,
          0]
      },
      r: {
        a: 0,
        k: 0
      },
      s: {
        a: 0,
        k: [100,
          100,
          100]
      },
    },
    op: 10,
    refId: 'image_0',
    st: 0,
    ty: 2,
  }),

  /**
   * jsdom has no SVGImageElement, so without this the preloaded-image reuse
   * path in ImageElement never runs.
   */
  stubSVGImageElement = () => {
    vi.stubGlobal('SVGImageElement', {
      [Symbol.hasInstance]: (el: unknown) =>
        el instanceof Element && el.localName === 'image'
    })
  }

describe('ImagePreloader (SVG)', () => {
  beforeEach(() => {
    // Per spec, drawImage on a not-yet-decoded image silently does nothing.
    // The canvas mock throws for SVGImageElement instead, so match real browsers.
    vi.spyOn(CanvasRenderingContext2D.prototype, 'drawImage').mockImplementation(() => undefined)
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  test('waits for the image load event before reporting images as loaded', () => {
    vi.useFakeTimers()
    const preloader = new ImagePreloader(),
      asset = createAsset(),
      onLoaded = vi.fn()

    preloader.setCacheType(RendererType.SVG)
    preloader.loadAssets([asset], onLoaded)
    vi.advanceTimersByTime(1000)

    expect(onLoaded).toHaveBeenCalledOnce()
    expect(preloader.loadedImages()).toBeTruthy()

    preloader.getAsset(asset)?.dispatchEvent(new Event('load'))

    expect(onLoaded).toHaveBeenCalledOnce()
    expect(preloader.loadedImages()).toBeTruthy()
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

  test('hands the preloaded image to the first layer and clones it for later ones', () => {
    stubSVGImageElement()
    const preloader = new ImagePreloader(),
      asset = createAsset()

    preloader.setCacheType(RendererType.SVG)
    preloader.loadAssets([asset], vi.fn())

    const preloaded = preloader.getAsset(asset),
      first = preloader.adoptSvgImage(asset),
      second = preloader.adoptSvgImage(asset)

    expect(first).toBe(preloaded)
    expect(second).not.toBe(preloaded)
    expect(second?.outerHTML).toBe(preloaded?.outerHTML)
    preloader.destroy()
  })

  test('renders a shared image asset in every layer that uses it', async () => {
    stubSVGImageElement()
    const container = document.createElement('div'),
      animationData = {
        assets: [{
          ...createAsset(),
          e: 1,
          p: pixel,
        }],
        fr: 30,
        h: 10,
        ip: 0,
        layers: [createImageLayer(1), createImageLayer(2)],
        op: 10,
        v: '5.7.0',
        w: 10,
      } as unknown as AnimationData

    document.body.appendChild(container)

    const animation = loadAnimation({
      animationData,
      autoplay: false,
      container,
      loop: false,
      renderer: RendererType.SVG,
    })

    await new Promise<void>((resolve) => {
      animation.addEventListener(PlayerEvent.DOMLoaded, () => {
        resolve()
      })
    })

    // A DOM node has one parent: reusing the same preloaded node for both
    // layers would move it out of the first layer and leave an empty group.
    expect(container.querySelectorAll('image')).toHaveLength(2)

    animation.destroy()
    container.remove()
  })
})
