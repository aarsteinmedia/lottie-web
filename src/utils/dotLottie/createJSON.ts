import type { AnimationData } from '@/types'

import {
  addExt, createElementID, download
} from '@/utils'

export default function createJSON({
  animation,
  fileName,
  shouldDownload,
}: {
  animation?: AnimationData
  fileName?: string
  shouldDownload?: boolean
}) {
  try {
    if (!animation) {
      throw new Error('createJSON: Missing or malformed required parameter(s):\n - animation\n\'')
    }

    const name = addExt('json', fileName) || `${createElementID()}.json`,
      jsonString = JSON.stringify(animation)

    if (shouldDownload) {
      download(jsonString, {
        mimeType: 'application/json',
        name,
      })

      return null
    }

    return jsonString
  } catch (error) {
    console.error(error)

    return null
  }
}