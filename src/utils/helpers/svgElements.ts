import { _isServer, namespaceSVG } from '@/utils/helpers/constants'

export default function createNS<T extends SVGElement>(type: string) {
  if (_isServer) {
    /**
     * This lets the function run without errors in a server context,
     * while still working with TypeScript.
     */
    return null as unknown as T
  }

  return document.createElementNS(namespaceSVG, type) as T
}