import type { Constructor } from '@/types'

interface PrototypeProps {
  name: string
  prop: string
}

export const extendPrototype = (sources: Constructor[], destination: Constructor) => {
    const { length } = sources
    let sourcePrototype: Record<string, unknown>

    for (let i = 0; i < length; i++) {
      sourcePrototype = sources[i]?.prototype
      const properties = Object.getOwnPropertyNames(sourcePrototype),
        { length: jLen } = properties

      for (let j = 0; j < jLen; j++) {
        if (properties[j] === 'constructor') {
          continue
        }
        if (Object.hasOwn(sourcePrototype, properties[j] ?? '')) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          destination.prototype[properties[j] ?? ''] = sourcePrototype[properties[j] ?? '']
        }
      }
    }
  },
  getDescriptor = (object: unknown, prop: PropertyKey) => {
    return Object.getOwnPropertyDescriptor(object, prop)
  },
  logPrototype = (sources: Constructor[], destination?: Constructor) => {
    const combinedPrototypes: PrototypeProps[] = [],
      { length } = sources

    let sourcePrototype: Record<string, unknown>

    const destinationProperties = Object.getOwnPropertyNames(destination?.prototype as Record<string, unknown> | undefined ?? {})

    for (let i = length - 1; i >= 0; i--) {
      sourcePrototype = sources[i]?.prototype

      const { name } = sources[i] ?? { name: '' },
        properties = Object.getOwnPropertyNames(sourcePrototype),
        { length: jLen } = properties

      for (let j = 0; j < jLen; j++) {
        if (
          properties[j] === 'constructor' ||
          combinedPrototypes.some(({ prop }) => prop === properties[j]) ||
          destinationProperties.includes(properties[j] ?? '')
        ) {
          continue
        }
        combinedPrototypes.push({
          name,
          prop: properties[j] ?? ''
        })
      }
    }

    console.debug(combinedPrototypes)
  }