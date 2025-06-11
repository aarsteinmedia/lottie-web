import { isServer } from '@/utils/helpers/constants'

export default function createTag<T extends HTMLElement>(type: string) {
  if (isServer) {
    return null as unknown as T
  }

  return document.createElement(type) as T
}