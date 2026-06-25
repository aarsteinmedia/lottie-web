import {
  describe, expect, vi, test
} from 'vitest'

import { BaseEvent } from '@/events'
import { PlayerEvent } from '@/utils/enums'

class TestEventEmitter extends BaseEvent {}

describe('baseEvent', () => {
  test('adds, triggers, and removes listeners', () => {
    const emitter = new TestEventEmitter(),
      callback = vi.fn()

    emitter.addEventListener(PlayerEvent.Complete, callback)
    emitter.triggerEvent(PlayerEvent.Complete)
    expect(callback).toHaveBeenCalledOnce()

    emitter.removeEventListener(PlayerEvent.Complete, callback)
    emitter.triggerEvent(PlayerEvent.Complete)
    expect(callback).toHaveBeenCalledOnce()
  })

  test('returns an unsubscribe function from addEventListener', () => {
    const emitter = new TestEventEmitter(),
      callback = vi.fn(),
      unsubscribe = emitter.addEventListener(PlayerEvent.Loop, callback)

    unsubscribe()
    emitter.triggerEvent(PlayerEvent.Loop)
    expect(callback).not.toHaveBeenCalled()
  })

  test('clears all listeners when removeEventListener is called without a callback', () => {
    const emitter = new TestEventEmitter(),
      first = vi.fn(),
      second = vi.fn()

    emitter.addEventListener(PlayerEvent.Destroy, first)
    emitter.addEventListener(PlayerEvent.Destroy, second)
    emitter.removeEventListener(PlayerEvent.Destroy)
    emitter.triggerEvent(PlayerEvent.Destroy)

    expect(first).not.toHaveBeenCalled()
    expect(second).not.toHaveBeenCalled()
  })
})
