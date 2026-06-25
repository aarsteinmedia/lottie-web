import type { AnimationItem } from '@/animation/AnimationItem'
import type { AnimationDirection } from '@/types'
import { PlayerEvent } from '@/utils/enums'

export class EnterFrameEvent {
  currentTime: number
  direction: AnimationDirection
  target?: undefined | AnimationItem
  totalTime: number
  type: PlayerEvent
  constructor(
    type: PlayerEvent,
    currentTime: number,
    totalTime: number,
    frameMultiplier: number
  ) {
    this.type = type
    this.currentTime = currentTime
    this.totalTime = totalTime
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class CompleteEvent {
  direction: AnimationDirection
  target?: undefined | AnimationItem
  type: PlayerEvent
  constructor(type: PlayerEvent, frameMultiplier: number) {
    this.type = type
    this.direction = frameMultiplier < 0 ? -1 : 1
  }
}

export class DrawnFrameEvent {
  currentTime: number
  direction: AnimationDirection
  target?: undefined | AnimationItem
  totalTime: number
  type: PlayerEvent
  constructor(
    type: PlayerEvent,
    currentTime: number,
    direction: AnimationDirection,
    totalTime: number
  ) {
    this.type = type
    this.direction = direction
    this.currentTime = currentTime
    this.totalTime = totalTime
  }
}

export class CompleteLoopEvent {
  currentLoop: number
  direction: AnimationDirection
  target?: undefined | AnimationItem
  totalLoops: number | boolean
  type: PlayerEvent
  constructor(
    type: PlayerEvent,
    totalLoops: number | boolean,
    currentLoop: number,
    frameMultiplier: number
  ) {
    this.type = type
    this.currentLoop = currentLoop
    this.totalLoops = totalLoops
    this.direction = frameMultiplier < 0 ? -1 : 1

  }
}

export class SegmentStartEvent {
  firstFrame: number
  target?: undefined | AnimationItem
  totalFrames: number
  type: PlayerEvent
  constructor(
    type: PlayerEvent,
    firstFrame: number,
    totalFrames: number
  ) {
    this.type = type
    this.firstFrame = firstFrame
    this.totalFrames = totalFrames
  }
}

export class DestroyEvent {
  target: AnimationItem
  type: PlayerEvent
  constructor(type: PlayerEvent, target: AnimationItem) {
    this.type = type
    this.target = target
  }
}

export class RenderFrameErrorEvent {
  currentTime: number
  nativeError: unknown
  target?: undefined | AnimationItem
  type = PlayerEvent.RenderFrameError
  constructor(nativeError: unknown, currentTime: number) {
    this.nativeError = nativeError
    this.currentTime = currentTime
  }
}

export class ConfigErrorEvent {
  nativeError: unknown
  target?: undefined | AnimationItem
  type = PlayerEvent.ConfigError
  constructor(nativeError: unknown, _: number) {
    this.nativeError = nativeError
  }
}

export class AnimationConfigErrorEvent {
  nativeError: unknown
  target?: undefined | AnimationItem
  type: PlayerEvent
  constructor(type: PlayerEvent, nativeError: unknown) {
    this.type = type
    this.nativeError = nativeError
  }
}

export abstract class BaseEvent {
  _cbs: Partial<
    Record<PlayerEvent, ((ev?: LottieEvent) => unknown)[] | null>
  > = {}

  addEventListener(eventName: PlayerEvent,
    callback: (ev?: LottieEvent) => unknown): () => void {
    this._cbs[eventName] = this._cbs[eventName] ?? []
    this._cbs[eventName].push(callback)

    return () => {
      this.removeEventListener(eventName, callback)
    }
  }

  removeEventListener(eventName: PlayerEvent,
    callback?: (ev: LottieEvent) => unknown): void {
    if (!callback) {
      this._cbs[eventName] = null

      return
    }

    if (this._cbs[eventName]) {
      let i = 0,
        { length: len } = this._cbs[eventName]

      while (i < len) {
        if (this._cbs[eventName][i] === callback) {
          this._cbs[eventName].splice(i, 1)
          i--
          len--
        }
        i++
      }
      if (this._cbs[eventName].length === 0) {
        this._cbs[eventName] = null
      }
    }
  }

  triggerEvent(eventName: PlayerEvent, ev?: LottieEvent): void {
    if (!this._cbs[eventName]) {
      return
    }
    const { length } = this._cbs[eventName]

    for (let i = 0; i < length; i++) {
      this._cbs[eventName][i]?.(ev)
    }
  }
}

export type LottieEvent =
  | AnimationConfigErrorEvent
  | EnterFrameEvent
  | CompleteEvent
  | CompleteLoopEvent
  | SegmentStartEvent

  | ConfigErrorEvent
  | DestroyEvent
  | DrawnFrameEvent
