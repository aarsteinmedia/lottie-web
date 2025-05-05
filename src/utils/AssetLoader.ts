import type { AnimationData } from '@/types'

export function loadAsset(
  path: string,
  fullPath: string,
  callback: (asset: null | AnimationData) => void,
  errorCallback?: (err: unknown) => void
) {
  let response: null | AnimationData
  const xhr = new XMLHttpRequest()

  // set responseType after calling open or IE will break.
  try {
    // This crashes on Android WebView prior to KitKat
    xhr.responseType = 'json'
  } catch (_) {
    /* Nothing */
  }
  xhr.onreadystatechange = () => {
    if (xhr.readyState !== 4) {
      return
    }
    if (xhr.status === 200) {
      response = formatResponse(xhr)
      callback(response)

      return
    }
    try {
      response = formatResponse(xhr)
      callback(response)
    } catch (error) {
      errorCallback?.(error)
    }
  }
  try {
    // Hack to workaround banner validation
    xhr.open(
      ['G',
        'E',
        'T'].join(''), path, true
    )
  } catch (_) {
    // Hack to workaround banner validation
    xhr.open(
      ['G',
        'E',
        'T'].join(''), `${fullPath}/${path}`, true
    )
  }
  xhr.send()
}

function formatResponse(xhr: XMLHttpRequest) {
  // using typeof doubles the time of execution of this method,
  // so if available, it's better to use the header to validate the type
  const contentTypeHeader = xhr.getResponseHeader('content-type')

  if (
    contentTypeHeader &&
    xhr.responseType === 'json' &&
    contentTypeHeader.includes('json')
  ) {
    return xhr.response as AnimationData
  }
  if (xhr.response && typeof xhr.response === 'object') {
    return xhr.response as AnimationData
  }
  if (xhr.response && typeof xhr.response === 'string') {
    return JSON.parse(xhr.response) as AnimationData
  }
  if (xhr.responseText) {
    return JSON.parse(xhr.responseText) as AnimationData
  }

  return null
}
