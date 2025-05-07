import { createSizedArray } from '@/utils/helpers/arrays'

export default function double(arr: unknown[]) {
  return [...arr, ...createSizedArray(arr.length)]
}
