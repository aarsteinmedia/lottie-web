import { isServer } from '@/utils'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export default function createTag<T extends HTMLElement>(type: string) {
  if (isServer()) {
    return null as unknown as T
  }

  return document.createElement(type) as T
}