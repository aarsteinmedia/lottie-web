import { isServer } from '@/utils'

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export default function createNS<T extends SVGElement>(type: string) {
  if (isServer()) {
    /**
     * This lets the function run without errors in a server context,
     * while still working with TypeScript.
     */
    return null as unknown as T
  }

  // return {appendChild:function(){},setAttribute:function(){},style:{}}
  return document.createElementNS('http://www.w3.org/2000/svg', type) as T
}