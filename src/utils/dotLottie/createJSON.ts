import type { AnimationData } from '@/types'

import {
  addExt, createElementID, download
} from '@/utils'

interface CreateJSONProps {
  animation?: undefined | AnimationData
  fileName?: string
  shouldDownload?: boolean
}

export function createJSON({
  animation,
  fileName,
  shouldDownload,
}: CreateJSONProps) {
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