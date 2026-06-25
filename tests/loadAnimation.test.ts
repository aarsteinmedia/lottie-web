import {
  describe, expect, test
} from 'vitest'

import { loadAnimation } from '@/animation/AnimationManager'
import { PlayerEvent, RendererType } from '@/utils/enums'

import animationData from '../assets/round-corners-modifier.json'

// Registers the SVG renderer, modifiers, and expression plugin.
import '@/LottieSvg'

describe('loadAnimation', () => {
  test('loads inline animation data into an SVG renderer', async () => {
    const container = document.createElement('div')

    document.body.appendChild(container)

    const animation = loadAnimation({
      animationData,
      autoplay: false,
      container,
      loop: false,
      renderer: RendererType.SVG,
    })

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Timed out waiting for DOMLoaded'))
      }, 5000)

      animation.addEventListener(PlayerEvent.DOMLoaded, () => {
        clearTimeout(timeout)
        resolve()
      })
      animation.addEventListener(PlayerEvent.ConfigError, (event) => {
        clearTimeout(timeout)
        reject(event)
      })
    })

    expect(animation.isLoaded).toBeTruthy()
    expect(animation.totalFrames).toBe(60)
    expect(animation.frameRate).toBe(30)
    expect(container.querySelector('svg')).not.toBeNull()

    animation.destroy()
  })
})
