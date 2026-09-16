import type { AnimationData } from '@/types'

import {
  addExt, createElementID, devError, download
} from '@/utils'

interface CreateJSONProps {
  animation?: undefined | AnimationData
  filename?: undefined | string
  shouldDownload?: undefined | boolean
}

export function createJSON({
  animation,
  filename,
  shouldDownload,
}: CreateJSONProps) {
  try {
    if (!animation) {
      throw new Error('createJSON: Missing or malformed required parameter(s):\n - animation\n\'')
    }

    const name = addExt('json', filename) || `${createElementID()}.json`,
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
    devError(error)

    return null
  }
}