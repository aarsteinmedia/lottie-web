import type { LottieEvent } from '@/events'
import type {
  AnimationConfiguration,
  AnimationData,
  AnimationDirection,
} from '@/types'

import { AnimationItem } from '@/animation/AnimationItem'
import { RendererType } from '@/utils/enums'
import { isServer } from '@/utils/helpers/constants'
import { createTag } from '@/utils/helpers/htmlElements'

interface RegisteredAnimation {
  animation: AnimationItem
  elem: HTMLElement | null
}

let _isFrozen = false,
  _isStopped = true,
  initTime = 0,
  len = 0,
  playingAnimationsNum = 0
const registeredAnimations: RegisteredAnimation[] = []

export function destroy(animation?: string) {
  for (let i = len - 1; i >= 0; i--) {
    registeredAnimations[i]?.animation.destroy(animation)
  }
}
export function freeze() {
  _isFrozen = true
}

export function getRegisteredAnimations() {
  const lenAnims = registeredAnimations.length,
    animations = []

  for (let i = 0; i < lenAnims; i++) {
    animations.push(registeredAnimations[i]?.animation)
  }

  return animations
}

export function goToAndStop(
  value: number,
  isFrame?: boolean,
  animation?: string
) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.goToAndStop(
      value, isFrame, animation
    )
  }
}

export function loadAnimation(params: AnimationConfiguration) {
  try {
    const animItem = new AnimationItem()

    setupAnimation(animItem, null)
    animItem.setParams(params)

    return animItem
  } catch (error) {
    console.error('AnimationManager:\n', error)
    throw new Error('Could not load animation')
  }
}

export function mute(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.mute(animation)
  }
}

export function pause(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.pause(animation)
  }
}

export function play(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.play(animation)
  }
}

export function registerAnimation(element: HTMLElement | null,
  animationData?: AnimationData) {
  try {
    if (!element) {
      return null
    }
    let i = 0

    while (i < len) {
      if (
        registeredAnimations[i]?.elem === element &&
        registeredAnimations[i]?.elem !== null
      ) {
        return registeredAnimations[i]?.animation
      }
      i++
    }
    const animItem = new AnimationItem()

    setupAnimation(animItem, element)
    animItem.setData(element, animationData)

    return animItem
  } catch (error) {
    console.error('AnimationManager:\n', error)
    throw new Error('Could not register animation')
  }
}
export function resize() {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.resize()
  }
}

export function searchAnimations(
  animationData?: AnimationData,
  standalone?: boolean,
  rendererFromProps?: RendererType
) {
  if (isServer) {
    return
  }
  let renderer = rendererFromProps
  const animElements = [
      ...document.getElementsByClassName('lottie'), ...document.getElementsByClassName('bodymovin')
    ] as HTMLElement[],
    { length } = animElements

  for (let i = 0; i < length; i++) {
    const animElement = animElements[i]

    if (!animElement) {
      continue
    }

    if (renderer) {
      animElement.dataset.bmType = renderer
    }
    registerAnimation(animElement, animationData)
  }
  if (standalone && length === 0) {
    if (!renderer) {
      renderer = RendererType.SVG
    }
    const { body } = document

    body.innerText = ''
    const div = createTag('div')

    div.style.width = '100%'
    div.style.height = '100%'
    div.dataset.bmType = renderer
    body.appendChild(div)
    registerAnimation(div, animationData)
  }
}

export function setDirection(val: AnimationDirection, animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.setDirection(val, animation)
  }
}

export function setSpeed(val: number, animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.setSpeed(val, animation)
  }
}

export function setVolume(val: number, animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.setVolume(val, animation)
  }
}

export function stop(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.stop(animation)
  }
}

export function togglePause(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.togglePause(animation)
  }
}
export function unfreeze() {
  _isFrozen = false
  activate()
}

export function unmute(animation?: string) {
  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.unmute(animation)
  }
}
function activate() {
  if (_isFrozen || !playingAnimationsNum || !_isStopped || isServer) {
    return
  }
  window.requestAnimationFrame(first)
  _isStopped = false
}
function addPlayingCount() {
  playingAnimationsNum++
  activate()
}

function first(nowTime: number) {
  initTime = nowTime
  if (!isServer) {
    window.requestAnimationFrame(resume)
  }
}

function removeElement({ target: animItem }: LottieEvent) {
  let i = 0

  if (!animItem) {
    throw new Error('No animation to remove')
  }
  while (i < len) {
    if (registeredAnimations[i]?.animation === animItem) {
      registeredAnimations.splice(i, 1)
      i--
      len -= 1
      if (!animItem.isPaused) {
        subtractPlayingCount()
      }
    }
    i++
  }
}

function resume(nowTime: number) {
  const elapsedTime = nowTime - initTime

  for (let i = 0; i < len; i++) {
    registeredAnimations[i]?.animation.advanceTime(elapsedTime)
  }
  initTime = nowTime
  if (playingAnimationsNum && !_isFrozen) {
    if (!isServer) {
      window.requestAnimationFrame(resume)
    }
  } else {
    _isStopped = true
  }
}

function setupAnimation(animItem: AnimationItem, element: HTMLElement | null) {
  animItem.addEventListener('destroy', removeElement as () => void)
  animItem.addEventListener('_active', addPlayingCount)
  animItem.addEventListener('_idle', subtractPlayingCount)
  registeredAnimations.push({
    animation: animItem,
    elem: element
  })
  len++
}
function subtractPlayingCount() {
  playingAnimationsNum--
}

const AnimationManager = {
  destroy,
  freeze,
  getRegisteredAnimations,
  goToAndStop,
  loadAnimation,
  mute,
  pause,
  play,
  registerAnimation,
  resize,
  searchAnimations,
  setDirection,
  setSpeed,
  setVolume,
  stop,
  togglePause,
  unfreeze,
  unmute,
}

export default AnimationManager