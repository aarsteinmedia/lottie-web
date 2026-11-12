import { IS_SERVER, NAMESPACE_SVG } from '@/utils/helpers/constants'

export function createNS<T extends SVGElement>(type: string) {
  if (IS_SERVER) {
    /**
     * This lets the function run without errors in a server context,
     * while still working with TypeScript.
     */
    return null as unknown as T
  }

  return document.createElementNS(NAMESPACE_SVG, type) as T
}