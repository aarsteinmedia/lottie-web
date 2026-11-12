import { IS_SERVER } from '@/utils/helpers/constants'

export function createTag<T extends HTMLElement>(type: string) {
  if (IS_SERVER) {
    return null as unknown as T
  }

  return document.createElement(type) as T
}