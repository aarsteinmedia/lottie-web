import type { Constructor } from '@/types'

interface MixinTarget {
  name: string
  prototype: object
}

interface MixinSource<S> { prototype: S }

interface PrototypeProps {
  name: string
  prop: string
}

/**
 * Copy methods from `source`'s prototype onto `target`'s, once per class
 * rather than once per instance. `keys` is checked against `source`, so a
 * typo or a renamed method fails to compile. Pair it with an interface named
 * like the target class (declaration merging) so the compiler sees the methods.
 */
export const mixin = <S extends object, K extends keyof S & string>(
  target: MixinTarget,
  source: MixinSource<S>,
  keys: readonly K[]
) => {
  const from = source.prototype,
    to = target.prototype as Record<string, unknown>

  for (const key of keys) {
    if (Object.hasOwn(to, key)) {
      throw new Error(`mixin: ${target.name}.${key} is already defined on the class`)
    }
    to[key] = from[key]
  }
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