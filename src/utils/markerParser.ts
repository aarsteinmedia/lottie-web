import type { Marker, MarkerData } from '@/types'

const parsePayloadLines = (payload: string) => {
  const lines = payload.split('\r\n'),
    keys: Record<string, string> = {},
    { length } = lines
  let keysCount = 0

  for (let i = 0; i < length; i++) {
    const line = lines[i]?.split(':') ?? []

    if (line.length === 2) {
      // @ts-expect-error: TODO:
      keys[line[0]] = line[1]?.trim()
      keysCount++
    }
  }
  if (keysCount === 0) {
    throw new Error('Could not parse markers')
  }

  return keys
}

export function markerParser(markersFromProps: (MarkerData | Marker)[]) {
  const markers = [],
    { length } = markersFromProps

  for (let i = 0; i < length; i++) {
    if ('duration' in (markersFromProps[i] ?? {})) {
      markers.push(markersFromProps[i])
      continue
    }

    const markerData: MarkerData = {
      duration: (markersFromProps[i] as Marker).dr,
      time: (markersFromProps[i] as Marker).tm,
    }

    try {
      markerData.payload = JSON.parse((markersFromProps[i] as Marker).cm)
    } catch (_) {
      try {
        markerData.payload = parsePayloadLines((markersFromProps[i] as Marker).cm)
      } catch (error) {
        markerData.payload = { name: (markersFromProps[i] as Marker).cm }
      }
    }
    markers.push(markerData)
  }

  return markers
}