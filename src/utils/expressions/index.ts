import type Expressions from '@/utils/expressions/Expressions'
import type getInterface from '@/utils/expressions/InterfacesProvider'

const expressions: {
  interface: null | typeof getInterface
  plugin: null | typeof Expressions
} = {
  interface: null,
  plugin: null
}

export const setExpressionsPlugin = (value: typeof Expressions) => {
    expressions.plugin = value
  },
  getExpressionsPlugin = () => expressions.plugin,
  setExpressionInterfaces = (value: typeof getInterface) => {
    expressions.interface = value
  },
  getExpressionInterfaces = () => expressions.interface